
// realTimeData.ts - This file will be implemented without breaking changes to existing functionality
import { classifyQuery, ClassificationResult } from './queryClassifier';
import { dataCache } from './dataCache';
import { scrapeContent, ScrapedContent } from './contentScraper';

interface RealTimeData {
  content: string;
  timestamp: Date;
  sources: { title: string; url: string }[];
}

/**
 * Get real-time data based on query
 * @param query The user query
 * @param classification The query classification
 */
export async function getRealTimeData(
  query: string,
  classification: ClassificationResult
): Promise<RealTimeData | null> {
  try {
    // Check if we have a recent cached result for this query
    const cachedData = dataCache.get(query);
    if (cachedData) {
      console.info('Using cached data for query:', query);
      // Fix: Convert CachedItem to RealTimeData structure
      return {
        content: cachedData.data,
        timestamp: new Date(cachedData.timestamp),
        sources: cachedData.sources || []
      };
    }
    
    // If classification doesn't indicate a need for real-time data, return null
    const needsRealTimeData = classification.needsRealTimeData || false;
    
    if (!needsRealTimeData && (classification.confidence || 0) > 0.7) {
      console.info('Query classified as not needing real-time data:', query);
      return null;
    }
    
    // Load search API dynamically to reduce initial code bundle size
    const searchModule = await import('@/services/searchApi');
    
    // Get search terms from classification, or fall back to the original query
    const searchTerms = classification.suggestedSearchTerms && classification.suggestedSearchTerms.length > 0
      ? classification.suggestedSearchTerms.slice(0, 3)
      : [query, `latest ${query}`, `current ${query} information`];
    
    // Use the first search term for primary search
    const primarySearchTerm = searchTerms[0];
    console.log(`Fetching real-time data for: ${primarySearchTerm}`);
    
    // Perform search with primary term
    const searchResults = await searchModule.searchWithSerper(primarySearchTerm, 'search', true, 5);
    
    if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
      console.info('No search results found for:', primarySearchTerm);
      return null;
    }
    
    // Extract the top 3 most relevant search results
    const topResults = searchResults.results.slice(0, 3);
    
    // Prepare sources information
    const sources = topResults.map(result => ({
      title: result.title,
      url: result.url
    }));
    
    // For each result, try to scrape more detailed content asynchronously
    const scrapePromises = topResults.map(async (result) => {
      try {
        // Try to fetch and scrape the page
        const scrapedContent = await scrapeContent(result.url);
        
        if (scrapedContent && scrapedContent.content && scrapedContent.content.length > 100) {
          // If we got good content, use it
          return {
            ...scrapedContent,
            isPartial: false
          };
        }
      } catch (error) {
        console.error(`Error scraping ${result.url}:`, error);
      }
      
      // Fallback to snippet if scraping fails or content is too short
      return {
        title: result.title,
        content: result.snippets ? result.snippets : "No content available",
        url: result.url,
        isPartial: true
      };
    });
    
    // Wait for all scraping attempts to complete
    const scrapedResults = await Promise.allSettled(scrapePromises);
    
    // Extract content from scraping results
    const contentBlocks = scrapedResults
      .filter(result => result.status === 'fulfilled')
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          const data = result.value;
          const sourceName = sources[index].title;
          
          return {
            title: data.title || sourceName,
            content: data.content || '',
            source: sourceName,
            url: sources[index].url
          };
        }
        return null;
      })
      .filter(Boolean);
    
    // If no content was successfully scraped, return simplified data
    if (contentBlocks.length === 0) {
      const simpleContent = topResults.map(result => 
        `[${result.title}]: ${result.snippets ? result.snippets : "No snippet available"}`
      ).join('\n\n');
      
      const realTimeData = {
        content: simpleContent,
        timestamp: new Date(),
        sources
      };
      
      // Fix: Add required parameters to dataCache.set() call
      dataCache.set(query, simpleContent, sources, 'text');
      return realTimeData;
    }
    
    // Create a rich consolidated content from all scraped sources
    // Format the content to make it easy to read and use by LLMs
    const consolidatedContent = contentBlocks.map(block => {
      // Fix: Ensure content is a string before calling substring
      const blockContent = typeof block.content === 'string' 
        ? block.content.substring(0, 1000) + (block.content.length > 1000 ? '...' : '')
        : Array.isArray(block.content)
          ? block.content.join(' ').slice(0, 1000) + (block.content.join(' ').length > 1000 ? '...' : '')
          : 'Content unavailable';
          
      return `## ${block.title}\n${blockContent}\n*Source: ${block.source}*`;
    }).join('\n\n---\n\n');
    
    // Create real-time data package
    const realTimeData = {
      content: consolidatedContent,
      timestamp: new Date(),
      sources
    };
    
    // Fix: Add required parameters to dataCache.set() call
    dataCache.set(query, consolidatedContent, sources, 'markdown');
    
    return realTimeData;
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    return null;
  }
}
