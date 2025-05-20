
import OpenAI from 'openai';

// OpenAI API key
const OPENAI_API_KEY = "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";

// Create a single instance of the OpenAI client with keep-alive connections
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Normally in production, API calls should go through a backend
  maxRetries: 2, // Limit retries for faster failure
});

// Cache for responses to avoid duplicate API calls
const responseCache = new Map();

// Optimized prompt templates for faster responses
const SYSTEM_PROMPTS = {
  DEFAULT: 'You are Nexus Wave\'s helpful assistant answering questions. Be concise but informative.',
  REALTIME: 'You are a fast and efficient information synthesizer. Keep responses under 200 words. Focus on key points.',
  DIVERSITY: 'Provide a different perspective than previous responses. Be concise.',
  STREAMING: 'You are a real-time assistant. Focus on the most important details first and keep responses brief.'
};

/**
 * Get a streaming AI response using the ChatGPT API
 * Optimized for the fastest possible first token time
 */
export async function getStreamingResponse(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  onToken: (token: string) => void,
  realTimeData?: { content: string; timestamp: Date; sources?: { title: string; url: string }[] } | null
): Promise<void> {
  try {
    console.time('streaming-first-token');
    
    // Check cache for exact matches to avoid redundant calls
    const cacheKey = `${message}-${realTimeData ? 'withData' : 'noData'}`;
    if (responseCache.has(cacheKey)) {
      console.log('Using cached response');
      const cachedResponse = responseCache.get(cacheKey);
      // Simulate streaming for cached responses
      const chunks = cachedResponse.split(/\b/);
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 5));
        onToken(chunk);
      }
      return;
    }
    
    // Base system prompt - kept very concise for faster first token
    let systemPrompt = SYSTEM_PROMPTS.STREAMING;
    
    // Add real-time data if available (but keep it minimal for faster processing)
    if (realTimeData) {
      systemPrompt += `\n\nUse this data:\n${realTimeData.content.substring(0, 500)}${realTimeData.content.length > 500 ? '...' : ''}`;
    }
    
    // Keep history minimal for faster processing
    let prunedHistory = conversationHistory;
    if (conversationHistory.length > 4) {
      // Keep only the most recent messages
      prunedHistory = conversationHistory.slice(-3);
    }
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...prunedHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Request with optimized parameters for fastest possible first token
    // Removed timeout parameter since it's not supported in the API
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for faster responses
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 600, // Reduced for faster responses
      stream: true, // Enable streaming
      frequency_penalty: 0.3
    });
    
    let fullResponse = '';
    
    // Process the stream
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        const token = chunk.choices[0].delta.content;
        fullResponse += token;
        onToken(token);
      }
      
      // Record time to first token
      if (fullResponse.length > 0 && fullResponse.length <= 20) {
        console.timeEnd('streaming-first-token');
      }
    }
    
    // Cache the response for future use (limited to 50 entries)
    if (responseCache.size > 50) {
      // Remove oldest entry
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
    responseCache.set(cacheKey, fullResponse);
    
    return;
  } catch (error) {
    console.error("Error fetching streaming AI response:", error);
    onToken("I'm having trouble generating a response right now. Please try again.");
    throw error;
  }
}

/**
 * Get an AI response using the ChatGPT API with conversation history and real-time data
 * Optimized for speed and responsiveness
 */
export async function getChatGPTResponseWithRealTimeData(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  realTimeData?: { content: string; timestamp: Date; sources?: { title: string; url: string }[] } | null,
  diversityPrompt?: string
): Promise<string> {
  try {
    console.time('gpt-response-time');
    
    // Check cache for exact matches
    const cacheKey = `${message}-${realTimeData ? 'withData' : 'noData'}-${diversityPrompt ? 'diverse' : 'normal'}`;
    if (responseCache.has(cacheKey)) {
      console.log('Using cached response');
      console.timeEnd('gpt-response-time');
      return responseCache.get(cacheKey);
    }
    
    // Base system prompt - kept concise for faster processing
    let systemPrompt = SYSTEM_PROMPTS.DEFAULT;
    
    // Add diversity prompt if provided (for regeneration requests)
    if (diversityPrompt) {
      systemPrompt = SYSTEM_PROMPTS.DIVERSITY;
    }
    
    // Enhance the system prompt with real-time data if available
    if (realTimeData) {
      const formattedTime = realTimeData.timestamp.toLocaleString();
      systemPrompt = SYSTEM_PROMPTS.REALTIME + 
      `\n\nUse this information from web searches (${formattedTime}):\n${realTimeData.content.substring(0, 800)}${realTimeData.content.length > 800 ? '...' : ''}`;
    }
    
    // Prune conversation history to keep token count down when it gets too long
    let prunedHistory = conversationHistory;
    if (conversationHistory.length > 6) {
      // Keep the most recent messages only
      prunedHistory = conversationHistory.slice(-4);
    }
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...prunedHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Adjust temperature for regeneration requests to get more varied responses
    const temperature = diversityPrompt ? 0.8 : 0.5;
    
    // Request with optimized parameters for faster responses
    // Removed timeout parameter since it's not supported in the API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for faster responses
      messages: messages as any,
      temperature: temperature,
      max_tokens: 500, // Reduced for faster response times
      presence_penalty: 0.3, // Slight penalty to discourage repetition
      frequency_penalty: 0.5 // Higher value to further reduce token usage
    });
    
    const responseText = response.choices[0].message.content;
    console.timeEnd('gpt-response-time');
    
    // Cache the response for future use (limited to 50 entries)
    if (responseCache.size > 50) {
      // Remove oldest entry
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
    responseCache.set(cacheKey, responseText);
    
    return responseText;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}

/**
 * Get an AI response using the ChatGPT API with conversation history - optimized for speed
 * Standalone function for when real-time data isn't needed
 */
export async function getChatGPTResponse(
  message: string, 
  conversationHistory: { role: "user" | "assistant"; content: string }[]
): Promise<string> {
  try {
    console.time('gpt-simple-response-time');
    
    // Check cache for exact matches
    const cacheKey = `simple-${message}`;
    if (responseCache.has(cacheKey)) {
      console.log('Using cached response');
      console.timeEnd('gpt-simple-response-time');
      return responseCache.get(cacheKey);
    }
    
    // Prune conversation history to keep token count down
    let prunedHistory = conversationHistory;
    if (conversationHistory.length > 4) {
      // Keep only the most recent messages
      prunedHistory = conversationHistory.slice(-3);
    }
    
    const systemPrompt = 'You are a helpful assistant answering questions for a web browser interface. Be concise and informative.';
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...prunedHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Removed timeout parameter since it's not supported in the API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 400, // Reduced for faster responses
      presence_penalty: 0.3,
      frequency_penalty: 0.5
    });
    
    const responseText = response.choices[0].message.content;
    console.timeEnd('gpt-simple-response-time');
    
    // Cache the response for future use (limited to 50 entries)
    if (responseCache.size > 50) {
      // Remove oldest entry
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
    responseCache.set(cacheKey, responseText);
    
    return responseText;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}

// Clear cache periodically to avoid memory leaks
setInterval(() => {
  console.log(`Clearing response cache (${responseCache.size} entries)`);
  responseCache.clear();
}, 30 * 60 * 1000); // Clear every 30 minutes
