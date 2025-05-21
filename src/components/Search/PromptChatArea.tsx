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
import { searchWithSerper } from '@/services/searchApi';
import { scrapeContent } from '@/utils/contentScraper';
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
  const [processingStage, setProcessingStage] = useState<string>('');
  const [scrapeProgress, setScrapeProgress] = useState(0);
  const [processingStartTime, setProcessingStartTime] = useState<number | null>(null);
  
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
    
    // Start measuring processing time
    const startTime = Date.now();
    setProcessingStartTime(startTime);
    
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
                  progressPercentage: 40 + (streamedContent.length / 20), // Incremental progress
                  stageDetails: "Generating your response..."
                }
              : msg
          )
        );
      };
      
      // Start actual query classification
      setIsClassifying(true);
      setProcessingStage("Analyzing your query to determine information needs");
      
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
      
      // Actual query classification
      const classification = await classifyQuery(messageToProcess);
      console.log("Query classification:", classification);
      setIsClassifying(false);
      
      // Determine if we need real-time data
      const needsRealTimeData = classification.needsRealTimeData || 
                               messageToProcess.toLowerCase().includes('latest') || 
                               messageToProcess.toLowerCase().includes('recent') ||
                               messageToProcess.toLowerCase().includes('current');
      
      if (needsRealTimeData) {
        // Start real-time data gathering
        setIsFetchingRealTimeData(true);
        setProcessingStage("Searching for real-time information from trusted sources");
        
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            msg.id === assistantMessageId
              ? { 
                  ...msg, 
                  processingStage: 'searching',
                  progressPercentage: 25,
                  stageDetails: "Searching for real-time data..."
                }
              : msg
          )
        );
        
        // Fetch real-time data through search API
        const searchResponse = await searchWithSerper(
          messageToProcess, 
          'search', 
          true, 
          5, 
          'day'
        );
        
        if (!searchResponse || !searchResponse.results || searchResponse.results.length === 0) {
          setProcessingStage("No relevant real-time data found, using knowledge base");
          setScrapeProgress(0);
        } else {
          // Extract content from top search results
          setProcessingStage("Found relevant sources, extracting content");
          setScrapeProgress(30);
          
          // Get the top 3 search results
          const topResults = searchResponse.results.slice(0, 3);
          
          // Update progress
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === assistantMessageId
                ? { 
                    ...msg, 
                    processingStage: 'searching',
                    progressPercentage: 35,
                    stageDetails: `Extracting content from ${topResults.length} sources...`,
                    sources: topResults.map(result => ({
                      title: result.title || result.url.split('/')[2],
                      url: result.url
                    }))
                  }
                : msg
            )
          );
          
          // Scrape content from each URL
          const scrapedContents = await Promise.all(
            topResults.map(async (result, index) => {
              setScrapeProgress(30 + ((index + 1) / topResults.length * 30));
              setProcessingStage(`Scraping content from ${result.title || result.url.split('/')[2]}`);
              try {
                return await scrapeContent(result.url);
              } catch (error) {
                console.error(`Failed to scrape ${result.url}:`, error);
                // Return basic info from search result if scraping fails
                return {
                  title: result.title || result.url.split('/')[2],
                  content: result.description || "",
                  url: result.url,
                  isPartial: true
                };
              }
            })
          );
          
          // Update the message with the scraped sources
          setMessages(prevMessages => 
            prevMessages.map(msg => 
              msg.id === assistantMessageId
                ? { 
                    ...msg, 
                    processingStage: 'processing',
                    progressPercentage: 60,
                    stageDetails: "Analyzing extracted content...",
                    sources: scrapedContents.map(content => ({
                      title: content.title,
                      url: content.url,
                      date: content.date
                    }))
                  }
                : msg
            )
          );
          
          // Synthesize information for the query
          setProcessingStage("Synthesizing information for your query");
          
          // Prepare content for insertion into the prompt
          const contentForGPT = scrapedContents.map(content => ({
            title: content.title,
            url: content.url,
            content: content.content.substring(0, 2000), // Limit each content to 2000 chars
            date: content.date || 'Unknown'
          }));
          
          // Add specific instructions to the system message for handling real-time data
          const systemPrompt = `You are an AI assistant that provides helpful, accurate, and up-to-date information. I'll provide you with some scraped content from web searches related to the user's query.
          
          When responding:
          1. Incorporate the real-time information from the provided sources where relevant
          2. Cite sources when you use specific information from them
          3. Be explicit about the recency of the data (today, this week, this month, etc.)
          4. If information seems outdated or contradictory, acknowledge this
          5. Keep your response conversational and helpful
          
          The user's query is: "${messageToProcess}"
          
          Here is the relevant content from web sources:
          ${JSON.stringify(contentForGPT)}`;
          
          // Start streaming response with the enhanced system prompt
          await getStreamingResponse(
            messageToProcess,
            updatedHistory,
            handleToken,
            {
              systemPrompt,
              incorporateWebContent: true
            } as StreamingOptions
          );
          
        }
        
        setIsFetchingRealTimeData(false);
      } else {
        // Just use regular response for non-real-time queries
        await getStreamingResponse(
          messageToProcess,
          updatedHistory,
          handleToken
        );
      }
      
      // Calculate total processing time
      const processingTime = Date.now() - startTime;
      
      // Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant", content: streamedContent }
      ]);
      
      // Generate related questions based on the conversation
      const relatedQuestions = [
        `Tell me more about ${messageToProcess.split(' ').slice(0, 3).join(' ')}`,
        `What are the latest developments in this area?`,
        `How does this compare to other approaches?`
      ];
      
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
                hasRealTimeData: needsRealTimeData,
                timeToProcess: processingTime,
                // Keep any sources that were added during processing
                relatedQuestions
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
      
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
      setIsClassifying(false);
      setIsFetchingRealTimeData(false);
      setScrapeProgress(0);
      setProcessingStage('');
      setProcessingStartTime(null);
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
                relatedQuestions={message.relatedQuestions}
                onRelatedQuestionClick={handleRelatedQuestionClick}
                timeToProcess={message.timeToProcess}
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
        
        {/* Show processing stage info if available */}
        {(processingStage && scrapeProgress > 0) && (
          <div className="text-xs text-muted-foreground mt-2 px-2 py-1 bg-muted/30 rounded-md">
            <div className="flex items-center gap-1">
              <span className="font-medium">Processing:</span> 
              <span>{processingStage}</span>
              {processingStartTime && (
                <span className="ml-auto">
                  {((Date.now() - processingStartTime) / 1000).toFixed(1)}s
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptChatArea;
