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
import { getChatGPTResponse } from '@/utils/openai';

// OpenAI API key
const OPENAI_API_KEY = "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";

// You.com API key
const YOU_API_KEY = "b4a7675d-d49a-4a31-a3ce-2dbf61cb935e<__>1P6A8vETU8N2v5f4IL9xcte2";

// Function to get search results from You.com API
const getSearchResults = async (
  query: string,
  safeSearch: boolean = true,
  recencyFilter: "day" | "week" | "month" | "any" = "day"
): Promise<SearchResultItem[]> => {
  try {
    // Add parameters to query URL
    let queryParams = new URLSearchParams();
    queryParams.append("query", query);
    
    // Add safe search parameter if enabled
    if (safeSearch) {
      queryParams.append("safesearch", "on");
    }
    
    // Add recency parameter based on filter
    if (recencyFilter !== "any") {
      queryParams.append("freshness", recencyFilter);
    }
    
    // Add count parameter - request 10 results
    queryParams.append("num_web_results", "10");
    
    const endpoint = `https://api.ydc-index.io/search?${queryParams.toString()}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-API-Key': YOU_API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`You.com API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the response to our common format
    const results: SearchResultItem[] = data.hits.map((item: any, index: number) => ({
      id: `you-${index}`,
      title: item.title,
      url: item.url,
      description: item.description,
      type: "web",
      imageUrl: item.thumbnail_url,
      snippets: item.snippets
    }));

    return results;
  } catch (error) {
    console.error("Error searching with You.com:", error);
    throw error;
  }
};

// Optimized ChatGPT response function with performance enhancements
const getChatGPTResponseOptimized = async (
  message: string, 
  conversationHistory: { role: "user" | "assistant"; content: string }[]
): Promise<string> => {
  console.time('chatgpt-response');
  try {
    // Use our optimized function from openai.ts
    const response = await getChatGPTResponse(message, conversationHistory);
    console.timeEnd('chatgpt-response');
    return response;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    console.timeEnd('chatgpt-response');
    throw error;
  }
};

interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // State to maintain conversation history for GPT
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);

  // State to track if we're using cached results
  const [usingCachedResults, setUsingCachedResults] = useState(false);
  
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
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Call onSearch without updating URL - just inform parent component
    if (onSearch) {
      // Don't update URL, just call the callback
      onSearch(currentMessage);
    }
    
    const messageToSearch = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    setSearchError("");
    
    // Start performance timing
    const startTime = performance.now();
    
    try {
      // 1. Fetch search results for the sidebar from You.com API
      setSearchLoading(true);
      setLastSearchQuery(messageToSearch);
      setUsingCachedResults(false);
      
      try {
        // Try to get search results with recency filter
        console.log(`Fetching search results from You.com for "${messageToSearch}" with filter: ${recencyFilter}`);
        const results = await getSearchResults(messageToSearch, safeSearch, recencyFilter);
        setSearchResults(results);
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
        setSearchError("Couldn't fetch search results from You.com API");
        toast("Search API unavailable");
      }
      setSearchLoading(false);
      
      // 2. Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      // Use a loading toast to show activity while waiting for AI response
      const loadingToast = toast.loading("Generating AI response...");
      
      // 3. Generate AI response using ChatGPT API with conversation history
      const aiResponseContent = await getChatGPTResponseOptimized(
        messageToSearch, 
        updatedHistory.slice(0, -1) // Exclude current message as it's passed separately
      );
      
      // Dismiss the loading toast
      toast.dismiss(loadingToast);
      
      // 4. Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: aiResponseContent }
      ]);
      
      // Create sources from search results for citation
      let sources = [];
      if (searchResults && searchResults.length > 0) {
        sources = searchResults.slice(0, 3).map(result => ({
          title: result.title,
          url: result.url
        }));
      }
      
      // Add AI response to conversation UI
      const aiResponse: ConversationMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      // Calculate and show total response time
      const totalTime = performance.now() - startTime;
      console.log(`Total response time: ${totalTime.toFixed(0)}ms`);
      
      // Show a toast with the response time if it's fast
      if (totalTime < 3000) {
        toast(`Response generated in ${(totalTime/1000).toFixed(1)}s`, {
          icon: <Zap className="h-4 w-4 text-green-500" />,
          duration: 1500
        });
      }
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ConversationMessage = {
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
      console.log(`Refreshing search results for "${lastSearchQuery}" with filter: ${recencyFilter}`);
      const results = await getSearchResults(lastSearchQuery, safeSearch, recencyFilter);
      setSearchResults(results);
      toast("Data refreshed with latest information");
      setSearchError("");
    } catch (error) {
      console.error("Error refreshing search:", error);
      setSearchResults([]);
      setSearchError("Search data connection failed");
      toast("Search data unavailable");
    } finally {
      setSearchLoading(false);
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
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
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
            />
            <Button 
              type="submit" 
              className="h-full bg-nexus-purple hover:bg-nexus-deep-purple"
              disabled={isLoading}
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
