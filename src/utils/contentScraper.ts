import { toast } from "sonner";

/**
 * Interface for scraped content
 */
export interface ScrapedContent {
  title: string;
  content: string;
  url: string;
  isPartial?: boolean;
  date?: string;
  author?: string;
}

/**
 * Cache for scraped content to avoid multiple requests to the same URL
 */
const scrapingCache = new Map<string, {
  timestamp: number;
  content: ScrapedContent;
}>();

// Cache TTL in milliseconds (10 minutes)
const CACHE_TTL = 10 * 60 * 1000;

/**
 * CORS proxy URL options
 */
const CORS_PROXIES = [
  'https://corsproxy.io/?',
  'https://api.allorigins.win/raw?url=',
  'https://cors-anywhere.herokuapp.com/'
];

/**
 * Scrape content from a URL
 * @param url URL to scrape
 * @returns Scraped content or null if failed
 */
export async function scrapeContent(url: string): Promise<ScrapedContent | null> {
  try {
    // Check cache first
    const cachedContent = scrapingCache.get(url);
    if (cachedContent && (Date.now() - cachedContent.timestamp < CACHE_TTL)) {
      console.log(`Using cached scraped content for: ${url}`);
      return cachedContent.content;
    }
    
    console.time(`scrape-${url}`);
    
    // Try different CORS proxies
    let html = null;
    let error = null;
    let proxyUsed = null;
    
    for (const proxy of CORS_PROXIES) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        
        html = await response.text();
        proxyUsed = proxy;
        break;
      } catch (e) {
        error = e;
        console.warn(`CORS proxy ${proxy} failed: ${e.message}`);
        // Try the next proxy
      }
    }
    
    if (!html) {
      console.error(`All CORS proxies failed for ${url}: ${error?.message}`);
      return extractPartialContent(url);
    }
    
    // Parse HTML with DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract content
    const title = doc.querySelector('title')?.textContent || '';
    const metaDescription = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    
    // Find main content - use common content containers
    const contentSelectors = [
      'article', 'main', '.content', '.post', '.entry', '.article', 
      '#content', '#main', '.main-content', '[role="main"]'
    ];
    
    let contentElement = null;
    for (const selector of contentSelectors) {
      contentElement = doc.querySelector(selector);
      if (contentElement && contentElement.textContent && contentElement.textContent.length > 200) {
        break;
      }
    }
    
    // Fallback to body if no content container found
    if (!contentElement || !contentElement.textContent || contentElement.textContent.length < 200) {
      contentElement = doc.body;
    }
    
    // Remove unwanted elements before extracting text
    const unwantedSelectors = [
      'script', 'style', 'nav', 'header', 'footer', '.comments', '.sidebar', 
      '.nav', '.menu', '.advertisement', '.ads', '.ad-container'
    ];
    
    unwantedSelectors.forEach(selector => {
      contentElement.querySelectorAll(selector).forEach(el => el.remove());
    });
    
    // Extract date if available
    let date = null;
    const dateSelectors = [
      'time', '[datetime]', '.date', '.published', '.post-date', 
      'meta[property="article:published_time"]'
    ];
    
    for (const selector of dateSelectors) {
      const dateElement = doc.querySelector(selector);
      if (dateElement) {
        date = dateElement.getAttribute('datetime') || dateElement.textContent;
        if (date) break;
      }
    }
    
    // Extract author if available
    let author = null;
    const authorSelectors = [
      '.author', '[rel="author"]', '.byline', '.entry-author', 
      'meta[name="author"]', '[itemprop="author"]'
    ];
    
    for (const selector of authorSelectors) {
      const authorElement = doc.querySelector(selector);
      if (authorElement) {
        author = authorElement.textContent || authorElement.getAttribute('content');
        if (author) break;
      }
    }
    
    // Clean and normalize the text
    let contentText = contentElement.textContent || '';
    contentText = contentText
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 8000); // Limit to 8000 chars to avoid excessive token usage
    
    // Create the result
    const result: ScrapedContent = {
      title,
      content: contentText,
      url,
      date: date || undefined,
      author: author || undefined,
      isPartial: false
    };
    
    // Cache the result
    scrapingCache.set(url, {
      timestamp: Date.now(),
      content: result
    });
    
    console.timeEnd(`scrape-${url}`);
    console.log(`Successfully scraped ${url} using ${proxyUsed}`);
    
    return result;
  } catch (error) {
    console.error(`Error scraping content from ${url}:`, error);
    return extractPartialContent(url);
  }
}

/**
 * Extract partial content from search results when scraping fails
 */
function extractPartialContent(url: string): ScrapedContent | null {
  try {
    // Parse URL to get domain and path
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace('www.', '');
    
    // Create a basic title from the URL
    let title = parsedUrl.pathname
      .split('/')
      .filter(part => part.length > 0)
      .pop() || domain;
    
    // Replace dashes and underscores with spaces and capitalize words
    title = title
      .replace(/[-_]/g, ' ')
      .replace(/\.\w+$/, '') // Remove file extensions
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    // Return partial content notice
    const result: ScrapedContent = {
      title,
      content: `Content from ${domain} could not be fully retrieved due to access restrictions. Please visit the website directly for complete information.`,
      url,
      isPartial: true
    };
    
    // Cache the partial result
    scrapingCache.set(url, {
      timestamp: Date.now(),
      content: result
    });
    
    return result;
  } catch (error) {
    console.error(`Error creating partial content for ${url}:`, error);
    return null;
  }
}

/**
 * Clear the scraping cache
 */
export function clearScrapingCache(): void {
  const count = scrapingCache.size;
  scrapingCache.clear();
  toast.success(`Cleared scraping cache (${count} items)`);
}

/**
 * Get scraping cache stats
 */
export function getScrapingCacheStats(): { size: number; ttlMinutes: number } {
  return {
    size: scrapingCache.size,
    ttlMinutes: CACHE_TTL / (60 * 1000)
  };
}
