import OpenAI from 'openai';
import { StreamingOptions } from '@/types';

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

// Define time-sensitive query indicators
const timeSensitiveTerms = ['weather', 'forecast', 'temperature', 'today', 'current', 'now', 'latest', 'alert', 'warning'];

// Optimized prompt templates for faster responses
const SYSTEM_PROMPTS = {
  DEFAULT: 'You are Nexus Wave\'s helpful assistant answering questions. Be concise but informative. Always include the current date in your responses when relevant.',
  REALTIME: 'You are a fast and efficient information synthesizer. Keep responses under 200 words. Focus on key points. Today\'s date is ' + new Date().toLocaleDateString() + '. Always provide the most up-to-date information.',
  DIVERSITY: 'Provide a different perspective than previous responses. Be concise.',
  STREAMING: 'You are a real-time assistant. Focus on the most important details first and keep responses brief. Today\'s date is ' + new Date().toLocaleDateString() + '. Always include this date when discussing time-sensitive information.',
  RELATED_QUESTIONS: 'You are generating follow-up questions that a user might want to ask based on their previous question and the response. These should always be from the user\'s perspective (first-person) and be phrased as complete questions ending with question marks. Return EXACTLY 3 questions. Format your response as a JSON array like this: ["Question 1?", "Question 2?", "Question 3?"]'
};

/**
 * Check if a query is time-sensitive and should bypass cache
 */
const isTimeSensitiveQuery = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  return timeSensitiveTerms.some(term => lowerMessage.includes(term));
};

/**
 * Generate a cache key that includes the current date for time-sensitive queries
 */
const generateCacheKey = (message: string, realTimeData: boolean): string => {
  const isTimeSensitive = isTimeSensitiveQuery(message);
  
  // For time-sensitive queries, include the current date in the cache key
  if (isTimeSensitive) {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    return `${message}-${realTimeData ? 'withData' : 'noData'}-${today}`;
  }
  
  return `${message}-${realTimeData ? 'withData' : 'noData'}`;
};

/**
 * Get a streaming AI response using the ChatGPT API
 * Optimized for the fastest possible first token time
 */
export async function getStreamingResponse(
  query: string,
  history: { role: string; content: string }[] = [],
  onToken: (token: string) => void,
  options?: StreamingOptions
): Promise<void> {
  try {
    console.time('streaming-first-token');
    
    // Generate cache key that accounts for time-sensitivity
    const cacheKey = generateCacheKey(query, !!options?.incorporateWebContent);
    
    // Skip cache for time-sensitive queries to ensure fresh data
    const shouldBypassCache = isTimeSensitiveQuery(query);
    
    // Check cache for exact matches to avoid redundant calls (only if not time-sensitive)
    if (!shouldBypassCache && responseCache.has(cacheKey)) {
      console.log('Using cached response');
      const cachedResponse = responseCache.get(cacheKey);
      // Simulate streaming for cached responses
      const chunks = cachedResponse.split(' ');
      for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, 10));
        onToken(chunk + ' ');
      }
      return;
    }
    
    // Enhance system prompt with current date information
    let systemPrompt = SYSTEM_PROMPTS.STREAMING;
    
    // Add real-time data if available (but keep it minimal for faster processing)
    if (options?.incorporateWebContent) {
      systemPrompt += `\n\nUse this data:\n${options?.incorporateWebContent.content.substring(0, 500)}${options?.incorporateWebContent.content.length > 500 ? '...' : ''}`;
      
      // Include source information in system prompt
      if (options?.incorporateWebContent.sources && options?.incorporateWebContent.sources.length > 0) {
        systemPrompt += `\n\nSources:\n${options?.incorporateWebContent.sources.map(source => 
          `- ${source.title || 'Unknown'}: ${source.url || 'No URL'}`
        ).join('\n')}`;
      }
      
      // Add current date explicitly
      systemPrompt += `\n\nCurrent date: ${new Date().toLocaleDateString()}. Include this date in your response when relevant.`;
    }
    
    // Keep history minimal for faster processing
    let prunedHistory = history;
    if (history.length > 4) {
      // Keep only the most recent messages
      prunedHistory = history.slice(-3);
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
        content: query
      }
    ];
    
    // Request with optimized parameters for fastest possible first token
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for faster responses
      messages: messages as any,
      temperature: 0.5,
      max_tokens: 600, // Reduced for faster responses
      stream: true, // Enable streaming
      frequency_penalty: 0.3
    });
    
    let fullResponse = '';
    let isFirstToken = true;
    
    // Process the stream
    for await (const chunk of stream) {
      if (chunk.choices[0]?.delta?.content) {
        const token = chunk.choices[0].delta.content;
        
        // For first token, make sure we start with a clean state
        if (isFirstToken) {
          fullResponse = token;
          isFirstToken = false;
          console.timeEnd('streaming-first-token');
        } else {
          fullResponse += token;
        }
        
        onToken(token);
      }
    }
    
    // Don't cache time-sensitive queries with a long TTL
    // For time-sensitive, keep a shorter TTL (10 minutes)
    const isSensitive = isTimeSensitiveQuery(query);
    
    // Cache the response for future use (limited to 50 entries)
    if (responseCache.size > 50) {
      // Remove oldest entry
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
    
    responseCache.set(cacheKey, fullResponse);
    
    // Set a shorter timeout for time-sensitive queries
    if (isSensitive) {
      setTimeout(() => {
        responseCache.delete(cacheKey);
        console.log(`Removed time-sensitive cache entry: ${cacheKey}`);
      }, 10 * 60 * 1000); // 10 minutes 
    }
    
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
    
    // Skip cache for time-sensitive queries
    const shouldBypassCache = isTimeSensitiveQuery(message);
    
    // Generate a cache key that includes date for time-sensitive queries
    const cacheKey = generateCacheKey(message, !!realTimeData) + 
      (diversityPrompt ? '-diverse' : '-normal');
    
    // Check cache for exact matches, but bypass for time-sensitive queries
    if (!shouldBypassCache && responseCache.has(cacheKey)) {
      console.log('Using cached response');
      console.timeEnd('gpt-response-time');
      return responseCache.get(cacheKey);
    }
    
    // Base system prompt - include current date
    let systemPrompt = SYSTEM_PROMPTS.DEFAULT + 
      ` Today's date is ${new Date().toLocaleDateString()}. Include this date when answering time-sensitive questions.`;
    
    // Check if this is a related questions request
    if (message.includes("follow-up questions that the USER might want to ask")) {
      systemPrompt = SYSTEM_PROMPTS.RELATED_QUESTIONS;
    } 
    // Add diversity prompt if provided (for regeneration requests)
    else if (diversityPrompt) {
      systemPrompt = SYSTEM_PROMPTS.DIVERSITY + 
      ` Today's date is ${new Date().toLocaleDateString()}.`;
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
    
    // Cache the response but with shorter TTL for time-sensitive queries
    if (responseCache.size > 50) {
      // Remove oldest entry
      const firstKey = responseCache.keys().next().value;
      responseCache.delete(firstKey);
    }
    
    responseCache.set(cacheKey, responseText);
    
    // Set shorter TTL for time-sensitive queries
    if (isTimeSensitiveQuery(message)) {
      setTimeout(() => {
        responseCache.delete(cacheKey);
        console.log(`Removed time-sensitive cache entry: ${cacheKey}`);
      }, 10 * 60 * 1000); // 10 minutes
    }
    
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
    
    // Check if query is time-sensitive
    const shouldBypassCache = isTimeSensitiveQuery(message);
    
    // Generate appropriate cache key
    const cacheKey = generateCacheKey(message, false);
    
    // Check cache for exact matches
    if (!shouldBypassCache && responseCache.has(cacheKey)) {
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
    
    const systemPrompt = 'You are a helpful assistant answering questions for a web browser interface. Be concise and informative. ' +
      `Today's date is ${new Date().toLocaleDateString()}. Include this date when answering time-sensitive questions.`;
    
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
    
    // Set shorter TTL for time-sensitive queries
    if (isTimeSensitiveQuery(message)) {
      setTimeout(() => {
        responseCache.delete(cacheKey);
        console.log(`Removed time-sensitive cache entry: ${cacheKey}`);
      }, 10 * 60 * 1000); // 10 minutes
    }
    
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

// Clear the cache immediately to remove any stale responses
responseCache.clear();
console.log("Response cache cleared to remove outdated information");
