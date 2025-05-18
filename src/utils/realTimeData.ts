import { ClassificationResult } from './queryClassifier';
import { dataCache } from './dataCache';
import { searchWithSerper } from '../services/searchApi';
import { openai } from './openai';
import { scrapeContent, ScrapedContent } from './contentScraper';

export interface RealTimeData {
  content: string;
  sources: Array<{ title: string; url: string }>;
  timestamp: Date;
}

// Update the ScrapedContent type to ensure date is properly defined
interface ContentForGPT {
  title: string;
  url: string;
  content: string;
  isPartial: boolean;
  date?: string; // Make sure date is defined as optional
}

/**
 * Fetches real-time data by scraping web results from multiple sources
 * Enhanced with full content scraping and parallel processing
 */
export async function getRealTimeData(
  query: string, 
  classification: ClassificationResult
): Promise<RealTimeData | null> {
  try {
    // Measure performance
    console.time('realtime-data-total');
    
    // Check cache first for faster responses
    const cacheKey = query.toLowerCase();
    const cachedData = dataCache.get(cacheKey);
    
    if (cachedData) {
      console.log("Cache hit for query:", query);
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
      `current ${query} news`,
      ...classification.suggestedSearchTerms
    ];
    
    // Try different search terms until we get results - use parallel requests for speed
    console.time('parallel-search');
    const searchPromises = searchTerms.map(term => 
      searchWithSerper(
        term, 
        'search',  
        true,      // Safe search on
        5,         // Limit to 5 results for faster processing
        'day'      // Recent results (last 24 hours)
      )
    );
    
    // Wait for all searches to complete
    const searchResults = await Promise.all(searchPromises);
    
    // Combine and deduplicate results
    const allResults = [];
    const seenUrls = new Set();
    
    for (const result of searchResults) {
      if (result && result.results) {
        for (const item of result.results) {
          if (!seenUrls.has(item.url)) {
            allResults.push(item);
            seenUrls.add(item.url);
          }
        }
      }
    }
    
    console.timeEnd('parallel-search');
    
    // If we have no results, try with a longer time window
    if (allResults.length === 0) {
      console.log("No day-recent results, trying week-recent results");
      const weekResults = await searchWithSerper(
        searchTerms[0], 
        'search',
        true,
        7,
        'week'  // Recent results (last week)
      );
      
      if (weekResults && weekResults.results) {
        allResults.push(...weekResults.results);
      }
    }
    
    if (allResults.length === 0) {
      console.log("No search results found for any search terms");
      return null;
    }
    
    // Select top relevant results using our scoring system
    const scoredResults = scoreAndRankResults(allResults);
    
    // Select top 3 diverse sources based on domain and content
    const selectedResults = selectDiverseSources(scoredResults, 3);
    
    console.log(`Selected ${selectedResults.length} diverse sources to fetch content from`);
    
    // Extract content from search results - use full content scraping in parallel
    console.time('content-extraction');
    
    // Use Promise.allSettled to handle failures gracefully
    const scrapingPromises = selectedResults.map(result => 
      scrapeContent(result.url).catch(error => {
        console.error(`Failed to scrape ${result.url}:`, error);
        // Return a basic result with just the description from search
        return {
          title: result.title,
          content: result.description,
          url: result.url,
          isPartial: true
        } as ScrapedContent;
      })
    );
    
    const scrapingResults = await Promise.allSettled(scrapingPromises);
    
    // Process results, handling both fulfilled and rejected promises
    const extractedContent = scrapingResults
      .map((result, index) => {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        } else {
          // Fallback for failed requests
          const searchResult = selectedResults[index];
          return {
            title: searchResult.title,
            content: searchResult.description,
            url: searchResult.url,
            isPartial: true
          };
        }
      })
      .filter(Boolean);
    
    console.timeEnd('content-extraction');
    
    // Check if we have enough content to synthesize
    if (extractedContent.length === 0) {
      console.log("No content extracted from any sources");
      return null;
    }
    
    // Use GPT to synthesize the information with emphasis on recency and performance
    console.time('gpt-synthesis');
    
    // Create a detailed but streamlined system prompt
    const systemPrompt = `You are an expert data synthesizer focused on SPEED and ACCURACY. Given scraped content about a query, extract and summarize the most relevant REAL-TIME information.
       
       IMPORTANT INSTRUCTIONS:
       1. Focus on extracting the MOST CURRENT information available, especially dates, versions, prices, statistics.
       2. EXPLICITLY MENTION the recency of the data (today, this week, this month, etc.)
       3. INCLUDE specific dates and times when available
       4. FORMAT your response to be clear, concise, and factual - aim for BREVITY
       5. Make it OBVIOUS when data is from today/this week vs. older data
       6. Include NUMERICAL data whenever relevant (prices, percentages, statistics)
       7. DO NOT make up or assume information
       8. Clearly indicate which source provided which information
       9. If information seems outdated or contradictory, acknowledge this in your response
       10. Keep your response short and to the point - under 300 words
       
       The user's query is about "${query}" and they specifically want the LATEST information.`;
    
    // Prepare the content for GPT - make it concise to reduce tokens
    const contentForGPT: ContentForGPT[] = extractedContent.map(content => ({
      title: content.title,
      url: content.url,
      content: content.content.substring(0, 2000), // Limit each content to 2000 chars
      isPartial: content.isPartial,
      date: 'date' in content && content.date ? content.date : 'Unknown'
    }));
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for speed
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Original query: "${query}"
            
            Scraped content from sources:
            ${JSON.stringify(contentForGPT, null, 2)}
            
            Extract and synthesize the most up-to-date information, emphasizing when the data is from. Be CONCISE.`
        }
      ],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 350 // Limit token count for faster responses
    });
    
    console.timeEnd('gpt-synthesis');
    
    const extractedData = response.choices[0].message.content || '';
    
    // Create sources for citation
    const sources = selectedResults.map(result => ({
      title: result.title,
      url: result.url
    }));
    
    // Cache the results
    dataCache.set(cacheKey, extractedData, sources, contentType);
    
    console.timeEnd('realtime-data-total');
    
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

/**
 * Score and rank search results based on relevance, recency and authority
 */
function scoreAndRankResults(results: any[]): any[] {
  if (!results || results.length === 0) return [];
  
  // Clone results to avoid modifying the original
  const scoredResults = results.map(result => ({ ...result, score: 0 }));
  
  // Current date for recency calculation
  const now = new Date();
  
  // Score each result
  for (const result of scoredResults) {
    let score = 0;
    
    // Title relevance (0-30 points)
    if (result.title) {
      // More points for longer, descriptive titles
      score += Math.min(result.title.length / 10, 30);
    }
    
    // Description length and quality (0-20 points)
    if (result.description) {
      // More points for longer, substantive descriptions
      score += Math.min(result.description.length / 20, 20);
    }
    
    // Recency bonus (0-30 points)
    if (result.date) {
      try {
        const publishDate = new Date(result.date);
        if (!isNaN(publishDate.getTime())) {
          // Days since publication
          const daysSincePublication = (now.getTime() - publishDate.getTime()) / (1000 * 60 * 60 * 24);
          
          // Higher score for more recent content
          if (daysSincePublication < 1) {
            // Published today
            score += 30;
          } else if (daysSincePublication < 7) {
            // Published this week
            score += 25;
          } else if (daysSincePublication < 30) {
            // Published this month
            score += 15;
          } else {
            // Older content
            score += 5;
          }
        }
      } catch (e) {
        // Invalid date format, no bonus
      }
    }
    
    // Domain authority approximation (0-20 points)
    if (result.url) {
      try {
        const domain = new URL(result.url).hostname;
        
        // Bonus for known authoritative sites
        const authorityDomains = [
          'bloomberg.com', 'reuters.com', 'ap.org', 'nytimes.com', 'wsj.com',
          'bbc.com', 'bbc.co.uk', 'cnn.com', 'theguardian.com', 'ft.com',
          'forbes.com', 'economist.com', 'gov', 'edu', 'un.org', 'who.int'
        ];
        
        // Check if domain ends with or contains any of the authority domains
        for (const authDomain of authorityDomains) {
          if (domain.endsWith(authDomain) || domain.includes(authDomain)) {
            score += 20;
            break;
          }
        }
      } catch (e) {
        // Invalid URL format, no bonus
      }
    }
    
    result.score = score;
  }
  
  // Sort by score (descending)
  return scoredResults.sort((a, b) => b.score - a.score);
}

/**
 * Select diverse sources to avoid redundancy and get broader perspective
 */
function selectDiverseSources(scoredResults: any[], count: number): any[] {
  if (scoredResults.length <= count) return scoredResults;
  
  const selectedResults = [];
  const seenDomains = new Set();
  
  // First pass: select highest scoring result from each domain
  for (const result of scoredResults) {
    if (selectedResults.length >= count) break;
    
    try {
      const domain = new URL(result.url).hostname;
      
      if (!seenDomains.has(domain)) {
        selectedResults.push(result);
        seenDomains.add(domain);
      }
    } catch (e) {
      // Invalid URL, skip
    }
  }
  
  // Second pass: if we still need more results, take highest scoring remaining
  if (selectedResults.length < count) {
    const remainingResults = scoredResults.filter(
      result => !selectedResults.includes(result)
    );
    
    selectedResults.push(
      ...remainingResults.slice(0, count - selectedResults.length)
    );
  }
  
  return selectedResults;
}
