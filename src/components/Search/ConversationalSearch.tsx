import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Shield, Calendar, Zap } from "lucide-react";
import ConversationMessage from './ConversationMessage';
import SearchSuggestions from './SearchSuggestions';
import { SearchResultItem } from '@/services/searchApi';
import { toast } from "sonner";
import SearchSidebar from './SearchSidebar';
import { getChatGPTResponse, getStreamingResponse } from '@/utils/openai';
import { ClassificationResult } from '@/utils/queryClassifier';
import { getRealTimeData } from '@/utils/realTimeData';

// Default classification for simple queries
const DEFAULT_CLASSIFICATION: ClassificationResult = {
  topics: ['general'],
  needsRealTimeData: false,
  confidence: 0.5,
  suggestedSearchTerms: []
};

/**
 * Define the message interface with support for streaming
 */
interface ConversationMessage {
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
}

interface ConversationalSearchProps {
  onSearch?: (query: string) => void;
}

const ConversationalSearch: React.FC<ConversationalSearchProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [safeSearch, setSafeSearch] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [recencyFilter, setRecencyFilter] = useState<"day" | "week" | "month" | "any">("day");
  const [searchError, setSearchError] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // State to track if we're using cached results
  const [usingCachedResults, setUsingCachedResults] = useState(false);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Handle user message submission with streaming response
   */
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (!currentMessage.trim()) return;
    
    // Reset state
    setIsLoading(true);
    setSearchError("");
    setIsStreaming(true);
    
    // Add user message to conversation
    const userMessage: ConversationMessage = {
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
    
    // Create placeholder for assistant response with streaming indication
    const assistantMessageId = `asst-${Date.now().toString()}`;
    const assistantMessage: ConversationMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
      isStreaming: true,
      streamProgress: 0
    };
    
    setMessages(prevMessages => [...prevMessages, assistantMessage]);
    
    // Start performance timing
    const startTime = performance.now();
    
    try {
      // 1. Start search for the sidebar - do this first to parallelize
      const searchPromise = (async () => {
        setSearchLoading(true);
        setLastSearchQuery(messageToSearch);
        setUsingCachedResults(false);
        
        try {
          // Import search function dynamically to reduce initial load time
          const { searchWithSerper } = await import('@/services/searchApi');
          
          console.log(`Fetching search results for "${messageToSearch}" with filter: ${recencyFilter}`);
          const results = await searchWithSerper(messageToSearch, 'search', safeSearch, 10, recencyFilter);
          setSearchResults(results?.results || []);
          setSearchError("");
          
          // Check if we got results quickly (likely cached)
          const searchTime = performance.now() - startTime;
          if (searchTime < 200) { // Less than 200ms usually indicates cached results
            setUsingCachedResults(true);
            toast("Using cached search results", { 
              icon: <Zap className="h-4 w-4 text-amber-500" />,
              duration: 1500
            });
          }
        } catch (error) {
          console.error("Search API error:", error);
          setSearchResults([]);
          setSearchError("Couldn't fetch search results");
          toast("Search API unavailable");
        } finally {
          setSearchLoading(false);
        }
      })();
      
      // 2. Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      // 3. Get real-time data in parallel
      // Dynamically import query classifier to reduce initial load
      const { classifyQuery } = await import('@/utils/queryClassifier');
      const classification = await classifyQuery(messageToSearch).catch(() => DEFAULT_CLASSIFICATION);
      
      // Get real-time data if available - this runs in parallel
      const realTimeDataPromise = getRealTimeData(messageToSearch, classification);
      
      // 4. Create a streaming response that updates in real-time
      let streamedContent = "";
      let streamingProgress = 0;
      
      // Function to handle each token as it arrives
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
                  streamProgress: Math.min(95, streamingProgress) // Cap at 95% until complete
                }
              : msg
          )
        );
      };
      
      // Wait for real-time data to be available
      const realTimeData = await realTimeDataPromise;
      
      // Start streaming response
      await getStreamingResponse(
        messageToSearch,
        updatedHistory,
        handleToken,
        realTimeData || undefined
      );
      
      // Wait for search to complete
      await searchPromise;
      
      // Create sources from search results for citation
      let sources = [];
      if (searchResults && searchResults.length > 0) {
        sources = searchResults.slice(0, 3).map(result => ({
          title: result.title,
          url: result.url
        }));
      }
      
      // If we have real-time data, use its sources instead
      if (realTimeData?.sources && realTimeData.sources.length > 0) {
        sources = realTimeData.sources;
      }
      
      // Update assistant message when streaming is complete
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                content: streamedContent,
                isLoading: false,
                isStreaming: false,
                streamProgress: 100,
                sources,
                hasRealTimeData: !!realTimeData
              }
            : msg
        )
      );
      
      // 5. Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: streamedContent }
      ]);
      
      // Calculate and show total response time
      const totalTime = performance.now() - startTime;
      console.log(`Total response time: ${totalTime.toFixed(0)}ms`);
      
      // Show a toast with the response time if it's fast
      if (totalTime < 4000) {
        toast(`Response generated in ${(totalTime/1000).toFixed(1)}s`, {
          icon: <Zap className="h-4 w-4 text-green-500" />,
          duration: 1500
        });
      }
    } catch (error) {
      console.error("AI error:", error);
      toast.error("Failed to fetch response. Please try again later.");
      
      // Update the message to show the error
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === assistantMessageId
            ? { 
                ...msg, 
                content: "I'm sorry, but I encountered an issue while processing your request. Please try again later.",
                isLoading: false,
                isStreaming: false
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setCurrentMessage(suggestion);
    // Auto-submit after a brief delay to show the suggestion in the input field
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  // Toggle safe search
  const handleToggleSafeSearch = () => {
    setSafeSearch(prev => !prev);
    toast(`Safe Search ${!safeSearch ? 'Enabled' : 'Disabled'}`);
  };

  // Toggle sidebar
  const handleToggleSidebar = () => {
    setShowSidebar(prev => !prev);
  };

  // Change recency filter
  const handleChangeRecencyFilter = (value: "day" | "week" | "month" | "any") => {
    setRecencyFilter(value);
    toast(`Results will now show content from the past ${value === "day" ? "24 hours" : value === "week" ? "week" : value === "month" ? "month" : "any time"}`);
    
    // Refresh search if there's an active query
    if (lastSearchQuery) {
      handleRefreshResults();
    }
  };

  // Refresh search results to get the latest data
  const handleRefreshResults = async () => {
    if (!lastSearchQuery) return;
    
    setSearchLoading(true);
    setSearchError("");
    toast("Refreshing search results...");
    
    try {
      // Import search function dynamically
      const { searchWithSerper } = await import('@/services/searchApi');
      
      console.log(`Refreshing search results for "${lastSearchQuery}" with filter: ${recencyFilter}`);
      const results = await searchWithSerper(lastSearchQuery, 'search', safeSearch, 10, recencyFilter);
      setSearchResults(results?.results || []);
      toast.success("Data refreshed with latest information");
    } catch (error) {
      console.error("Error refreshing search:", error);
      setSearchResults([]);
      setSearchError("Search data connection failed");
      toast.error("Search data unavailable");
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle related question click
  const handleRelatedQuestionClick = (question: string) => {
    setCurrentMessage(question);
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  // Regenerate a response
  const handleRegenerateMessage = async (messageId: string) => {
    // Find the message to regenerate and its corresponding user message
    const messageIndex = messages.findIndex(msg => msg.id === messageId);
    if (messageIndex <= 0 || messages[messageIndex].role !== 'assistant') {
      return;
    }
    
    // The user message comes before the assistant message
    const userMessage = messages[messageIndex - 1];
    
    // Create a new version of the conversation without the last assistant response
    const updatedConversationHistory = conversationHistory.slice(0, -1);
    
    // Set the message to loading state
    setMessages(prevMessages => 
      prevMessages.map(msg => 
        msg.id === messageId
          ? { ...msg, isLoading: true, content: "Regenerating response..." }
          : msg
      )
    );
    
    try {
      // Get a new response with a diversity prompt
      const newContent = await getChatGPTResponse(
        userMessage.content + "\n\nPlease provide a different perspective or approach in your response.",
        updatedConversationHistory
      );
      
      // Update the message with the new content
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId
            ? { ...msg, isLoading: false, content: newContent }
            : msg
        )
      );
      
      // Update conversation history
      setConversationHistory([
        ...updatedConversationHistory,
        { role: "assistant" as const, content: newContent }
      ]);
      
      toast.success("Response regenerated with a new perspective");
    } catch (error) {
      console.error("Error regenerating response:", error);
      
      // Update the message to show the error
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.id === messageId
            ? { 
                ...msg, 
                isLoading: false, 
                content: "Failed to regenerate response. Please try again."
              }
            : msg
        )
      );
      
      toast.error("Failed to regenerate response");
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between p-2 border-b border-border">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`flex items-center gap-1 ${safeSearch ? 'text-green-500' : 'text-amber-500'}`}
              onClick={handleToggleSafeSearch}
              type="button"
            >
              <Shield className={`h-4 w-4 ${safeSearch ? 'text-green-500' : 'text-amber-500'}`} />
              <span className="text-xs">{safeSearch ? 'Safe Search On' : 'Safe Search Off'}</span>
            </Button>

            <div className="flex items-center gap-1 border-l pl-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <select 
                className="text-xs bg-transparent border-none focus:ring-0 cursor-pointer"
                value={recencyFilter}
                onChange={(e) => handleChangeRecencyFilter(e.target.value as "day" | "week" | "month" | "any")}
              >
                <option value="day">Last 24 hours</option>
                <option value="week">Past week</option>
                <option value="month">Past month</option>
                <option value="any">Any time</option>
              </select>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleSidebar}
            className="text-muted-foreground"
          >
            {showSidebar ? "Hide Results" : "Show Results"}
          </Button>
        </div>
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 pb-4">
            {messages.length === 0 ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-nexus-purple/10 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-nexus-purple" />
                </div>
                <h2 className="text-xl font-medium mb-2">Ask me anything</h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  I'm your AI assistant powered by Nexus. I can search the web, analyze data, and answer complex questions.
                </p>
                
                <SearchSuggestions onSelectSuggestion={handleSelectSuggestion} />
              </div>
            ) : (
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
                  onRegenerateMessage={handleRegenerateMessage}
                  onRelatedQuestionClick={handleRelatedQuestionClick}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-border">
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
      
      {showSidebar && (
        <div className="w-80 border-l border-border h-full">
          <SearchSidebar 
            isLoading={searchLoading}
            results={searchResults}
            searchQuery={lastSearchQuery}
            recencyFilter={recencyFilter}
            onRefresh={handleRefreshResults}
            error={searchError}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationalSearch;
