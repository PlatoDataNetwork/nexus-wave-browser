import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Shield, Calendar } from "lucide-react";
import ConversationMessage from './ConversationMessage';
import SearchSuggestions from './SearchSuggestions';
import { SearchAPIResponse, SearchResultItem, searchWithYou } from '@/services/searchApi';
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

// Function to get AI response using ChatGPT API
const getChatGPTResponse = async (message: string): Promise<string> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant answering questions for a web browser search interface. Be concise but informative.'
          },
          {
            role: 'user',
            content: message
          }
        ],
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    
    try {
      // First fetch search results for the sidebar from You.com API
      setSearchLoading(true);
      setLastSearchQuery(messageToSearch);
      
      // Pass recency filter to the search API
      const searchResults = await searchWithYou(messageToSearch, safeSearch, 10, recencyFilter);
      setSearchResults(searchResults.results);
      setSearchLoading(false);
      
      // Generate AI response using ChatGPT API
      const aiResponseContent = await getChatGPTResponse(messageToSearch);
      
      // Create sources from search results for citation
      const sources = searchResults.results.slice(0, 3).map(result => ({
        title: result.title,
        url: result.url
      }));
      
      // Add AI response to conversation
      const aiResponse: ConversationMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponseContent,
        timestamp: new Date(),
        sources: sources.length > 0 ? sources : undefined
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Search or AI error:", error);
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
          />
        </div>
      )}
    </div>
  );
};

export default ConversationalSearch;
