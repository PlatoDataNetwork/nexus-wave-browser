
import { ClassificationResult } from './queryClassifier';
import { dataCache } from './dataCache';
import { searchWithSerper } from '../services/searchApi';
import { openai } from './openai';

export interface RealTimeData {
  content: string;
  sources: Array<{ title: string; url: string }>;
  timestamp: Date;
  chartData?: {
    type: string;
    data: Array<Record<string, any>>;
    title: string;
    xAxisKey: string;
    yAxisKeys: string[];
    colors?: Record<string, string>;
  };
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
        timestamp: new Date(cachedData.timestamp),
        chartData: cachedData.chartData
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
    
    // Check if this is a data visualization query that might benefit from a chart
    const isChartQuery = query.toLowerCase().includes('chart') || 
                         query.toLowerCase().includes('graph') ||
                         query.toLowerCase().includes('compare') ||
                         query.toLowerCase().includes('price') ||
                         query.toLowerCase().includes('trend') ||
                         query.toLowerCase().includes('statistics') ||
                         query.toLowerCase().includes('vs') ||
                         classification.topics.some(topic => 
                           ['finance', 'stock', 'crypto', 'statistics', 'comparison'].includes(topic.toLowerCase())
                         );
    
    // Use GPT to synthesize the information with emphasis on recency
    const systemPrompt = isChartQuery 
      ? `You are an expert data extractor. Given search results about a query, extract and summarize the most relevant REAL-TIME information.
         
         IMPORTANT INSTRUCTIONS:
         1. Focus on extracting the MOST CURRENT information available, especially dates, versions, prices, statistics.
         2. EXPLICITLY MENTION the recency of the data (today, this week, this month, etc.)
         3. INCLUDE specific dates and times when available
         4. FORMAT your response to be clear, concise, and factual
         5. Make it OBVIOUS when data is from today/this week vs. older data
         6. Include NUMERICAL data whenever relevant (prices, percentages, statistics)
         7. If the search results contain data that could be visualized as a chart, extract that data in a structured format
         8. DO NOT make up or assume information
         9. If the search results don't have recent information, CLEARLY STATE that the data may not be current
         10. If information seems outdated or contradictory, acknowledge this in your response
         
         If the query could benefit from a chart visualization, ALSO provide the data in a structured format like this:
         
         CHART_DATA:
         {
           "type": "line",
           "title": "Title for the chart",
           "data": [
             {"date": "2023-01-01", "value1": 100, "value2": 200},
             {"date": "2023-02-01", "value1": 150, "value2": 180}
           ],
           "xAxisKey": "date",
           "yAxisKeys": ["value1", "value2"],
           "colors": {"value1": "#8884d8", "value2": "#82ca9d"}
         }
         
         The user's query is about "${query}" and they specifically want the LATEST information.`
      : `You are an expert data extractor. Given search results about a query, extract and summarize the most relevant REAL-TIME information.
         
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
         
         The user's query is about "${query}" and they specifically want the LATEST information.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
            
            Extract and summarize the most up-to-date information from these results, emphasizing when the data is from.`
        }
      ]
    });
    
    const extractedResponse = response.choices[0].message.content || '';
    let extractedData = extractedResponse;
    let chartData = null;
    
    // Check if response contains chart data
    const chartDataMatch = extractedResponse.match(/CHART_DATA:\s*({[\s\S]*?})\s*(?:$|(?=\n\n))/);
    if (chartDataMatch && chartDataMatch[1]) {
      try {
        // Extract and parse the chart data
        const chartDataStr = chartDataMatch[1];
        chartData = JSON.parse(chartDataStr);
        
        // Remove the chart data section from the text response
        extractedData = extractedResponse.replace(/CHART_DATA:\s*({[\s\S]*?})\s*(?:$|(?=\n\n))/g, '').trim();
      } catch (err) {
        console.error("Error parsing chart data:", err);
      }
    }
    
    // Create sources for citation
    const sources = topResults.map(result => ({
      title: result.title,
      url: result.url
    }));
    
    // Cache the results
    dataCache.set(cacheKey, extractedData, sources, contentType, chartData);
    
    return {
      content: extractedData,
      sources,
      timestamp: new Date(),
      chartData
    };
  } catch (error) {
    console.error("Error fetching real-time data:", error);
    return null;
  }
}
