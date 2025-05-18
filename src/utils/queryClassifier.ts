
import { openai } from './openai';

/**
 * Interface for classification result
 */
export interface ClassificationResult {
  topics: string[];
  suggestedSearchTerms: string[];
  queryType?: string;
  needsRealTimeData?: boolean;
  confidence?: number;
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
    
    // Check for specific entity comparisons (like "AAPL vs MSFT" or company/product comparisons)
    const comparisonPattern = /\b(vs|versus|compare|comparison)\b/i;
    const hasComparison = comparisonPattern.test(query);
    
    // Check for version-related queries (software versions, releases, etc.)
    const versionPattern = /\b(version|release|update|latest|newest|current)\b/i;
    const hasVersionQuery = versionPattern.test(query);
    
    // For simple cases, we can avoid calling GPT
    if ((hasTimePattern && detectedTopics.length > 0) || hasVersionQuery || hasComparison) {
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
    
    // For more complex cases, use GPT to classify
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert query classifier that determines if a user question requires real-time or up-to-date information. 
            Analyze the query and decide if it would benefit from web search to get the latest information.
            Be very sensitive to queries that might need current information - assume by default that users want the most recent data.
            For any comparisons (like "A vs B"), product details, prices, versions, or statistics, assume real-time data is needed.
            
            Respond with a JSON object with the following fields:
            - needsRealTimeData: boolean (true if the query requires recent information)
            - confidence: float between 0 and 1 (how confident you are in this classification)
            - topics: array of strings (categories of information needed, e.g., "weather", "finance", "news", "technology", "software", "products")
            - suggestedSearchTerms: array of strings (optimized search terms for web scraping)
            
            Examples of queries needing real-time data:
            - "What's the weather in Paris today?" 
            - "Current gold price per ounce"
            - "Latest news about the SpaceX launch"
            - "USD to EUR exchange rate"
            - "Who won the Liverpool game yesterday"
            - "AAPL vs MSFT stock performance"
            - "Latest version of Laravel"
            - "Current price of iPhone 15"
            - "Best laptop for programming 2024"
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
        suggestedSearchTerms: result.suggestedSearchTerms || [
          query,
          `latest ${query}`,
          `current ${query} ${new Date().getFullYear()}`
        ]
      };
    } catch (e) {
      console.error("Error parsing GPT response:", e);
      // Fallback to pattern-based classification
      return {
        needsRealTimeData: hasTimePattern || hasVersionQuery || hasComparison,
        confidence: 0.6,
        topics: detectedTopics.length > 0 ? detectedTopics : ["general"],
        suggestedSearchTerms: [
          query,
          `latest ${query}`,
          `current ${query} ${new Date().getFullYear()}`
        ]
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
