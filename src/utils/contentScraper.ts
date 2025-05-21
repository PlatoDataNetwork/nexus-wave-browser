
// Utility for scraping web content from URLs
export interface ScrapedContent {
  title: string;
  content: string;
  url: string;
  date?: string;
  isPartial?: boolean;
}

// Scrape content from a URL using a CORS proxy
export async function scrapeContent(url: string): Promise<ScrapedContent> {
  try {
    // Use AllOrigins as a CORS proxy to access content
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch content: ${response.statusText}`);
    }

    const htmlContent = await response.text();
    
    // Extract title
    const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : extractDomainFromUrl(url);
    
    // Basic content extraction - extract text from paragraphs
    const textContent = extractMainContent(htmlContent);
    
    // Try to extract date
    const date = extractPublicationDate(htmlContent);
    
    return {
      title,
      content: textContent,
      url,
      date,
      isPartial: textContent.length < 500 // Flag if we only got a small amount of content
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return {
      title: extractDomainFromUrl(url),
      content: "Could not extract content from this source.",
      url,
      isPartial: true
    };
  }
}

// Extract the main content from HTML
function extractMainContent(html: string): string {
  // Remove script and style elements
  const noScriptHtml = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                           .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  
  // Extract paragraphs, headings, and list items
  const contentRegex = /<(?:p|h[1-6]|li|div)[^>]*>([\s\S]*?)<\/(?:p|h[1-6]|li|div)>/gi;
  let contentMatches = [];
  let match;
  
  while ((match = contentRegex.exec(noScriptHtml)) !== null) {
    const text = match[1]
      .replace(/<[^>]+>/g, ' ') // Remove HTML tags within content
      .replace(/\s+/g, ' ')     // Normalize whitespace
      .trim();
    
    if (text.length > 20) {  // Only include substantial paragraphs
      contentMatches.push(text);
    }
  }
  
  // If we couldn't extract meaningful content, try a simpler approach
  if (contentMatches.length === 0) {
    const strippedHtml = noScriptHtml
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    // Take a reasonable chunk of the content
    return strippedHtml.substring(0, 5000);
  }
  
  return contentMatches.join('\n\n').substring(0, 8000); // Limit to 8000 chars
}

// Extract publication date from HTML if available
function extractPublicationDate(html: string): string | undefined {
  // Try common meta tag patterns for publication date
  const patterns = [
    /<meta[^>]*property="article:published_time"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="pubdate"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="publication_date"[^>]*content="([^"]+)"/i,
    /<meta[^>]*name="date"[^>]*content="([^"]+)"/i,
    /<time[^>]*datetime="([^"]+)"[^>]*>/i,
    /<time[^>]*pubdate[^>]*datetime="([^"]+)"[^>]*>/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return undefined;
}

// Extract domain from URL for fallback title
function extractDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace(/^www\./, '');
  } catch {
    return url.split('/')[2] || url;
  }
}
