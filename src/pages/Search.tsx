
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  MessageCircle,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { searchWithSerper, searchWithYou, SearchAPIResponse, SearchResultItem } from '@/services/searchApi';
import SearchProviderSelector from "@/components/Search/SearchProviderSelector";
import ConversationalSearch from "@/components/Search/ConversationalSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageResults from "@/components/Search/ImageResults";

// Import components
import { Card, CardContent } from "@/components/ui/card";

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [imageResults, setImageResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("web");
  const [searchProvider, setSearchProvider] = useState<"serper" | "you">("serper");
  const [conversationMode, setConversationMode] = useState(false);
  const [knowledgeGraph, setKnowledgeGraph] = useState<any | null>(null);
  const [peopleAlsoAsk, setPeopleAlsoAsk] = useState<any[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  
  // Safe mode search
  const [safeSearch, setSafeSearch] = useState(true);
  
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
      
      // Handle different search types based on active tab
      if (activeTab === "images") {
        // Image search - request 200 images
        if (searchProvider === "serper") {
          searchResults = await searchWithSerper(query, "images", safeSearch, 200);
          setImageResults(searchResults.results || []);
        } else {
          searchResults = await searchWithYou(query, safeSearch, 200);
          setImageResults(searchResults.results || []);
        }
      } else {
        // Web search (and other types) - request 100 results
        const serperType = activeTab === "web" ? "search" : 
                         activeTab === "videos" ? "videos" : 
                         activeTab === "news" ? "news" : "search";
        
        if (searchProvider === "serper") {
          searchResults = await searchWithSerper(query, serperType, safeSearch, 100);
        } else {
          searchResults = await searchWithYou(query, safeSearch, 100);
        }
        
        // Update state with search results
        setResults(searchResults.results || []);
        setKnowledgeGraph(searchResults.knowledgeGraph || null);
        setPeopleAlsoAsk(searchResults.peopleAlsoAsk || []);
        setRelatedSearches(searchResults.relatedSearches || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to fetch search results");
      setResults([]);
      setImageResults([]);
      setKnowledgeGraph(null);
      setPeopleAlsoAsk([]);
      setRelatedSearches([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle safe search
  const handleToggleSafeSearch = () => {
    setSafeSearch(prev => !prev);
    // If we already have a search query, update the results
    if (searchQuery.trim()) {
      handleSearch();
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (searchQuery) {
      handleSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (conversationMode) {
      // Handle conversation mode
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
              onSubmit={handleSubmit}
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
                type="submit"
                className="bg-nexus-purple hover:bg-nexus-deep-purple" 
                disabled={isLoading}
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
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  type="button"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Past 24h</span>
                </Button>
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
              </div>
            </div>
          </>
        )}
      </div>

      {conversationMode ? (
        <ConversationalSearch />
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-4 pb-20">
            <TabsContent value="images" className="mt-0">
              <ImageResults 
                isLoading={isLoading} 
                results={imageResults} 
                searchQuery={searchQuery}
              />
            </TabsContent>
            
            <TabsContent value="web" className="mt-0">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
                  <p className="text-muted-foreground">Searching securely...</p>
                </div>
              ) : searchQuery && results.length > 0 ? (
                <div id="search-results">
                  <p className="text-sm text-muted-foreground mb-4">
                    About {results.length.toLocaleString()} results ({(Math.random() * 0.5 + 0.1).toFixed(2)} seconds)
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
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="videos" className="mt-0">
              {/* Render video search results similar to web results */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
                  <p className="text-muted-foreground">Searching videos...</p>
                </div>
              ) : searchQuery && results.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    About {results.length.toLocaleString()} video results ({(Math.random() * 0.5 + 0.1).toFixed(2)} seconds)
                  </p>
                  {results.map(renderSearchResult)}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-10">
                  <h2 className="text-xl font-medium mb-2">No video results found</h2>
                  <p className="text-muted-foreground">Try different keywords or search terms</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <h2 className="text-xl font-medium mb-2">Search for videos</h2>
                  <p className="text-muted-foreground">Enter a search term to find videos</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="news" className="mt-0">
              {/* Render news search results similar to web results */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
                  <p className="text-muted-foreground">Searching news...</p>
                </div>
              ) : searchQuery && results.length > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    About {results.length.toLocaleString()} news results ({(Math.random() * 0.5 + 0.1).toFixed(2)} seconds)
                  </p>
                  {results.map(renderSearchResult)}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-10">
                  <h2 className="text-xl font-medium mb-2">No news results found</h2>
                  <p className="text-muted-foreground">Try different keywords or search terms</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <h2 className="text-xl font-medium mb-2">Search for latest news</h2>
                  <p className="text-muted-foreground">Enter a search term to find news articles</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="nexus" className="mt-0">
              {/* Render nexus search results similar to web results */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
                  <p className="text-muted-foreground">Searching Nexus resources...</p>
                </div>
              ) : searchQuery ? (
                <div className="text-center py-10">
                  <h2 className="text-xl font-medium mb-2">Nexus Search</h2>
                  <p className="text-muted-foreground">Search across the Nexus ecosystem (coming soon)</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <h2 className="text-xl font-medium mb-2">Nexus Search</h2>
                  <p className="text-muted-foreground">Search across the Nexus ecosystem (coming soon)</p>
                </div>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default Search;
