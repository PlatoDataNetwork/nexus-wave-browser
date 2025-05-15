import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle, Shield } from "lucide-react";
import ConversationMessage from './ConversationMessage';
import SearchSuggestions from './SearchSuggestions';
import { SearchAPIResponse, SearchResultItem } from '@/services/searchApi';
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

// Mock functions to replace the missing searchWithSerper and searchWithYou
const searchWithSerper = async (query: string, type: string = "search", safeSearch: boolean = true, resultCount: number = 100): Promise<SearchAPIResponse> => {
  // This is a temporary mock implementation
  console.log(`Searching with Serper: ${query}, type: ${type}, safeSearch: ${safeSearch}, count: ${resultCount}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    results: [
      {
        id: `mock-1`,
        title: `Results for "${query}"`,
        url: "https://example.com",
        description: "This is a placeholder result for your query.",
        type: "web"
      },
      {
        id: `mock-2`,
        title: "Additional information",
        url: "https://example2.com",
        description: "Here's more information related to your search.",
        type: "web"
      }
    ],
    provider: "serper"
  };
};

const searchWithYou = async (query: string, safeSearch: boolean = true, resultCount: number = 100): Promise<SearchAPIResponse> => {
  // This is a temporary mock implementation
  console.log(`Searching with You: ${query}, safeSearch: ${safeSearch}, count: ${resultCount}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    results: [
      {
        id: `mock-you-1`,
        title: `You.com results for "${query}"`,
        url: "https://you.com",
        description: "This is a placeholder You.com result for your query.",
        type: "web"
      }
    ],
    provider: "you"
  };
};

const ConversationalSearch: React.FC<ConversationalSearchProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchProvider, setSearchProvider] = useState<"serper" | "you">("serper");
  const [safeSearch, setSafeSearch] = useState(true);
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
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
    
    if (onSearch) {
      onSearch(currentMessage);
    }
    
    const messageToSearch = currentMessage;
    setCurrentMessage("");
    setIsLoading(true);
    
    try {
      // First fetch search results for the sidebar
      setSearchLoading(true);
      setLastSearchQuery(messageToSearch);
      
      let searchResults: SearchAPIResponse;
      
      if (searchProvider === "serper") {
        searchResults = await searchWithSerper(messageToSearch, "search", safeSearch, 10);
      } else {
        searchResults = await searchWithYou(messageToSearch, safeSearch, 10);
      }
      
      setSearchResults(searchResults.results);
      setSearchLoading(false);
      
      // Generate AI response based on search results
      const aiResponse = generateAIResponse(messageToSearch, searchResults);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Search error:", error);
      toast("Failed to fetch search results. Please try again later.");
      
      // Add a fallback response
      const fallbackResponse: ConversationMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm sorry, but I encountered an issue while searching. Please try again later.",
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

  const generateAIResponse = (query: string, searchResults: SearchAPIResponse): ConversationMessage => {
    // Extract useful information from search results
    const results = searchResults.results;
    
    // Create a response based on the search results
    let responseContent = "";
    let sources: { title: string; url: string }[] = [];
    
    // Add information from organic results
    if (results.length > 0) {
      responseContent = `Based on my search for "${query}", here's what I found:\n\n`;
      
      // Add top 3 results to the response
      results.slice(0, 3).forEach((result, index) => {
        responseContent += `${result.title}: ${result.description}\n\n`;
        
        // Add to sources
        sources.push({
          title: result.title,
          url: result.url
        });
      });
    } else {
      // No results found
      responseContent = `I searched for "${query}" but couldn't find relevant information. Could you try rephrasing your question?`;
    }
    
    // If we still don't have a good response, provide a fallback
    if (!responseContent || responseContent.trim().length === 0) {
      responseContent = `I searched for information about "${query}", but I don't have a comprehensive answer at this moment. You might want to try a different search term or be more specific.`;
    }
    
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: responseContent.trim(),
      timestamp: new Date(),
      sources: sources.length > 0 ? sources : undefined
    };
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
          />
        </div>
      )}
    </div>
  );
};

export default ConversationalSearch;
