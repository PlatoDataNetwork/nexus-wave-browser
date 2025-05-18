
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
 * Fetches real-time data by scraping web results from multiple sources
 */
export async function getRealTimeData(
  query: string, 
  classification: ClassificationResult
): Promise<RealTimeData | null> {
  try {
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
      `current ${query}`,
      ...classification.suggestedSearchTerms
    ];
    
    // Try different search terms until we get results
    console.time('searchResults');
    let searchResponse = null;
    for (const term of searchTerms) {
      console.log(`Trying search term: ${term}`);
      
      // Get search results using searchWithSerper - use 'day' for most recent results
      searchResponse = await searchWithSerper(
        term, 
        'search',  
        true,      // Safe search on
        7,         // Limit to 7 results to get more diverse sources
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
        7,
        'week'  // Recent results (last week)
      );
    }
    
    if (!searchResponse || searchResponse.results.length === 0) {
      console.log("No search results found for any search terms");
      return null;
    }
    console.timeEnd('searchResults');
    
    // Select top relevant results using our scoring system
    const scoredResults = scoreAndRankResults(searchResponse.results);
    
    // Select top 3 diverse sources based on domain and content
    const selectedResults = selectDiverseSources(scoredResults, 3);
    
    console.log(`Selected ${selectedResults.length} diverse sources to fetch content from`);
    
    // Extract content from search results - optimized for parallel fetching
    console.time('contentExtraction');
    const extractedContentPromises = selectedResults.map(async result => {
      return {
        title: result.title,
        url: result.url,
        description: result.description,
        snippets: result.type === 'web' ? [result.description] : [],
        date: result.date || 'Unknown'
      };
    });
    
    const extractedContent = await Promise.all(extractedContentPromises);
    console.timeEnd('contentExtraction');
    
    // Use GPT to synthesize the information with emphasis on recency and performance
    console.time('gptSynthesis');
    const systemPrompt = `You are an expert data extractor focused on SPEED and ACCURACY. Given search results about a query, extract and summarize the most relevant REAL-TIME information.
       
       IMPORTANT INSTRUCTIONS:
       1. Focus on extracting the MOST CURRENT information available, especially dates, versions, prices, statistics.
       2. EXPLICITLY MENTION the recency of the data (today, this week, this month, etc.)
       3. INCLUDE specific dates and times when available
       4. FORMAT your response to be clear, concise, and factual - aim for BREVITY
       5. Make it OBVIOUS when data is from today/this week vs. older data
       6. Include NUMERICAL data whenever relevant (prices, percentages, statistics)
       7. DO NOT make up or assume information
       8. If the search results don't have recent information, CLEARLY STATE that the data may not be current
       9. If information seems outdated or contradictory, acknowledge this in your response
       10. Keep your response short and to the point - under 250 words if possible
       
       The user's query is about "${query}" and they specifically want the LATEST information.`;
    
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
            
            Search results:
            ${JSON.stringify(extractedContent, null, 2)}
            
            Extract and summarize the most up-to-date information from these results, emphasizing when the data is from. Be CONCISE.`
        }
      ],
      temperature: 0.3, // Lower temperature for more factual responses
      max_tokens: 350 // Limit token count for faster responses
    });
    console.timeEnd('gptSynthesis');
    
    const extractedData = response.choices[0].message.content || '';
    
    // Create sources for citation
    const sources = selectedResults.map(result => ({
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
