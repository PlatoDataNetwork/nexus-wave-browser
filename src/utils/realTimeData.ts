
import { ClassificationResult } from './queryClassifier';
import { dataCache } from './dataCache';
import { searchWithSerper } from '../services/searchApi';
import { openai } from './openai';

export interface RealTimeData {
  content: string;
  sources: Array<{ title: string; url: string }>;
  timestamp: Date;
}

/**
 * Fetches real-time data by scraping web results
 */
export async function getRealTimeData(
  query: string, 
  classification: ClassificationResult
): Promise<RealTimeData | null> {
  try {
    // Check cache first
    const cacheKey = query.toLowerCase();
    const cachedData = dataCache.get(cacheKey);
    
    if (cachedData) {
      return {
        content: cachedData.data,
        sources: cachedData.sources,
        timestamp: new Date(cachedData.timestamp)
      };
    }
    
    // Not in cache, fetch fresh data
    const contentType = classification.topics[0] || 'general';
    
    // Choose the best search terms - prioritize recency
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    // Create search terms that emphasize recency
    const searchTerms = [
      `${query} ${currentYear}`, 
      `${query} ${currentMonth} ${currentYear}`,
      `latest ${query}`,
      `current ${query}`,
      ...classification.suggestedSearchTerms
    ];
    
    // Try different search terms until we get results
    let searchResponse = null;
    for (const term of searchTerms) {
      console.log(`Trying search term: ${term}`);
      
      // Get search results using searchWithSerper
      searchResponse = await searchWithSerper(
        term, 
        'search',  // use web search type
        true,      // Safe search on
        5,         // Limit to 5 results to get more diverse sources
        'day'      // Recent results (last 24 hours)
      );
      
      if (searchResponse && searchResponse.results.length > 0) {
        console.log(`Found results using term: ${term}`);
        break;
      }
    }
    
    // If we still don't have results, try with a longer time window
    if (!searchResponse || searchResponse.results.length === 0) {
      console.log("No day-recent results, trying week-recent results");
      searchResponse = await searchWithSerper(
        searchTerms[0], 
        'search',
        true,
        5,
        'week'  // Recent results (last week)
      );
    }
    
    if (!searchResponse || searchResponse.results.length === 0) {
      console.log("No search results found for any search terms");
      return null;
    }
    
    // Get top relevant results
    const topResults = searchResponse.results.slice(0, 5);
    
    // Extract content from search results
    const extractedContent = topResults.map(result => ({
      title: result.title,
      url: result.url,
      description: result.description,
      snippets: result.type === 'web' ? [result.description] : [],
      date: result.date || 'Unknown'
    }));
    
    // Use GPT to synthesize the information with emphasis on recency
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert data extractor. Given search results about a query, extract and summarize the most relevant REAL-TIME information.
            
            IMPORTANT INSTRUCTIONS:
            1. Focus on extracting the MOST CURRENT information available, especially dates, versions, prices, statistics.
            2. EXPLICITLY MENTION the recency of the data (today, this week, this month, etc.)
            3. INCLUDE specific dates and times when available
            4. FORMAT your response to be clear, concise, and factual
            5. Make it OBVIOUS when data is from today/this week vs. older data
            6. Include NUMERICAL data whenever relevant (prices, percentages, statistics)
            7. DO NOT make up or assume information
            8. If the search results don't have recent information, CLEARLY STATE that the data may not be current
            9. If information seems outdated or contradictory, acknowledge this in your response
            
            The user's query is about "${query}" and they specifically want the LATEST information.`
        },
        {
          role: "user",
          content: `Original query: "${query}"
            
            Search results:
            ${JSON.stringify(extractedContent, null, 2)}
            
            Extract and summarize the most up-to-date information from these results, emphasizing when the data is from.`
        }
      ]
    });
    
    const extractedData = response.choices[0].message.content;
    
    // Create sources for citation
    const sources = topResults.map(result => ({
      title: result.title,
      url: result.url
    }));
    
    // Cache the results
    dataCache.set(cacheKey, extractedData, sources, contentType);
    
    return {
      content: extractedData,
      sources,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    return null;
  }
}
