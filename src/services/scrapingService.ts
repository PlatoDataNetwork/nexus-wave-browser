
// Function to scrape and extract content from websites for real-time information
export const getRealTimeData = async (query: string, apiKey: string): Promise<{
  summary: string;
  source: string;
  timestamp: Date;
}> => {
  try {
    // 1. First, use OpenAI to determine the best site to get real-time information for this query
    const sourceResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a helpful assistant that suggests the best source URL to get real-time information about a topic. 
                      Return ONLY the URL, nothing else. For example:
                      - For weather: https://weather.com/weather/today/l/{location}
                      - For stocks: https://finance.yahoo.com/quote/{ticker}
                      - For news: https://news.google.com/search?q={topic}
                      - For exchange rates: https://www.xe.com/currencyconverter/convert/?Amount=1&From={from}&To={to}
                      Replace {placeholders} with appropriate values based on the query.`
          },
          {
            role: 'user',
            content: query
          }
        ],
        temperature: 0.3,
        max_tokens: 100
      })
    });

    if (!sourceResponse.ok) {
      throw new Error(`Failed to get source suggestion: ${sourceResponse.statusText}`);
    }

    const sourceData = await sourceResponse.json();
    const sourceUrl = sourceData.choices[0].message.content.trim();

    // 2. Get the HTML content from the URL using a proxy/CORS bypass
    // We use the AllOrigins service to bypass CORS restrictions
    const allOriginsUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sourceUrl)}`;
    
    const htmlResponse = await fetch(allOriginsUrl);
    if (!htmlResponse.ok) {
      throw new Error(`Failed to fetch HTML content: ${htmlResponse.statusText}`);
    }

    const htmlContent = await htmlResponse.text();

    // 3. Extract and summarize the relevant information using OpenAI
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are an expert at extracting and summarizing relevant information from HTML content.
                     Given an HTML page related to "${query}" and the URL "${sourceUrl}",
                     provide a clear, concise summary of the most relevant real-time information.
                     Focus only on extracting the key facts, numbers, and current information related to the query.
                     Format nicely with bullet points if appropriate. Keep it under 150 words.`
          },
          {
            role: 'user',
            content: htmlContent.slice(0, 10000) // Limit to 10,000 characters to avoid token limits
          }
        ],
        temperature: 0.5,
        max_tokens: 250
      })
    });

    if (!summaryResponse.ok) {
      throw new Error(`Failed to generate summary: ${summaryResponse.statusText}`);
    }

    const summaryData = await summaryResponse.json();
    const summary = summaryData.choices[0].message.content;

    return {
      summary,
      source: sourceUrl,
      timestamp: new Date()
    };
  } catch (error) {
    console.error("Error in getRealTimeData:", error);
    throw error;
  }
};
