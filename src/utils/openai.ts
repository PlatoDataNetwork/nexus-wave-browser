
import OpenAI from 'openai';

// OpenAI API key
const OPENAI_API_KEY = "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";

// Define the RealTimeData interface
export interface RealTimeData {
  content: string;
  timestamp: Date;
  sources: { title: string; url: string }[];
}

// Create a single instance of the OpenAI client
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Normally in production, API calls should go through a backend
});

// Optimized prompt templates for faster responses
const SYSTEM_PROMPTS = {
  DEFAULT: 'You are Nexus Wave\'s helpful assistant answering questions. Be concise but informative.',
  REALTIME: 'You are a fast and efficient information synthesizer. Focus on brevity and clarity in your responses.',
  DIVERSITY: 'Provide a different perspective or approach than previous responses. Use different examples and structure.',
  STREAMING: 'You are a real-time assistant providing information as quickly as possible. Focus on the most important details first.'
};

/**
 * Get streaming response from OpenAI
 */
export async function getStreamingResponse(
  query: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  onToken: (token: string) => void,
  realTimeData?: RealTimeData
): Promise<void> {
  try {
    // Check if we have real-time data to enhance the response
    const systemPrompt = realTimeData 
      ? `You are a helpful AI assistant with access to real-time information. Use the provided real-time data when relevant to the query.
         
         Real-time data available:
         ${realTimeData.content}
         
         Sources: ${realTimeData.sources.map(s => s.title).join(', ')}
         
         When using this real-time information, cite the appropriate source(s).
         
         For questions unrelated to this real-time data, respond normally as a helpful assistant.
         Be accurate, helpful, and concise.`
      : "You are a helpful AI assistant. You provide accurate, relevant, and thoughtful answers to queries. Be clear, concise, and helpful.";
    
    // Create messages array with system prompt and conversation history
    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      }))
    ];
    
    // Stream the response
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for speed
      messages: messages,
      stream: true,
      temperature: 0.7
    });
    
    // Process each chunk as it arrives
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        onToken(content);
      }
    }
    
  } catch (error) {
    console.error("Error streaming response:", error);
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
      `\n\nIMPORTANT: I'm providing real-time information from web searches (${formattedTime}). Use this to enhance your response:\n\n${realTimeData.content}`;
    }
    
    // Prune conversation history to keep token count down when it gets too long
    let prunedHistory = conversationHistory;
    if (conversationHistory.length > 8) {
      // Keep the first message for context and the most recent messages
      prunedHistory = [
        conversationHistory[0],
        ...conversationHistory.slice(-6)
      ];
    }
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...prunedHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];
    
    // Adjust temperature for regeneration requests to get more varied responses
    const temperature = diversityPrompt ? 0.8 : 0.5;
    
    // Request with optimized parameters for faster responses
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Using mini for faster responses
      messages: messages,
      temperature: temperature,
      max_tokens: 600, // Reduced for faster response times
      presence_penalty: 0.3, // Slight penalty to discourage repetition
      // Use higher values for frequency_penalty to further reduce token usage
      frequency_penalty: 0.5
    });
    
    console.timeEnd('gpt-response-time');
    return response.choices[0].message.content;
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
  conversationHistory: { role: "user" | "assistant"; content: string }[] = []
): Promise<string> {
  try {
    console.time('gpt-simple-response-time');
    
    // Prune conversation history to keep token count down
    let prunedHistory = conversationHistory;
    if (conversationHistory.length > 6) {
      // Keep first message and last 5 messages
      prunedHistory = [
        conversationHistory[0],
        ...conversationHistory.slice(-5)
      ];
    }
    
    const systemPrompt = 'You are a helpful assistant answering questions for a web browser interface. Be concise and informative.';
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system' as const,
        content: systemPrompt
      },
      ...prunedHistory.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: 'user' as const,
        content: message
      }
    ];
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      temperature: 0.5,
      max_tokens: 500,
      presence_penalty: 0.3,
      frequency_penalty: 0.5
    });
    
    console.timeEnd('gpt-simple-response-time');
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}
