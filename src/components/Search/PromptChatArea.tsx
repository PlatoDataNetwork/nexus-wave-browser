
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from './ChatInput';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ChatMessage } from '@/types';
import ConversationMessage from './ConversationMessage';
import { getChatGPTResponseWithRealTimeData, getStreamingResponse } from '@/utils/openai';
import ResponseProgress from './ResponseProgress';

interface PromptChatAreaProps {
  initialPrompt?: string;
  onSearch: (query: string) => void;
}

// Define a properly typed conversation history interface
type ConversationHistoryItem = {
  role: "user" | "assistant";
  content: string;
};

const PromptChatArea: React.FC<PromptChatAreaProps> = ({ initialPrompt = '', onSearch }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [isFetchingRealTimeData, setIsFetchingRealTimeData] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Suggestions for the current category
  const suggestions = [
    "What are the latest advancements in this field?",
    "How is this technology being applied in healthcare?",
    "What are the biggest challenges for this industry?",
    "Which companies are leading innovation in this space?"
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
    
    // Hide prompts once a message is submitted
    setShowPrompts(false);
    
    // Add user message to conversation
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Notify parent component about the search
    if (onSearch) {
      onSearch(currentMessage);
    }
    
    const messageToProcess = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    setIsClassifying(true);
    
    // Create placeholder for assistant response
    const assistantMessageId = `asst-${Date.now().toString()}`;
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
      processingStage: 'initializing',
      progressPercentage: 5,
      stageDetails: "Preparing your response...",
      isStreaming: true
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    
    // Update conversation history with the new user message
    const updatedHistory: ConversationHistoryItem[] = [...conversationHistory, { role: "user", content: messageToProcess }];
    
    try {
      // Set up a callback to handle streaming tokens
      let streamedContent = '';
      
      const handleToken = (token: string) => {
        streamedContent += token;
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  content: streamedContent,
                  processingStage: 'streaming',
                  progressPercentage: 40 + (streamedContent.length / 10), // Incremental progress
                  stageDetails: "Generating your response..."
                }
              : msg
          )
        );
      };
      
      // Simulate classification and real-time data fetching
      setIsClassifying(true);
      
      // Update progress for visualization
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                processingStage: 'classifying',
                progressPercentage: 25,
                stageDetails: "Analyzing your query..."
              }
            : msg
        )
      );
      
      // Simulate classification delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsClassifying(false);
      
      // Simulate real-time data fetching
      setIsFetchingRealTimeData(true);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                processingStage: 'searching',
                progressPercentage: 60,
                stageDetails: "Searching for real-time data..."
              }
            : msg
        )
      );
      
      // Simulate real-time data delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsFetchingRealTimeData(false);
      
      // Start streaming response
      await getStreamingResponse(
        messageToProcess,
        updatedHistory,
        handleToken
      );
      
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
                processingStage: 'complete',
                progressPercentage: 100,
                hasRealTimeData: true
              }
            : msg
        )
      );
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
                processingStage: 'complete',
                progressPercentage: 100
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setIsClassifying(false);
      setIsFetchingRealTimeData(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
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
              <ConversationMessage 
                key={message.id}
                messageId={message.id}
                role={message.role}
                content={message.content}
                sources={message.sources}
                hasRealTimeData={message.hasRealTimeData}
                isLoading={message.isLoading}
                isStreaming={message.isStreaming}
                streamProgress={message.progressPercentage}
                processingStage={message.processingStage}
                progressPercentage={message.progressPercentage}
                stageDetails={message.stageDetails}
              />
            ))
          ) : showPrompts ? (
            // Display prompt suggestions
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">Suggested Questions</h3>
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
        <ChatInput
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isClassifying={isClassifying}
          isFetchingRealTimeData={isFetchingRealTimeData}
        />
      </div>
    </div>
  );
};

export default PromptChatArea;

