
import { openai } from './openai';

export interface ClassificationResult {
  needsRealTimeData: boolean;
  confidence: number; // 0-1
  topics: string[]; // e.g., "weather", "exchange rate", "news", etc.
  suggestedSearchTerms: string[]; // optimized search terms for web scraping
  queryType?: string; // Adding this property to fix the error
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
      model: "gpt-4o-mini", // Using smaller model for speed
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
