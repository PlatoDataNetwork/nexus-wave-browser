import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Shield, Calendar, AlertCircle, Clock } from "lucide-react";
import ConversationMessage from './ConversationMessage';
import SearchSuggestions from './SearchSuggestions';
import { SearchAPIResponse, SearchResultItem, searchWithYou } from '@/services/searchApi';
import { getRealTimeData } from '@/services/scrapingService';
import { toast } from "sonner";
import SearchProviderSelector from './SearchProviderSelector';
import SearchSidebar from './SearchSidebar';

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

// OpenAI API key
const OPENAI_API_KEY = "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";

// Function to get AI response using ChatGPT API with conversation history
const getChatGPTResponse = async (
  message: string, 
  conversationHistory: { role: "user" | "assistant"; content: string }[],
  realTimeData?: string
): Promise<string> => {
  try {
    let systemPrompt = 'You are a helpful assistant answering questions for a web browser search interface. Be concise but informative. When asked about real-time data like current events, news, weather, or financial information, acknowledge that your information may not be up-to-date and suggest reliable sources.';
    
    // If we have real-time data, enhance the system prompt
    if (realTimeData) {
      systemPrompt = `You are a helpful assistant with access to real-time information. Use the following real-time data to enhance your response, and cite it as your source: ${realTimeData}`;
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
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    throw error;
  }
};

// Function to simulate real-time data when API fails
const getSimulatedRealTimeData = (query: string): SearchResultItem[] => {
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString();
  const timeStr = currentDate.toLocaleTimeString();
  
  return [
    {
      id: "simulated-1",
      title: `Real-time data for "${query}" (simulated)`,
      url: "https://example.com/real-time-data",
      description: `This is simulated real-time data for "${query}" as of ${dateStr} at ${timeStr}. API connection failed, so we're providing this placeholder data.`,
      type: "web"
    },
    {
      id: "simulated-2",
      title: "Try alternative sources for real-time information",
      url: "https://news.google.com",
      description: "For the most current information on this topic, consider checking specialized news sites, financial portals, or official sources relevant to your query.",
      type: "web"
    },
    {
      id: "simulated-3",
      title: "Check back for real-time updates",
      url: "#",
      description: "Our real-time data services are temporarily unavailable. Try refreshing in a few moments to get the latest information.",
      type: "web"
    }
  ];
};

const ConversationalSearch: React.FC<ConversationalSearchProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchProvider, setSearchProvider] = useState<"serper" | "you">("you");
  const [safeSearch, setSafeSearch] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [recencyFilter, setRecencyFilter] = useState<"day" | "week" | "month" | "any">("day");
  const [searchError, setSearchError] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Add state for real-time data
  const [realTimeData, setRealTimeData] = useState<{
    summary: string;
    source: string;
    timestamp: Date;
  } | null>(null);
  const [isLoadingRealTimeData, setIsLoadingRealTimeData] = useState(false);
  
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
    setRealTimeData(null);
    
    try {
      // 1. FIRST: Fetch search results for the sidebar from You.com API
      setSearchLoading(true);
      setLastSearchQuery(messageToSearch);
      
      let searchResults;
      try {
        // Try to get search results with recency filter
        console.log(`Fetching search results from You.com for "${messageToSearch}" with filter: ${recencyFilter}`);
        searchResults = await searchWithYou(messageToSearch, safeSearch, 10, recencyFilter);
        setSearchResults(searchResults.results);
        setSearchError("");
      } catch (error) {
        console.error("Search API error:", error);
        // If API fails, use simulated data and set error
        const simulatedResults = getSimulatedRealTimeData(messageToSearch);
        setSearchResults(simulatedResults);
        setSearchError("Couldn't fetch search results from search API");
        toast("Search API unavailable", {
          description: "Using alternative sources. Try using the real-time data feature."
        });
      }
      setSearchLoading(false);
      
      // 2. Check if the query is likely about real-time data
      const isRealTimeQuery = 
        messageToSearch.toLowerCase().includes('weather') ||
        messageToSearch.toLowerCase().includes('news') ||
        messageToSearch.toLowerCase().includes('price') ||
        messageToSearch.toLowerCase().includes('stock') ||
        messageToSearch.toLowerCase().includes('current') ||
        messageToSearch.toLowerCase().includes('today') ||
        messageToSearch.toLowerCase().includes('latest') ||
        messageToSearch.toLowerCase().includes('update') ||
        messageToSearch.toLowerCase().includes('now') ||
        messageToSearch.toLowerCase().includes('exchange rate') ||
        messageToSearch.toLowerCase().includes('live');
      
      // Update conversation history with the new user message
      const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageToSearch }];
      
      let aiResponseContent;
      
      // 3. If it's a real-time query, try to get real-time data
      if (isRealTimeQuery) {
        try {
          setIsLoadingRealTimeData(true);
          const realtimeInfo = await getRealTimeData(messageToSearch, OPENAI_API_KEY);
          setRealTimeData(realtimeInfo);
          
          // Generate AI response using ChatGPT API with conversation history and real-time data
          aiResponseContent = await getChatGPTResponse(
            messageToSearch, 
            updatedHistory.slice(0, -1), // Exclude current message as it's passed separately
            realtimeInfo.summary
          );
          
          toast("Real-time data retrieved", {
            description: "Using freshly scraped information from the web"
          });
        } catch (error) {
          console.error("Error fetching real-time data:", error);
          // Just continue with normal response if real-time data fails
          aiResponseContent = await getChatGPTResponse(
            messageToSearch, 
            updatedHistory.slice(0, -1) // Exclude current message as it's passed separately
          );
        } finally {
          setIsLoadingRealTimeData(false);
        }
      } else {
        // Generate standard AI response using ChatGPT API with conversation history
        aiResponseContent = await getChatGPTResponse(
          messageToSearch, 
          updatedHistory.slice(0, -1) // Exclude current message as it's passed separately
        );
      }
      
      // 4. Update conversation history with assistant response
      setConversationHistory([
        ...updatedHistory,
        { role: "assistant" as const, content: aiResponseContent }
      ]);
      
      // Create sources from search results for citation
      let sources = [];
      if (searchResults && searchResults.results && searchResults.results.length > 0) {
        sources = searchResults.results.slice(0, 3).map(result => ({
          title: result.title,
          url: result.url
        }));
      } else if (searchResults && Array.isArray(searchResults)) {
        sources = searchResults.slice(0, 3).map(result => ({
          title: result.title,
          url: result.url
        }));
      }
      
      // If we have real-time data, add it as a source
      if (realTimeData) {
        sources.unshift({
          title: "Real-time data from " + realTimeData.source.replace(/https?:\/\/(www\.)?/, ''),
          url: realTimeData.source
        });
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
    } catch (error) {
      console.error("AI error:", error);
      toast("Failed to fetch response. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ConversationMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while processing your request. For real-time information, please try again later or visit specialized websites for the topic you're interested in.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to fetch real-time data on demand
  const handleFetchRealTimeData = async () => {
    if (!lastSearchQuery) return;
    
    setIsLoadingRealTimeData(true);
    toast("Fetching real-time data...");
    
    try {
      const realtimeInfo = await getRealTimeData(lastSearchQuery, OPENAI_API_KEY);
      setRealTimeData(realtimeInfo);
      
      toast("Real-time data retrieved", {
        description: `Fresh information from ${realtimeInfo.source.replace(/https?:\/\/(www\.)?/, '')}`
      });
    } catch (error) {
      console.error("Error fetching real-time data:", error);
      toast("Could not fetch real-time data", {
        description: "Please try again later"
      });
    } finally {
      setIsLoadingRealTimeData(false);
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
      const searchResults = await searchWithYou(lastSearchQuery, safeSearch, 10, recencyFilter);
      setSearchResults(searchResults.results);
      toast("Data refreshed with latest information", {
        description: `Results from ${recencyFilter === "day" ? "the past 24 hours" : recencyFilter === "week" ? "the past week" : recencyFilter === "month" ? "the past month" : "all time"}`
      });
      setSearchError("");
    } catch (error) {
      console.error("Error refreshing search:", error);
      const simulatedResults = getSimulatedRealTimeData(lastSearchQuery);
      setSearchResults(simulatedResults);
      setSearchError("Search data connection failed");
      toast("Search data unavailable", {
        description: "Using alternative sources. Try again later."
      });
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col h-full">
        <div className="flex justify-between p-2 border-b border-border">
          <SearchProviderSelector 
            selectedProvider={searchProvider}
            onSelectProvider={setSearchProvider}
          />
          
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleSidebar}
              className="text-muted-foreground"
            >
              {showSidebar ? "Hide Results" : "Show Results"}
            </Button>
          </div>
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
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit(e);
            }} 
            className="flex gap-2"
          >
            <Textarea
              placeholder="Ask me anything..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="flex-1 min-h-12 resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  e.stopPropagation();
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
            realTimeData={realTimeData}
            isLoadingRealTimeData={isLoadingRealTimeData}
            onFetchRealTimeData={handleFetchRealTimeData}
          />
        </div>
      )}
    </div>
  );
};

export default ConversationalSearch;
