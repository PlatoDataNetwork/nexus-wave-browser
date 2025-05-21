
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatInput from './ChatInput';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { ChatMessage, StreamingOptions } from '@/types';
import ConversationMessage from './ConversationMessage';
import { getStreamingResponse } from '@/utils/openai';
import ResponseProgress from './ResponseProgress';
import { classifyQuery } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';
import { toast } from "sonner";

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
  
  // Suggestions for the current category - tech/AI focused
  const suggestions = [
    "What are the latest advancements in AI?",
    "How are LLMs being used in healthcare?",
    "What are the limitations of current generative AI?",
    "Which companies are leading AI innovation?"
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
    
    const startTime = performance.now();
    
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
      isStreaming: false
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
                  progressPercentage: 40 + (streamedContent.length / 20), // Incremental progress
                  stageDetails: "Generating your response...",
                  isStreaming: true
                }
              : msg
          )
        );
      };
      
      // Step 1: Classify the query to determine if we need real-time data
      setIsClassifying(true);
      
      // Update progress for visualization
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                processingStage: 'classifying',
                progressPercentage: 15,
                stageDetails: "Analyzing your query..."
              }
            : msg
        )
      );
      
      // Actually classify the query - not simulated
      const classification = await classifyQuery(messageToProcess);
      setIsClassifying(false);
      
      // Log classification for debugging
      console.log("Query classification:", classification);
      
      let realTimeData = null;
      let shouldUseWebContent = false;
      
      // Step 2: If the query needs real-time data, fetch it
      if (classification.needsRealTimeData && classification.confidence > 0.6) {
        shouldUseWebContent = true;
        setIsFetchingRealTimeData(true);
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  processingStage: 'searching',
                  progressPercentage: 30,
                  stageDetails: `Searching for latest information on ${classification.topics.join(', ')}...`
                }
              : msg
          )
        );
        
        // Actually fetch real-time data
        realTimeData = await getRealTimeData(messageToProcess, classification);
        setIsFetchingRealTimeData(false);
        
        if (realTimeData) {
          // Update progress once we have data
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === assistantMessageId
                ? { 
                    ...msg, 
                    processingStage: 'processing',
                    progressPercentage: 50,
                    stageDetails: "Processing information from web sources..."
                  }
                : msg
            )
          );
          
          console.log("Retrieved real-time data:", realTimeData);
        } else {
          console.log("No real-time data available");
        }
      } else {
        console.log("Query doesn't need real-time data");
      }
      
      // Step 3: Prepare streaming options
      const streamingOptions: StreamingOptions = {
        incorporateWebContent: shouldUseWebContent,
        webContent: realTimeData,
        systemPrompt: shouldUseWebContent 
          ? `You're an AI assistant with access to current information from the web. Today's date is ${new Date().toLocaleDateString()}. Synthesize the web content provided, clearly citing your sources.` 
          : `You're a helpful AI assistant answering questions about AI and technology. Today's date is ${new Date().toLocaleDateString()}.`
      };
      
      // Update to show we're starting to generate the response
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                processingStage: 'generating',
                progressPercentage: 60,
                stageDetails: "Creating your response...",
                isStreaming: true
              }
            : msg
        )
      );
      
      // Step 4: Start streaming response
      await getStreamingResponse(
        messageToProcess,
        updatedHistory,
        handleToken,
        streamingOptions
      );
      
      // Calculate total processing time
      const endTime = performance.now();
      const processingTimeMs = Math.round(endTime - startTime);
      
      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: streamedContent }
      ]);
      
      // Generate related questions based on the conversation
      let relatedQuestions: string[] = [];
      try {
        if (streamedContent.length > 0) {
          const { getChatGPTResponse } = await import('@/utils/openai');
          const relatedQuestionsPrompt = `Based on this conversation:\nUser: ${messageToProcess}\nYou: ${streamedContent.substring(0, 500)}${streamedContent.length > 500 ? '...' : ''}\n\nGenerate 3 follow-up questions that the USER might want to ask. These should be from the user's perspective (first-person) and be phrased as complete questions ending with question marks. Format your response as a JSON array like this: ["Question 1?", "Question 2?", "Question 3?"]`;
          
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
      
      // Update the message with completion status and timing information
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                isLoading: false,
                isStreaming: false,
                processingStage: 'complete',
                progressPercentage: 100,
                hasRealTimeData: !!realTimeData,
                sources: realTimeData?.sources,
                timeToProcess: processingTimeMs,
                relatedQuestions
              }
            : msg
        )
      );
      
      // Show toast with performance information
      if (processingTimeMs < 5000) {
        toast(`Response generated in ${(processingTimeMs/1000).toFixed(1)}s`, { 
          duration: 2000,
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
                streamProgress={message.streamProgress}
                processingStage={message.processingStage}
                progressPercentage={message.progressPercentage}
                stageDetails={message.stageDetails}
                relatedQuestions={message.relatedQuestions}
                onRelatedQuestionClick={handleSuggestionClick}
              />
            ))
          ) : showPrompts ? (
            // Display prompt suggestions
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-center">AI & Technology Questions</h3>
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
