
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import WaveMessage from './WaveMessage';
import { getChatGPTResponse, getStreamingResponse } from '@/utils/openai';
import { StreamingOptions } from '@/types';

export type WaveMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
  hasRealTimeData?: boolean;
  relatedQuestions?: string[];
};

interface WaveChatProps {
  initialPrompt?: string;
  categoryName?: string;
}

const WaveChat: React.FC<WaveChatProps> = ({ initialPrompt = '', categoryName }) => {
  const [messages, setMessages] = useState<WaveMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  // Suggestions based on category or defaults
  const suggestions = [
    initialPrompt || "Tell me about recent developments in this field",
    categoryName ? `What are the most innovative ${categoryName} applications in industries?` : "What are some practical applications?",
    categoryName ? `What's the future of ${categoryName}?` : "What future trends should I watch?",
    categoryName ? `How is ${categoryName} changing our world?` : "How is this technology evolving?"
  ];

  useEffect(() => {
    if (initialPrompt) {
      setCurrentMessage(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!currentMessage.trim()) return;
    
    // Hide suggestions once a message is submitted
    setShowSuggestions(false);
    
    const startTime = performance.now();
    
    // Add user message to conversation
    const userMessage: WaveMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    const messageToProcess = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    
    // Create placeholder for assistant response
    const assistantMessageId = `asst-${Date.now().toString()}`;
    const assistantMessage: WaveMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
      isStreaming: false,
      streamProgress: 0
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    
    // Update conversation history with the new user message
    const updatedHistory = [...conversationHistory, { role: "user", content: messageToProcess }];
    
    try {
      // Set up a callback to handle streaming tokens
      let streamedContent = '';
      let streamingProgress = 0;
      
      const handleToken = (token: string) => {
        streamedContent += token;
        streamingProgress += 1;
        
        // Update the assistant message with the new content
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  content: streamedContent,
                  isStreaming: true,
                  streamProgress: Math.min(95, streamingProgress) // Cap at 95% until complete
                }
              : msg
          )
        );
      };
      
      // Create streamingOptions for Wave - simpler than Search version
      const streamingOptions: StreamingOptions = {
        incorporateWebContent: false,
        systemPrompt: `You're an AI assistant specializing in ${categoryName || 'technology and innovation'}. Today's date is ${new Date().toLocaleDateString()}. Provide insightful, clear, and helpful responses.`
      };
      
      // Start streaming response
      await getStreamingResponse(
        messageToProcess,
        updatedHistory,
        handleToken,
        streamingOptions
      );
      
      // Generate related questions based on the conversation
      let relatedQuestions: string[] = [];
      try {
        if (streamedContent.length > 0) {
          const relatedQuestionsPrompt = `Based on this conversation about ${categoryName || 'this topic'}:\nUser: ${messageToProcess}\nYou: ${streamedContent.substring(0, 500)}${streamedContent.length > 500 ? '...' : ''}\n\nGenerate 3 follow-up questions that the USER might want to ask. These should be from the user's perspective (first-person) and be phrased as complete questions ending with question marks. Format your response as a JSON array like this: ["Question 1?", "Question 2?", "Question 3?"]`;
          
          const relatedQuestionsText = await getChatGPTResponse(relatedQuestionsPrompt, []);
          try {
            relatedQuestions = JSON.parse(relatedQuestionsText);
          } catch (e) {
            // If parsing fails, extract questions using regex
            const matches = relatedQuestionsText.match(/"([^"]+\?+)"/g);
            if (matches) {
              relatedQuestions = matches.map(q => q.replace(/"/g, '')).slice(0, 3);
            }
          }
        }
      } catch (error) {
        console.error("Error generating related questions:", error);
      }
      
      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: streamedContent }
      ]);
      
      // Update the message with completion status
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                isLoading: false,
                isStreaming: false,
                streamProgress: 100,
                relatedQuestions
              }
            : msg
        )
      );
      
      // Show performance toast
      const totalTime = performance.now() - startTime;
      if (totalTime < 4000) {
        toast(`Response generated in ${(totalTime/1000).toFixed(1)}s`, {
          duration: 1500
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      
      // Update with error state
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg,
                content: "I'm sorry, but I encountered an issue processing your request. Please try again.",
                isLoading: false,
                isStreaming: false,
                streamProgress: 100
              }
            : msg
        )
      );
      
      toast.error("Failed to generate response");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  const handleRelatedQuestionClick = (question: string) => {
    setCurrentMessage(question);
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-16">
          {messages.length > 0 ? (
            // Display conversation
            messages.map((message) => (
              <WaveMessage 
                key={message.id}
                message={message}
                onRelatedQuestionClick={handleRelatedQuestionClick}
              />
            ))
          ) : showSuggestions ? (
            // Display prompt suggestions
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">
                {categoryName ? `${categoryName} Questions` : 'Suggested Questions'}
              </h3>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <Button 
                    key={index}
                    variant="outline" 
                    className="flex items-center justify-between text-left"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <span>{suggestion}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Ask me anything..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 min-h-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            className="h-full bg-nexus-purple hover:bg-nexus-deep-purple"
            disabled={isLoading || !currentMessage.trim()}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WaveChat;
