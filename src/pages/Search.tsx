import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  Loader2, 
  Search as SearchIcon, 
  Globe, 
  Image, 
  Play, 
  FileText, 
  Clock, 
  Shield, 
  Zap,
  Send,
  MessageCircle,
  Plus,
  ArrowRight
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SearchResult {
  id: string;
  title: string;
  url: string;
  description: string;
  type: "web" | "image" | "video" | "news" | "nexus";
  imageUrl?: string;
}

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

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("web");
  const [searchEngine, setSearchEngine] = useState("platodata");
  const [conversationMode, setConversationMode] = useState(false);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize search query from URL parameters if they exist
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
  }, []);

  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    
    try {
      // This is a mock search function - in a real app, this would call an API
      await mockSearchResults(query);
      
      // Update URL with search query for shareable links
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      window.history.pushState({}, '', url.toString());
      
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSearch = () => {
    if (!currentMessage.trim()) return;
    
    // Add user message to the conversation
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      // Mock AI response based on user query
      const aiResponse = generateAIResponse(currentMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string): ConversationMessage => {
    // This is a mock function to generate AI responses
    // In a real app, this would call an API to get responses from a language model
    
    const responses = [
      `Based on my search, ${query} is a topic with several interesting aspects. Let me break it down for you.`,
      `I found some information about ${query}. According to recent sources, there have been significant developments in this area.`,
      `${query} is trending right now. Here's what I found from reliable sources across the web.`,
      `Looking at the most recent information about ${query}, I can see several key points worth noting.`
    ];
    
    // Sample sources
    const sources = [
      {
        title: `${query} - Official Documentation`,
        url: `https://docs.${query.toLowerCase().replace(/\s+/g, '')}.com`
      },
      {
        title: `Latest Research on ${query}`,
        url: `https://research.nexus.wave/${query.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        title: `${query} Analysis`,
        url: `https://analysis.crypto.com/${query.toLowerCase().replace(/\s+/g, '-')}`
      }
    ];
    
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      sources: sources.slice(0, Math.floor(Math.random() * 3) + 1) // Random number of sources (1-3)
    };
  };

  const mockSearchResults = async (query: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Generate mock results based on query and active tab
    const mockResults: SearchResult[] = [];
    
    if (activeTab === "web" || activeTab === "all") {
      mockResults.push(
        {
          id: "1",
          title: `${query} - Official Website`,
          url: `https://www.${query.toLowerCase().replace(/\s+/g, '')}.com`,
          description: `Welcome to the official website of ${query}. Find all information about ${query} and related products.`,
          type: "web"
        },
        {
          id: "2",
          title: `${query} - Wikipedia`,
          url: `https://en.wikipedia.org/wiki/${query.replace(/\s+/g, '_')}`,
          description: `${query} is a term that refers to multiple topics. This article provides an overview of the most common interpretations and uses.`,
          type: "web"
        },
        {
          id: "3",
          title: `Latest News About ${query} - Crypto News`,
          url: `https://news.crypto.com/topics/${query.toLowerCase().replace(/\s+/g, '-')}`,
          description: `Get the latest updates and news about ${query} in the crypto space. Market trends, analysis, and expert opinions.`,
          type: "web"
        }
      );
    }
    
    if (activeTab === "news" || activeTab === "all") {
      mockResults.push(
        {
          id: "4",
          title: `Breaking: New Development in ${query}`,
          url: `https://news.crypto.com/${query.toLowerCase().replace(/\s+/g, '-')}-breakthrough`,
          description: `A recent breakthrough in ${query} technology is setting new standards in the blockchain industry.`,
          type: "news",
          imageUrl: `https://picsum.photos/seed/${query}1/400/200`
        },
        {
          id: "5",
          title: `${query} Price Analysis: Week in Review`,
          url: `https://market.crypto.com/${query.toLowerCase().replace(/\s+/g, '-')}-analysis`,
          description: `Our experts analyze the recent price movements of ${query} and provide insights on future trends.`,
          type: "news",
          imageUrl: `https://picsum.photos/seed/${query}2/400/200`
        }
      );
    }
    
    if (activeTab === "videos" || activeTab === "all") {
      mockResults.push(
        {
          id: "6",
          title: `How ${query} Is Changing Blockchain - Tutorial`,
          url: `https://video.crypto.com/watch?v=${Math.random().toString(36).substring(2, 10)}`,
          description: `This comprehensive tutorial explains how ${query} is revolutionizing the way we think about blockchain technology.`,
          type: "video",
          imageUrl: `https://picsum.photos/seed/${query}3/400/200`
        },
        {
          id: "7",
          title: `${query} Explained in 5 Minutes`,
          url: `https://video.crypto.com/watch?v=${Math.random().toString(36).substring(2, 10)}`,
          description: `A quick but thorough explanation of ${query} for beginners. Learn the basics in just 5 minutes!`,
          type: "video",
          imageUrl: `https://picsum.photos/seed/${query}4/400/200`
        }
      );
    }
    
    if (activeTab === "nexus" || activeTab === "all") {
      mockResults.push(
        {
          id: "8",
          title: `${query} in the Nexus Ecosystem`,
          url: `https://nexus.wave/ecosystem/${query.toLowerCase().replace(/\s+/g, '-')}`,
          description: `Explore how ${query} integrates with the Nexus ecosystem. Find dApps, tools, and resources specifically designed for ${query}.`,
          type: "nexus",
          imageUrl: `https://picsum.photos/seed/${query}5/400/200`
        },
        {
          id: "9",
          title: `${query} - Nexus Chain Analysis`,
          url: `https://nexus.wave/analytics/${query.toLowerCase().replace(/\s+/g, '-')}`,
          description: `Deep dive into ${query}'s on-chain metrics, transaction volume, and network activity on the Nexus blockchain.`,
          type: "nexus",
          imageUrl: `https://picsum.photos/seed/${query}6/400/200`
        },
        {
          id: "10",
          title: `${query} - Trending on Nexus Wave`,
          url: `https://nexus.wave/trending/${query.toLowerCase().replace(/\s+/g, '-')}`,
          description: `See why ${query} is trending in the Nexus community. Latest discussions, innovations, and developments.`,
          type: "nexus"
        }
      );
    }

    setResults(mockResults);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (searchQuery) {
      handleSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (conversationMode) {
      handleConversationSearch();
    } else {
      handleSearch();
    }
  };

  const renderSearchResult = (result: SearchResult) => {
    switch (result.type) {
      case "web":
        return (
          <Card key={result.id} className="mb-3 hover:shadow-md transition-all bg-card border border-border">
            <CardContent className="p-4">
              <div className="mb-1 text-xs text-muted-foreground">{result.url}</div>
              <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </CardContent>
          </Card>
        );
      
      case "news":
        return (
          <Card key={result.id} className="mb-3 hover:shadow-md transition-all bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {result.imageUrl && (
                  <div className="flex-shrink-0">
                    <img src={result.imageUrl} alt={result.title} className="w-20 h-20 object-cover rounded-md" />
                  </div>
                )}
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">{result.url}</div>
                  <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case "video":
        return (
          <Card key={result.id} className="mb-3 hover:shadow-md transition-all bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {result.imageUrl && (
                  <div className="flex-shrink-0 relative">
                    <img src={result.imageUrl} alt={result.title} className="w-32 h-20 object-cover rounded-md" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-1">
                        <Play className="h-6 w-6 text-white" fill="white" />
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">{result.url}</div>
                  <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case "nexus":
        return (
          <Card key={result.id} className="mb-3 hover:shadow-md transition-all bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {result.imageUrl && (
                  <div className="flex-shrink-0">
                    <img src={result.imageUrl} alt={result.title} className="w-20 h-20 object-cover rounded-md" />
                  </div>
                )}
                <div>
                  <div className="mb-1 text-xs text-muted-foreground flex items-center">
                    {result.url}
                    <span className="ml-2 px-1.5 py-0.5 bg-nexus-purple/20 text-nexus-purple rounded text-[10px] font-medium">
                      NEXUS
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return null;
    }
  };

  const renderConversation = () => (
    <div className="flex flex-col h-full">
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
              
              <div className="mt-6 flex flex-col gap-2 max-w-md mx-auto">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between"
                  onClick={() => setCurrentMessage("What is Blockchain technology?")}
                >
                  <span>What is Blockchain technology?</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between"
                  onClick={() => setCurrentMessage("Explain Bitcoin versus Ethereum")}
                >
                  <span>Explain Bitcoin versus Ethereum</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-between"
                  onClick={() => setCurrentMessage("How does web3 change the internet?")}
                >
                  <span>How does web3 change the internet?</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-lg p-4 ${
                    message.role === "user"
                      ? "bg-nexus-purple text-white"
                      : "bg-secondary border border-border"
                  }`}
                >
                  <p>{message.content}</p>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium mb-1">Sources:</p>
                      <ul className="space-y-1">
                        {message.sources.map((source, index) => (
                          <li key={index} className="text-xs">
                            <a href={source.url} className="text-nexus-purple underline hover:text-nexus-deep-purple">
                              {source.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
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
                handleConversationSearch();
              }
            }}
          />
          <Button type="submit" className="h-full bg-nexus-purple hover:bg-nexus-deep-purple">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border nexus-gradient-bg">
        <div className="flex gap-2 mb-4">
          <Button 
            variant={conversationMode ? "outline" : "default"} 
            className={`${conversationMode ? "" : "bg-nexus-purple hover:bg-nexus-deep-purple"}`}
            onClick={() => setConversationMode(false)}
          >
            <SearchIcon className="h-4 w-4 mr-1" /> Traditional Search
          </Button>
          <Button 
            variant={conversationMode ? "default" : "outline"} 
            className={`${conversationMode ? "bg-nexus-purple hover:bg-nexus-deep-purple" : ""}`}
            onClick={() => setConversationMode(true)}
          >
            <MessageCircle className="h-4 w-4 mr-1" /> AI Assistant
          </Button>
        </div>

        {!conversationMode && (
          <>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="search"
                  placeholder="Search the web securely..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 bg-background"
                />
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button type="submit" className="bg-nexus-purple hover:bg-nexus-deep-purple">
                Search
              </Button>
            </form>

            <div className="flex justify-between mt-4">
              <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="bg-secondary/50">
                  <TabsTrigger value="web" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                    <Globe className="h-4 w-4 mr-1" /> Web
                  </TabsTrigger>
                  <TabsTrigger value="images" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                    <Image className="h-4 w-4 mr-1" /> Images
                  </TabsTrigger>
                  <TabsTrigger value="videos" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                    <Play className="h-4 w-4 mr-1" /> Videos
                  </TabsTrigger>
                  <TabsTrigger value="news" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                    <FileText className="h-4 w-4 mr-1" /> News
                  </TabsTrigger>
                  <TabsTrigger value="nexus" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                    <Zap className="h-4 w-4 mr-1" /> Nexus Search
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Past 24h</span>
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-xs">Safe Search On</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {conversationMode ? (
        renderConversation()
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-40">
                <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
                <p className="text-muted-foreground">Searching securely...</p>
              </div>
            ) : searchQuery && results.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  About {Math.floor(Math.random() * 10000).toLocaleString()} results ({(Math.random() * 0.5 + 0.1).toFixed(2)} seconds)
                </p>
                {results.map(renderSearchResult)}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-muted-foreground">Try different keywords or search terms</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-24 h-24 rounded-full bg-nexus-purple/10 flex items-center justify-center mb-6">
                  <SearchIcon className="h-12 w-12 text-nexus-purple" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Nexus Wave Search</h2>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Search the web with enhanced privacy and security. Your searches are never tracked or stored.
                </p>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>Privacy Features</span>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span>Search Engines</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => setConversationMode(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Try AI Chat</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Search;
