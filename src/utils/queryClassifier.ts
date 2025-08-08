import { openai } from './openai';
import { ChatMessage } from '@/types';

export interface ClassificationResult {
  needsRealTimeData: boolean;
  confidence: number; // 0-1
  topics: string[]; // e.g., "weather", "exchange rate", "news", etc.
  suggestedSearchTerms: string[]; // optimized search terms for web scraping
  queryType?: string;
}

export interface EnhancedClassificationResult extends ClassificationResult {
  processingType: "individual" | "contextual";
  requiresWebSearch: boolean;
  relevantContextIndices: number[]; // Indices of relevant messages in history
}

/**
 * Classifies a query to determine if it needs real-time data
 * Optimized with client-side pattern matching to avoid API calls for common cases
 */
export async function classifyQuery(query: string): Promise<ClassificationResult> {
  try {
    // For simple cases, use regex patterns for common time-sensitive queries
    const timePatterns = [
      /today['']?s/i,
      /current(?:ly)?/i,
      /latest/i,
      /right now/i,
      /this (?:morning|afternoon|evening)/i,
      /up-to-date/i,
      /live/i,
    ];
    
    // Check for common time-sensitive topics with simple patterns
    const topicPatterns = {
      weather: [/weather/i, /temperature/i, /forecast/i, /rain/i, /snow/i, /humid/i],
      finance: [/stock/i, /price/i, /market/i, /rate/i, /exchange/i, /currency/i, /dollar/i, /euro/i, /gold/i, /bitcoin/i, /crypto/i],
      news: [/news/i, /headline/i, /breaking/i, /happened/i, /event/i],
      sports: [/score/i, /match/i, /game/i, /fixture/i, /result/i, /standings/i, /league/i],
    };
    
    // Check if query contains time-sensitive patterns
    const hasTimePattern = timePatterns.some(pattern => pattern.test(query));
    
    // Identify potential topics
    const detectedTopics: string[] = [];
    for (const [topic, patterns] of Object.entries(topicPatterns)) {
      if (patterns.some(pattern => pattern.test(query))) {
        detectedTopics.push(topic);
      }
    }
    
    // Check for specific entity comparisons (like "AAPL vs MSFT" or company/product comparisons)
    const comparisonPattern = /\b(vs|versus|compare|comparison)\b/i;
    const hasComparison = comparisonPattern.test(query);
    
    // Check for version-related queries (software versions, releases, etc.)
    const versionPattern = /\b(version|release|update|latest|newest|current)\b/i;
    const hasVersionQuery = versionPattern.test(query);
    
    // For simple cases, we can avoid calling GPT completely
    if ((hasTimePattern && detectedTopics.length > 0) || hasVersionQuery || hasComparison) {
      console.log('Fast path: Using regex classification');
      return {
        needsRealTimeData: true,
        confidence: 0.9,
        topics: detectedTopics.length > 0 ? detectedTopics : ["general"],
        suggestedSearchTerms: [
          query,
          `latest ${query}`, 
          `current ${query} ${new Date().getFullYear()}`,
          ...detectedTopics.map(topic => `${topic} ${query} latest`)
        ]
      };
    }
    
    // Detect fact-based questions that likely need real-time data
    const factPatterns = [
      /\bwhat\s+is\s+(?:the|a)\s+(?!difference|reason|cause|purpose)/i, // "What is the capital of" etc.
      /\bhow\s+(?:much|many)/i, // "How much does", "How many people"
      /\bwhere\s+(?:is|are)/i, // "Where is", "Where are"
      /\bwhen\s+(?:is|was|will)/i, // "When is", "When was", "When will"
    ];
    
    const isFactQuestion = factPatterns.some(pattern => pattern.test(query));
    
    // Check for "how to" questions that less likely need real-time data
    const howToPattern = /\bhow\s+to\b/i;
    const isHowToQuestion = howToPattern.test(query);
    
    // Check if the query is conceptual/theoretical (less likely to need real-time data)
    const conceptualPatterns = [
      /\bdefinition\b/i,
      /\bmeaning\b/i,
      /\bconcept\b/i,
      /\bexplain\b/i,
      /\btheory\b/i,
      /\bwhy\s+(?:is|are|does|do|did)/i,
    ];
    
    const isConceptualQuestion = conceptualPatterns.some(pattern => pattern.test(query));
    
    // For fact questions, we can avoid GPT and use a lightweight classification
    if (isFactQuestion && !isConceptualQuestion) {
      console.log('Fast path: Classified as fact question');
      return {
        needsRealTimeData: true,
        confidence: 0.8,
        topics: ['factual'],
        suggestedSearchTerms: [query]
      };
    }
    
    // For "how to" questions that are less likely to need real-time data
    if (isHowToQuestion && !hasTimePattern) {
      console.log('Fast path: Classified as how-to question');
      return {
        needsRealTimeData: false,
        confidence: 0.7,
        topics: ['instructional'],
        suggestedSearchTerms: [query]
      };
    }
    
    // For conceptual/theoretical questions
    if (isConceptualQuestion && !hasTimePattern) {
      console.log('Fast path: Classified as conceptual question');
      return {
        needsRealTimeData: false,
        confidence: 0.7,
        topics: ['conceptual'],
        suggestedSearchTerms: [query]
      };
    }
    
    // For more complex cases, use GPT to classify but with shorter context
    console.log('Falling back to GPT classification');
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-2025-04-14", // Upgraded flagship model
      messages: [
        {
          role: "system",
          content: `Analyze if this query needs real-time data from the web. 
            Respond only with a JSON object with these fields:
            - needsRealTimeData: boolean
            - confidence: float between 0 and 1
            - topics: array of strings (e.g., "weather", "finance", "news")
            - suggestedSearchTerms: array of 1-3 search terms`
        },
        {
          role: "user",
          content: query
        }
      ],
      response_format: { type: "json_object" }
    });
    
    try {
      const result = JSON.parse(response.choices[0].message.content);
      return {
        needsRealTimeData: result.needsRealTimeData,
        confidence: result.confidence,
        topics: result.topics || [],
        suggestedSearchTerms: result.suggestedSearchTerms || [query]
      };
    } catch (e) {
      console.error("Error parsing GPT response:", e);
      // Fallback to pattern-based classification
      return {
        needsRealTimeData: hasTimePattern || hasVersionQuery || hasComparison,
        confidence: 0.6,
        topics: detectedTopics.length > 0 ? detectedTopics : ["general"],
        suggestedSearchTerms: [query]
      };
    }
  } catch (error) {
    console.error("Error classifying query:", error);
    // Fallback when GPT call fails
    return {
      needsRealTimeData: false,
      confidence: 0.5,
      topics: [],
      suggestedSearchTerms: [query]
    };
  }
}

/**
 * Enhanced classifier that considers conversation context
 */
export async function classifyQueryWithContext(
  query: string, 
  conversationHistory: ChatMessage[]
): Promise<EnhancedClassificationResult> {
  try {
    // Base classification first (reusing existing logic)
    const baseClassification = await classifyQuery(query);
    
    // Default values
    let processingType: "individual" | "contextual" = "individual";
    let requiresWebSearch = baseClassification.needsRealTimeData;
    const relevantContextIndices: number[] = [];
    
    // Short circuit for empty history
    if (!conversationHistory || conversationHistory.length === 0) {
      return {
        ...baseClassification,
        processingType,
        requiresWebSearch,
        relevantContextIndices
      };
    }
    
    // Check for contextual indicators in the query
    const contextualIndicators = [
      /\b(?:it|this|that|those|these|they|them|their|its)\b/i,  // Pronouns
      /\b(?:the|said|mentioned|above|previous)\b/i,             // Referring expressions
      /\b(?:also|too|as well|again|more|another|additional)\b/i, // Continuation
      /\b(?:and what about|how about|what else|tell me more)\b/i // Follow-up phrases
    ];
    
    const hasContextualIndicator = contextualIndicators.some(pattern => pattern.test(query));
    
    // Check for question fragments (likely follow-ups)
    const isQuestionFragment = query.trim().split(' ').length <= 5 && 
      !/\b(?:who|what|when|where|why|how)\b/i.test(query.toLowerCase().split(' ')[0]);
      
    // Detect if this is a very short response that may rely on previous context
    const isShortQuery = query.trim().length < 15;
    
    // Analyze recent conversation to find relevant context
    const recentMessages = conversationHistory.slice(-6); // Look at last 3 exchanges (6 messages)
    
    for (let i = recentMessages.length - 1; i >= 0; i--) {
      const message = recentMessages[i];
      
      // Skip user's own messages when looking for answers (but include for context)
      if (message.role === 'user') {
        // Simple topic matching between current query and previous queries
        const currentQueryWords = new Set(
          query.toLowerCase().split(/\W+/).filter(w => w.length > 3)
        );
        
        const previousQueryWords = new Set(
          message.content.toLowerCase().split(/\W+/).filter(w => w.length > 3)
        );
        
        // Check word overlap
        let commonWords = 0;
        for (const word of currentQueryWords) {
          if (previousQueryWords.has(word)) commonWords++;
        }
        
        // If sufficient overlap or this message is very recent, mark as relevant
        if (commonWords > 0 || i >= recentMessages.length - 2) {
          relevantContextIndices.push(i);
        }
      } else if (message.role === 'assistant') {
        // For assistant messages, we want to know if current query might be referring to this
        relevantContextIndices.push(i);
      }
    }
    
    // Determine processing type based on evidence
    if (
      hasContextualIndicator || 
      isQuestionFragment || 
      (isShortQuery && relevantContextIndices.length > 0)
    ) {
      processingType = "contextual";
      
      // For contextual queries, web search decision depends on whether we need fresh data
      // and whether the basic classification suggests real-time data is needed
      requiresWebSearch = baseClassification.needsRealTimeData;
    } else {
      // Not contextual, use default individual processing with basic classification
      processingType = "individual";
      requiresWebSearch = baseClassification.needsRealTimeData;
    }
    
    return {
      ...baseClassification,
      processingType,
      requiresWebSearch,
      relevantContextIndices
    };
  } catch (error) {
    console.error("Error in context classification:", error);
    
    // Fallback to simple classification results with default context handling
    const baseClassification = await classifyQuery(query);
    return {
      ...baseClassification,
      processingType: "individual", // Default to individual processing on error
      requiresWebSearch: baseClassification.needsRealTimeData,
      relevantContextIndices: []
    };
  }
}

/**
 * Determine whether a web search would be beneficial for a given query
 */
export function shouldPerformWebSearch(
  query: string, 
  classification: EnhancedClassificationResult,
  conversationHistory: ChatMessage[] = []
): boolean {
  // First check: classification already determines need for web search
  if (classification.requiresWebSearch) {
    return true;
  }

  // Second check: query explicitly asks for search/lookup
  const searchExplicitPatterns = [
    /\b(?:search|look up|find|google|web|internet|online)\b/i,
    /\b(?:latest|newest|current|recent)\b/i,
    /\b(?:news|update|information)\b/i
  ];
  
  if (searchExplicitPatterns.some(pattern => pattern.test(query))) {
    return true;
  }
  
  // Third check: if we're in a contextual query but the question indicates
  // a need for external verification or additional details
  if (classification.processingType === "contextual") {
    const verificationPatterns = [
      /\b(?:verify|confirm|check|true|accurate)\b/i,
      /\b(?:more details|additional|elaborate|expand)\b/i,
      /\b(?:source|reference|citation)\b/i
    ];
    
    if (verificationPatterns.some(pattern => pattern.test(query))) {
      return true;
    }
  }
  
  // Default: rely on the classification's requiresWebSearch value
  return classification.requiresWebSearch;
}
