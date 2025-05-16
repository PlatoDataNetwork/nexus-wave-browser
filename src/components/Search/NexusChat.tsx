import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Zap, Globe } from "lucide-react";
import { toast } from "sonner";
import ConversationMessage from './ConversationMessage';
import { classifyQuery } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { getChatGPTResponseWithRealTimeData } from '@/utils/openai';

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
  hasRealTimeData?: boolean;
  chartData?: {
    type: string;
    data: Array<Record<string, any>>;
    title: string;
    xAxisKey: string;
    yAxisKeys: string[];
    colors?: Record<string, string>;
  };
  alternativeResponses?: string[];
  currentResponseIndex?: number;
}

interface NexusChatProps {
  onSearch?: (query: string) => void;
}

const NexusChat: React.FC<NexusChatProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isFetchingRealTimeData, setIsFetchingRealTimeData] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentMessage.trim()) return;
    
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Call onSearch without updating URL - just inform parent component
    if (onSearch) {
      onSearch(currentMessage);
    }
    
    const messageToSearch = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    
    try {
      // Step 1: Classify the query to determine if it needs real-time data
      setIsClassifying(true);
      let realTimeData = null;
      let needsRealTimeData = false;
      
      try {
        const classification = await classifyQuery(messageToSearch);
        needsRealTimeData = classification.needsRealTimeData;
        
        // Step 2: If needed, fetch real-time data from the web
        if (needsRealTimeData) {
          setIsClassifying(false);
          setIsFetchingRealTimeData(true);
          
          // Show loading toast for real-time data
          toast("Fetching real-time data...", {
            duration: 3000,
            icon: <Globe className="h-4 w-4" />
          });
          
          realTimeData = await getRealTimeData(messageToSearch, classification);
          
          if (realTimeData) {
            toast("Found real-time information", {
              duration: 2000,
              icon: <Zap className="h-4 w-4 text-nexus-purple" />
            });
          }
        }
      } catch (error) {
        console.error("Error during classification or data fetching:", error);
        toast("Couldn't analyze query for real-time needs", {
          duration: 2000
        });
      } finally {
        setIsClassifying(false);
        setIsFetchingRealTimeData(false);
      }
      
      // Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      // Generate AI response using ChatGPT API with conversation history and real-time data if available
      const aiResponseContent = await getChatGPTResponseWithRealTimeData(
        messageToSearch, 
        updatedHistory,
        realTimeData
      );
      
      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: aiResponseContent }
      ]);
      
      // Create sources from real-time data for citation
      const sources = realTimeData?.sources || [];
      
      // Add AI response to conversation UI
      const aiResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined,
        hasRealTimeData: !!realTimeData,
        chartData: realTimeData?.chartData,
        alternativeResponses: [],
        currentResponseIndex: 0
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateMessage = async (messageId: string) => {
    // Find the message and its corresponding user message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1 || messages[messageIndex].role !== 'assistant') return;
    
    // Find the preceding user message
    let userMessageIndex = messageIndex - 1;
    while (userMessageIndex >= 0 && messages[userMessageIndex].role !== 'user') {
      userMessageIndex--;
    }
    
    if (userMessageIndex < 0) return;
    
    const userMessage = messages[userMessageIndex];
    const currentAssistantMessage = messages[messageIndex];
    
    // Show regenerating toast
    toast("Regenerating response...", {
      duration: 3000,
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    });
    
    setIsLoading(true);
    
    try {
      // Get real-time data if the original response had it
      let realTimeData = null;
      
      if (currentAssistantMessage.hasRealTimeData) {
        try {
          setIsFetchingRealTimeData(true);
          const classification = await classifyQuery(userMessage.content);
          realTimeData = await getRealTimeData(userMessage.content, classification);
        } catch (error) {
          console.error("Error fetching real-time data for regeneration:", error);
        } finally {
          setIsFetchingRealTimeData(false);
        }
      }
      
      // Generate new response
      const aiResponseContent = await getChatGPTResponseWithRealTimeData(
        userMessage.content,
        conversationHistory.slice(0, -1), // Exclude the last assistant response
        realTimeData
      );
      
      // Create sources from real-time data for citation
      const sources = realTimeData?.sources || [];
      
      // Store the current response in alternatives
      const alternatives = [
        ...currentAssistantMessage.alternativeResponses || [],
        currentAssistantMessage.content
      ];
      
      // Create new AI response
      const regeneratedResponse: ChatMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : currentAssistantMessage.sources,
        hasRealTimeData: !!realTimeData || currentAssistantMessage.hasRealTimeData,
        chartData: realTimeData?.chartData || currentAssistantMessage.chartData,
        alternativeResponses: alternatives,
        currentResponseIndex: 0
      };
      
      // Replace the old message with the new one
      const updatedMessages = [...messages];
      updatedMessages[messageIndex] = regeneratedResponse;
      
      setMessages(updatedMessages);
      
      // Update conversation history
      const updatedHistory = [...conversationHistory];
      updatedHistory.splice(-1, 1, { role: "assistant", content: aiResponseContent });
      setConversationHistory(updatedHistory);
      
      toast.success("Response regenerated");
    } catch (error) {
      console.error("Error regenerating response:", error);
      toast.error("Failed to regenerate response");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelectAlternative = (messageId: string, index: number) => {
    setMessages(prevMessages => {
      return prevMessages.map(message => {
        if (message.id === messageId) {
          // If we're selecting the current response (index 0), use the main content
          // Otherwise, use one of the alternative responses
          let content = message.content;
          
          if (index > 0 && message.alternativeResponses && index <= message.alternativeResponses.length) {
            content = message.alternativeResponses[index - 1];
          }
          
          return {
            ...message,
            currentResponseIndex: index,
            content: index === 0 ? message.content : message.alternativeResponses![index - 1]
          };
        }
        return message;
      });
    });
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-nexus-purple/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-nexus-purple" />
              </div>
              <h2 className="text-xl font-medium mb-2">Welcome to Nexus AI</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Ask me anything and I'll provide helpful information and answers to your questions.
              </p>
              <div className="flex gap-2 flex-wrap justify-center max-w-lg mx-auto">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentMessage("What's the weather in New York today?")}
                  className="flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" /> Weather in New York
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentMessage("Current USD to EUR exchange rate")}
                  className="flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" /> USD to EUR rate
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentMessage("Latest news about SpaceX")}
                  className="flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" /> SpaceX news
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setCurrentMessage("Show me a chart of Bitcoin price trends")}
                  className="flex items-center gap-1"
                >
                  <Zap className="h-3 w-3" /> Bitcoin price chart
                </Button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ConversationMessage 
                key={message.id}
                role={message.role}
                content={message.content}
                sources={message.sources}
                hasRealTimeData={message.hasRealTimeData}
                chartData={message.chartData}
                messageId={message.id}
                onRegenerateMessage={message.role === 'assistant' ? handleRegenerateMessage : undefined}
                alternativeResponses={message.alternativeResponses || []}
                currentResponseIndex={message.currentResponseIndex || 0}
                onSelectAlternative={(index) => handleSelectAlternative(message.id, index)}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border mt-auto">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Ask Nexus anything..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 min-h-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            type="submit" 
            className="h-full bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-1">
                {isClassifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Analyzing</span>
                  </>
                ) : isFetchingRealTimeData ? (
                  <>
                    <Globe className="h-4 w-4 animate-pulse" />
                    <span className="text-xs">Searching</span>
                  </>
                ) : (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-xs">Thinking</span>
                  </>
                )}
              </div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NexusChat;
