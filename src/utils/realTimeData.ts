
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
    
    // Choose the best search term from the suggestions
    const searchTerm = classification.suggestedSearchTerms[0] || query;
    
    // Get search results using searchWithSerper instead of getSearchResults
    const searchResponse = await searchWithSerper(
      searchTerm, 
      'search',  // use web search type
      true,      // Safe search on
      3,         // Limit to 3 results
      'day'      // Recent results (last 24 hours)
    );
    
    if (!searchResponse || searchResponse.results.length === 0) {
      console.log("No search results found for:", searchTerm);
      return null;
    }
    
    // Get top 3 relevant results
    const topResults = searchResponse.results.slice(0, 3);
    
    // Extract content from search results
    const extractedContent = topResults.map(result => ({
      title: result.title,
      url: result.url,
      description: result.description,
      snippets: result.type === 'web' ? [result.description] : []
    }));
    
    // Use GPT to synthesize the information
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert data extractor. Given search results about a query, extract and summarize the most relevant real-time information.
            Focus on extracting factual, up-to-date information. Format your response to be clear, concise, and factual.
            Include specific data points, numbers, and dates when available. DO NOT make up information.
            If the search results don't seem to have relevant real-time information, state that clearly.`
        },
        {
          role: "user",
          content: `Original query: "${query}"
            
            Search results:
            ${JSON.stringify(extractedContent, null, 2)}
            
            Extract and summarize the most relevant real-time information from these results.`
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
