
import OpenAI from 'openai';

// OpenAI API key
const OPENAI_API_KEY = "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";

// Create a single instance of the OpenAI client
export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Normally in production, API calls should go through a backend
});

/**
 * Get an AI response using the ChatGPT API with conversation history and real-time data
 */
export async function getChatGPTResponseWithRealTimeData(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  realTimeData?: { content: string; timestamp: Date; sources?: { title: string; url: string }[] } | null,
  diversityPrompt?: string
): Promise<string> {
  try {
    // Base system prompt
    let systemPrompt = 'You are Nexus Wave\'s helpful assistant answering questions for users. Your responses should be well-formatted with proper markdown, especially for code blocks. When showing code examples, use triple backticks with the language name, e.g. ```javascript. Be concise but informative.';
    
    // Add diversity prompt if provided (for regeneration requests)
    if (diversityPrompt) {
      systemPrompt += `\n\n${diversityPrompt}`;
    }
    
    // Enhance the system prompt with real-time data if available
    if (realTimeData) {
      const formattedTime = realTimeData.timestamp.toLocaleString();
      systemPrompt += `\n\nIMPORTANT: I'm providing you with real-time information from web searches performed at ${formattedTime}. Use this information to enhance your response when answering the user's question. The following is real-time data from the web:\n\n${realTimeData.content}\n\nIncorporate this information naturally in your response when relevant, but still maintain your helpful assistant personality. If the web data appears incomplete or irrelevant, use your own knowledge to supplement it.`;
    }
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Increase temperature for regeneration requests to get more varied responses
    const temperature = diversityPrompt ? 0.9 : 0.7;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      temperature: temperature,
      max_tokens: 800
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
}

/**
 * Stream an AI response using the ChatGPT API with conversation history and real-time data
 */
export async function streamChatGPTResponseWithRealTimeData(
  message: string,
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  onChunk: (chunk: string, isDone: boolean) => void,
  realTimeData?: { content: string; timestamp: Date; sources?: { title: string; url: string }[] } | null,
  diversityPrompt?: string
): Promise<void> {
  try {
    // Base system prompt
    let systemPrompt = 'You are Nexus Wave\'s helpful assistant answering questions for users. Your responses should be well-formatted with proper markdown, especially for code blocks. When showing code examples, use triple backticks with the language name, e.g. ```javascript. Be concise but informative.';
    
    // Add diversity prompt if provided (for regeneration requests)
    if (diversityPrompt) {
      systemPrompt += `\n\n${diversityPrompt}`;
    }
    
    // Enhance the system prompt with real-time data if available
    if (realTimeData) {
      const formattedTime = realTimeData.timestamp.toLocaleString();
      systemPrompt += `\n\nIMPORTANT: I'm providing you with real-time information from web searches performed at ${formattedTime}. Use this information to enhance your response when answering the user's question. The following is real-time data from the web:\n\n${realTimeData.content}\n\nIncorporate this information naturally in your response when relevant, but still maintain your helpful assistant personality. If the web data appears incomplete or irrelevant, use your own knowledge to supplement it.`;
    }
    
    // Construct messages array with system prompt, conversation history, and current message
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];
    
    // Increase temperature for regeneration requests to get more varied responses
    const temperature = diversityPrompt ? 0.9 : 0.7;
    
    let accumulatedText = '';

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages as any,
      temperature: temperature,
      max_tokens: 800,
      stream: true,
    });

    // Process the stream of chunks
    for await (const chunk of stream) {
      // Get the content from the chunk
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        accumulatedText += content;
        onChunk(accumulatedText, false);
      }
    }
    
    // Signal that streaming is complete
    onChunk(accumulatedText, true);
  } catch (error) {
    console.error("Error streaming AI response:", error);
    throw error;
  }
}
