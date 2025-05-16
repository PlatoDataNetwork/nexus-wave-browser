
import { openai } from './openai';

export interface ClassificationResult {
  needsRealTimeData: boolean;
  confidence: number; // 0-1
  topics: string[]; // e.g., "weather", "exchange rate", "news", etc.
  suggestedSearchTerms: string[]; // optimized search terms for web scraping
}

/**
 * Classifies a query to determine if it needs real-time data
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
    
    // For simple cases, we can avoid calling GPT
    if (hasTimePattern && detectedTopics.length > 0) {
      return {
        needsRealTimeData: true,
        confidence: 0.9,
        topics: detectedTopics,
        suggestedSearchTerms: [query, ...detectedTopics.map(topic => `${topic} ${query}`)]
      };
    }
    
    // For more complex cases, use GPT to classify
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert query classifier that determines if a user question requires real-time or up-to-date information. 
            Analyze the query and decide if it would benefit from web search to get the latest information.
            Respond with a JSON object with the following fields:
            - needsRealTimeData: boolean (true if the query requires recent information)
            - confidence: float between 0 and 1 (how confident you are in this classification)
            - topics: array of strings (categories of information needed, e.g., "weather", "finance", "news")
            - suggestedSearchTerms: array of strings (optimized search terms for web scraping)
            
            Examples of queries needing real-time data:
            - "What's the weather in Paris today?" 
            - "Current gold price per ounce"
            - "Latest news about the SpaceX launch"
            - "USD to EUR exchange rate"
            - "Who won the Liverpool game yesterday"
            
            Examples of queries NOT needing real-time data:
            - "How tall is Mount Everest?"
            - "What is the capital of France?"
            - "How does photosynthesis work?"
            - "Who was Albert Einstein?"
          `
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
        needsRealTimeData: hasTimePattern,
        confidence: 0.6,
        topics: detectedTopics,
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
