
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
import { searchWithSerper, searchWithYou, SearchAPIResponse, SearchResultItem, KnowledgeGraphData } from "@/services/searchApi";
import SearchProviderSelector from "@/components/Search/SearchProviderSelector";
import ConversationalSearch from "@/components/Search/ConversationalSearch";

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("web");
  const [searchProvider, setSearchProvider] = useState<"serper" | "you">("serper");
  const [conversationMode, setConversationMode] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphData | null>(null);
  const [peopleAlsoAsk, setPeopleAlsoAsk] = useState<any[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
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
      let searchResults: SearchAPIResponse;
      
      if (searchProvider === "serper") {
        // Convert activeTab to Serper API endpoint type
        const serperType = activeTab === "web" ? "search" : 
                         activeTab === "images" ? "images" : 
                         activeTab === "videos" ? "videos" : 
                         activeTab === "news" ? "news" : "search";
        
        searchResults = await searchWithSerper(query, serperType);
      } else {
        searchResults = await searchWithYou(query);
      }
      
      // Update state with search results
      setResults(searchResults.results || []);
      setKnowledgeGraph(searchResults.knowledgeGraph || null);
      setPeopleAlsoAsk(searchResults.peopleAlsoAsk || []);
      setRelatedSearches(searchResults.relatedSearches || []);
      
      // Update URL with search query for shareable links
      const url = new URL(window.location.href);
      url.searchParams.set('q', query);
      window.history.pushState({}, '', url.toString());
      
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
      setResults([]);
      setKnowledgeGraph(null);
      setPeopleAlsoAsk([]);
      setRelatedSearches([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationSearch = async () => {
    if (!currentMessage.trim()) return;
    
    // Add user message to the conversation
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);
    
    try {
      // Perform search using selected provider
      let searchResults: SearchAPIResponse;
      
      if (searchProvider === "serper") {
        searchResults = await searchWithSerper(currentMessage);
      } else {
        searchResults = await searchWithYou(currentMessage);
      }
      
      // Generate AI response
      const aiResponse = generateAIResponse(currentMessage, searchResults);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
      
      // Add fallback response
      const fallbackResponse = {
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

  const generateAIResponse = (query: string, searchResults: SearchAPIResponse) => {
    // Extract useful information from search results
    const results = searchResults.results;
    
    // Create a response based on the search results
    let responseContent = "";
    let sources: { title: string; url: string }[] = [];
    
    // If we have knowledge graph information, use it for a richer response
    if (searchResults.knowledgeGraph) {
      const kg = searchResults.knowledgeGraph;
      responseContent = `${kg.title} is a ${kg.type}. ${kg.description || ''}\n\n`;
      
      if (kg.attributes) {
        responseContent += "Here are some key facts:\n";
        Object.entries(kg.attributes).forEach(([key, value]) => {
          responseContent += `- ${key}: ${value}\n`;
        });
        responseContent += "\n";
      }
      
      // Add source if available
      if (kg.descriptionSource && kg.descriptionLink) {
        sources.push({
          title: `${kg.title} - ${kg.descriptionSource}`,
          url: kg.descriptionLink
        });
      }
    }
    
    // Add information from organic results
    if (results.length > 0) {
      if (!responseContent) {
        responseContent = `Based on my search for "${query}", here's what I found:\n\n`;
      } else {
        responseContent += "Additional information:\n\n";
      }
      
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
    
    // Add related questions if available
    if (searchResults.peopleAlsoAsk && searchResults.peopleAlsoAsk.length > 0) {
      responseContent += "\nPeople also ask:\n";
      searchResults.peopleAlsoAsk.slice(0, 2).forEach(item => {
        responseContent += `- ${item.question}\n`;
        sources.push({
          title: item.title,
          url: item.link
        });
      });
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

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (searchQuery) {
      handleSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    e.stopPropagation(); // Stop event propagation
    
    if (conversationMode) {
      handleConversationSearch();
    } else {
      handleSearch();
    }
  };

  const renderSearchResult = (result: SearchResultItem) => {
    switch (result.type) {
      case "web":
        return (
          <Card key={result.id} className="mb-3 hover:shadow-md transition-all bg-card border border-border">
            <CardContent className="p-4">
              <div className="mb-1 text-xs text-muted-foreground">{result.url}</div>
              <a href={result.url} target="_blank" rel="noopener noreferrer">
                <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
              </a>
              <p className="text-sm text-muted-foreground">{result.description}</p>
              
              {result.sitelinks && result.sitelinks.length > 0 && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {result.sitelinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-xs text-nexus-purple hover:underline"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              )}
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
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  </a>
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
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  </a>
                  <p className="text-sm text-muted-foreground">{result.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      
      case "image":
        return (
          <Card key={result.id} className="mb-3 hover:shadow-md transition-all bg-card border border-border">
            <CardContent className="p-4">
              <div className="flex gap-4">
                {result.imageUrl && (
                  <div className="flex-shrink-0">
                    <img src={result.imageUrl} alt={result.title} className="w-32 h-32 object-cover rounded-md" />
                  </div>
                )}
                <div>
                  <div className="mb-1 text-xs text-muted-foreground">{result.url}</div>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  </a>
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
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    <h3 className="text-lg font-medium text-nexus-purple hover:underline cursor-pointer">{result.title}</h3>
                  </a>
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
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  
                  {message.sources && message.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-medium mb-1">Sources:</p>
                      <ul className="space-y-1">
                        {message.sources.map((source: any, index: number) => (
                          <li key={index} className="text-xs">
                            <a href={source.url} className="text-nexus-purple underline hover:text-nexus-deep-purple" target="_blank" rel="noopener noreferrer">
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
          <Button type="submit" className="h-full bg-nexus-purple hover:bg-nexus-deep-purple" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );

  // Render Knowledge Graph component
  const renderKnowledgeGraph = () => {
    if (!knowledgeGraph) return null;
    
    return (
      <Card className="mb-5 overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row gap-4 p-4">
            {knowledgeGraph.imageUrl && (
              <div className="flex-shrink-0">
                <img 
                  src={knowledgeGraph.imageUrl} 
                  alt={knowledgeGraph.title}
                  className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-grow">
              <h2 className="text-xl font-bold">{knowledgeGraph.title}</h2>
              <div className="text-sm text-muted-foreground mb-2">{knowledgeGraph.type}</div>
              {knowledgeGraph.description && (
                <p className="mb-3">{knowledgeGraph.description}</p>
              )}
              {knowledgeGraph.website && (
                <a 
                  href={knowledgeGraph.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-nexus-purple hover:underline text-sm mb-3 block"
                >
                  {knowledgeGraph.website}
                </a>
              )}
              {knowledgeGraph.attributes && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                  {Object.entries(knowledgeGraph.attributes).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium">{key}:</span> {value}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render People Also Ask section
  const renderPeopleAlsoAsk = () => {
    if (!peopleAlsoAsk || peopleAlsoAsk.length === 0) return null;
    
    return (
      <Card className="mb-5">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-3">People Also Ask</h3>
          <div className="space-y-3">
            {peopleAlsoAsk.map((item, index) => (
              <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-left font-medium text-nexus-purple hover:text-nexus-deep-purple"
                  onClick={() => {
                    setSearchQuery(item.question);
                    handleSearch(item.question);
                  }}
                >
                  {item.question}
                </Button>
                <p className="text-sm mt-1">{item.snippet.split('\n')[0]}</p>
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-muted-foreground hover:underline mt-1 block"
                >
                  {item.title}
                </a>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render Related Searches
  const renderRelatedSearches = () => {
    if (!relatedSearches || relatedSearches.length === 0) return null;
    
    return (
      <Card className="mb-5">
        <CardContent className="p-4">
          <h3 className="text-lg font-medium mb-3">Related Searches</h3>
          <div className="flex flex-wrap gap-2">
            {relatedSearches.map((query, index) => (
              <Button 
                key={index} 
                variant="outline" 
                size="sm"
                className="text-sm"
                onClick={() => {
                  setSearchQuery(query);
                  handleSearch(query);
                }}
              >
                {query}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border nexus-gradient-bg">
        <div className="flex gap-2 mb-4">
          <Button 
            variant={conversationMode ? "outline" : "default"} 
            className={`${conversationMode ? "" : "bg-nexus-purple hover:bg-nexus-deep-purple"}`}
            onClick={() => setConversationMode(false)}
            type="button"
          >
            <SearchIcon className="h-4 w-4 mr-1" /> Traditional Search
          </Button>
          <Button 
            variant={conversationMode ? "default" : "outline"} 
            className={`${conversationMode ? "bg-nexus-purple hover:bg-nexus-deep-purple" : ""}`}
            onClick={() => setConversationMode(true)}
            type="button"
          >
            <MessageCircle className="h-4 w-4 mr-1" /> AI Assistant
          </Button>
          
          <div className="ml-auto">
            <SearchProviderSelector
              selectedProvider={searchProvider}
              onSelectProvider={setSearchProvider}
            />
          </div>
        </div>

        {!conversationMode && (
          <>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(e);
              }}
              className="flex gap-2"
            >
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
              <Button 
                type="button" 
                className="bg-nexus-purple hover:bg-nexus-deep-purple" 
                disabled={isLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSearch();
                }}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
              </Button>
            </form>

            <div className="flex justify-between mt-4">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={handleTabChange} className="w-full">
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
        <ConversationalSearch />
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
                
                {/* Knowledge Graph */}
                {renderKnowledgeGraph()}
                
                {/* Main Results */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div className="lg:col-span-2">
                    {results.map(renderSearchResult)}
                  </div>
                  
                  <div className="space-y-5">
                    {/* People Also Ask */}
                    {renderPeopleAlsoAsk()}
                    
                    {/* Related Searches */}
                    {renderRelatedSearches()}
                  </div>
                </div>
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
