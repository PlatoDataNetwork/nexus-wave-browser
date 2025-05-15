
import { toast } from 'sonner';

interface RealTimeData {
  summary: string;
  source: string;
  timestamp: Date;
}

/**
 * Scrapes web content for real-time data based on a search query
 * @param query The search query to get real-time data for
 * @param apiKey OpenAI API key for summarizing the content
 * @returns Promise with real-time data summary, source URL, and timestamp
 */
export const getRealTimeData = async (query: string, apiKey: string): Promise<RealTimeData> => {
  try {
    console.log(`Fetching real-time data for query: "${query}"`);
    
    // Step 1: Determine appropriate URLs to scrape based on the query type
    const searchTerms = query.toLowerCase();
    let urlsToScrape: string[] = [];
    
    // Choose appropriate sources based on query type
    if (searchTerms.includes('weather')) {
      urlsToScrape = ['https://weather.com', 'https://accuweather.com'];
    } else if (searchTerms.includes('stock') || searchTerms.includes('price') || searchTerms.includes('market')) {
      urlsToScrape = ['https://finance.yahoo.com', 'https://marketwatch.com'];
    } else if (searchTerms.includes('news') || searchTerms.includes('latest') || searchTerms.includes('today')) {
      urlsToScrape = ['https://news.google.com', 'https://reuters.com'];
    } else {
      // Generic search - let's use a search engine result
      const encodedQuery = encodeURIComponent(query);
      urlsToScrape = [`https://www.google.com/search?q=${encodedQuery}`, `https://www.bing.com/search?q=${encodedQuery}`];
    }
    
    // Step 2: Try to fetch content from each URL until one succeeds
    let content = '';
    let sourceUrl = '';
    
    for (const url of urlsToScrape) {
      try {
        // Attempt to fetch the content with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        console.log(`Attempting to fetch from: ${url}`);
        const response = await fetch(url, { 
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          console.log(`Failed to fetch from ${url}: ${response.status}`);
          continue; // Try the next URL
        }
        
        content = await response.text();
        sourceUrl = url;
        console.log(`Successfully fetched content from ${url} (${content.length} characters)`);
        break; // We got content, no need to try other URLs
      } catch (error) {
        console.error(`Error fetching from ${url}:`, error);
        // Continue to the next URL
      }
    }
    
    // If we couldn't fetch from any URL, throw an error
    if (!content || content.length < 100) {
      throw new Error('Could not fetch valid content from any source');
    }
    
    // Step 3: Extract relevant text from the HTML content
    // This is a simple extraction - in a production app you'd want to use a proper HTML parser
    const textContent = extractTextFromHtml(content);
    
    console.log(`Extracted ${textContent.length} characters of text content`);
    
    // Step 4: Use OpenAI to summarize the content
    const summary = await summarizeContentWithAI(textContent, query, apiKey);
    
    return {
      summary,
      source: sourceUrl,
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting real-time data:', error);
    toast.error('Failed to fetch real-time data');
    throw error;
  }
};

/**
 * Extract meaningful text from HTML content
 * This is a simple implementation - a production version would use a proper HTML parser
 */
const extractTextFromHtml = (html: string): string => {
  // Remove script and style elements
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ' ');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, ' ');
  
  // Replace all HTML tags with spaces
  text = text.replace(/<[^>]*>/g, ' ');
  
  // Replace multiple spaces with a single space
  text = text.replace(/\s+/g, ' ');
  
  // Decode HTML entities
  text = text.replace(/&amp;/g, '&')
             .replace(/&lt;/g, '<')
             .replace(/&gt;/g, '>')
             .replace(/&quot;/g, '"')
             .replace(/&#039;/g, "'")
             .replace(/&nbsp;/g, ' ');
  
  // Trim the text
  text = text.trim();
  
  // Limit the length to avoid exceeding token limits when sending to OpenAI
  return text.substring(0, 8000);
};

/**
 * Use OpenAI's API to summarize the content
 */
const summarizeContentWithAI = async (content: string, query: string, apiKey: string): Promise<string> => {
  try {
    console.log('Summarizing content with OpenAI');
    
    // Create a prompt that instructs the model to extract relevant information
    const prompt = `
      I need to extract real-time information from the following web content related to this query: "${query}"
      
      Please provide a factual, informative summary of ONLY the real-time or current information contained in this content, focusing exclusively on information that directly answers the query.
      
      Your summary should:
      1. Be concise (2-3 sentences)
      2. Include any relevant numbers, statistics, or factual data
      3. Exclude any marketing language or fluff
      4. Only include information from the content provided
      5. Focus on what's happening RIGHT NOW related to the query
      
      Web content:
      ${content.substring(0, 7000)}
    `;
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that extracts and summarizes real-time information from web content.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 150
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing content with AI:', error);
    return `Unable to summarize real-time information for "${query}". Please check direct sources for the most current data.`;
  }
};
