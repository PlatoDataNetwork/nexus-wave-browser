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
  Video,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageResults from "@/components/Search/ImageResults";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import NexusChat from "@/components/Search/NexusChat";
import CategoryGrid from "@/components/Search/CategoryGrid";

// Import updated searchApi functionality
import { searchWithSerper, SearchAPIResponse, SearchResultItem } from '@/services/searchApi';

const Search: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [lastSearchedQuery, setLastSearchedQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [imageResults, setImageResults] = useState<SearchResultItem[]>([]);
  const [videoResults, setVideoResults] = useState<SearchResultItem[]>([]);
  const [newsResults, setNewsResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("web");
  const [knowledgeGraph, setKnowledgeGraph] = useState<any | null>(null);
  const [peopleAlsoAsk, setPeopleAlsoAsk] = useState<any[]>([]);
  const [relatedSearches, setRelatedSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  
  // Safe mode search
  const [safeSearch, setSafeSearch] = useState(true);
  
  useEffect(() => {
    // Initialize search query from URL parameters if they exist
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    const tab = urlParams.get('tab');
    
    if (query) {
      setSearchQuery(query);
      handleSearch(query);
    }
    
    if (tab && ['web', 'images', 'videos', 'news', 'nexus', 'wave'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);
  
  const handleSearch = async (query = searchQuery) => {
    if (!query.trim()) {
      // Clear results when search query is empty
      setResults([]);
      setImageResults([]);
      setVideoResults([]);
      setNewsResults([]);
      setKnowledgeGraph(null);
      setPeopleAlsoAsk([]);
      setRelatedSearches([]);
      setLastSearchedQuery("");
      return;
    }
    
    setIsLoading(true);
    // Update last searched query
    setLastSearchedQuery(query);
    
    try {
      let searchResults: SearchAPIResponse;
      
      // Handle different search types based on active tab
      if (activeTab === "images") {
        // Image search - request 200 images
        searchResults = await searchWithSerper(query, "images", safeSearch, 200);
        setImageResults(searchResults.results || []);
      } else if (activeTab === "videos") {
        // Video search
        searchResults = await searchWithSerper(query, "videos", safeSearch, 100);
        setVideoResults(searchResults.results || []);
      } else if (activeTab === "news") {
        // News search
        searchResults = await searchWithSerper(query, "news", safeSearch, 100);
        setNewsResults(searchResults.results || []);
      } else {
        // Web search (and other types) - request 100 results
        const serperType = activeTab === "web" ? "search" : 
                         activeTab === "news" ? "news" : "search";
        
        searchResults = await searchWithSerper(query, serperType, safeSearch, 100);
        
        // Update state with search results
        setResults(searchResults.results || []);
        setKnowledgeGraph(searchResults.knowledgeGraph || null);
        setPeopleAlsoAsk(searchResults.peopleAlsoAsk || []);
        setRelatedSearches(searchResults.relatedSearches || []);
      }
    } catch (error) {
      toast("Error: Failed to fetch search results");
      setResults([]);
      setImageResults([]);
      setVideoResults([]);
      setNewsResults([]);
      setKnowledgeGraph(null);
      setPeopleAlsoAsk([]);
      setRelatedSearches([]);
      setLastSearchedQuery("");
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

  // Update the handleTabChange function
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL to reflect the tab change
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab);
    window.history.pushState({}, '', url);
    
    if (searchQuery.trim() && tab !== 'wave' && tab !== 'nexus') {
      // If there's text in the search bar, apply search when switching tabs
      handleSearch();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); 
    e.stopPropagation();
    handleSearch();
  };

  // Handle search input change
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    
    // If search box is cleared, reset results
    if (!newQuery.trim() && lastSearchedQuery) {
      setResults([]);
      setImageResults([]);
      setVideoResults([]);
      setNewsResults([]);
      setKnowledgeGraph(null);
      setPeopleAlsoAsk([]);
      setRelatedSearches([]);
    }
  };

  // Render Search Result component
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
                  <div className="text-xs text-muted-foreground mt-1">
                    {result.source && <span className="font-medium mr-2">{result.source}</span>}
                    {result.date && <span>{result.date}</span>}
                  </div>
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
                  alt={knowledgeGraph.title || 'Knowledge Graph'}
                  className="w-32 h-32 md:w-48 md:h-48 object-cover rounded-md"
                />
              </div>
            )}
            <div className="flex-grow">
              <h2 className="text-xl font-bold">{knowledgeGraph.title || 'Information'}</h2>
              <div className="text-sm text-muted-foreground mb-2">{knowledgeGraph.type || ''}</div>
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
                      <span className="font-medium">{key}:</span> {String(value)}
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
      {/* Top navigation bar similar to the home screen */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
        <div className="container flex h-16 max-w-screen-2xl items-center">
          {/* Logo and Brand */}
          <div className="mr-4 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" 
                  alt="Nexus Wave Logo" 
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="hidden text-xl font-bold text-white sm:inline-block">
                Nexus Wave
              </span>
            </Link>
          </div>
          
          {/* Main Navigation */}
          <nav className="flex-1">
            <ul className="flex gap-1 md:gap-2">
              <li>
                <Link to="/search">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="text-white"
                  >
                    <SearchIcon className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/app">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                  >
                    <Globe className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Browser</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/token">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                  >
                    <Zap className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Token</span>
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/staking">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                  >
                    <Image className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Staking</span>
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
              >
                Signup
              </Button>
            </Link>
            <Link to="/downloads">
              <Button variant="macos" size="sm">
                Download
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Search interface */}
      <div className="p-4 border-b border-border nexus-gradient-bg">
        <form 
          onSubmit={handleSubmit}
          className="flex gap-2"
        >
          <div className="flex-1 relative">
            <Input
              type="search"
              placeholder="Search the web securely..."
              value={searchQuery}
              onChange={handleSearchInputChange}
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

        {/* Tabs and search controls */}
        <div className="flex items-center justify-between mt-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="web" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Globe className="h-4 w-4 mr-1" /> Web
                </TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Image className="h-4 w-4 mr-1" /> Images
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Video className="h-4 w-4 mr-1" /> Videos
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-1" /> News
                </TabsTrigger>
                <TabsTrigger value="nexus" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Zap className="h-4 w-4 mr-1" /> Nexus Search
                </TabsTrigger>
                <TabsTrigger value="wave" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Sparkles className="h-4 w-4 mr-1" /> Nexus Wave
                </TabsTrigger>
              </TabsList>
              
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
            
            {/* Tab content sections */}
            <TabsContent value="web">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-nexus-purple" />
                  </div>
                ) : lastSearchedQuery ? (
                  <div>
                    {/* Knowledge Graph */}
                    {knowledgeGraph && renderKnowledgeGraph()}
                    
                    {/* Search Results */}
                    <div className="space-y-1">
                      {results.length > 0 ? (
                        results.map((result) => renderSearchResult(result))
                      ) : (
                        <div className="text-center py-6">
                          <p className="text-muted-foreground">No results found for "{lastSearchedQuery}"</p>
                        </div>
                      )}
                    </div>
                    
                    {/* People Also Ask */}
                    {peopleAlsoAsk.length > 0 && renderPeopleAlsoAsk()}
                    
                    {/* Related Searches */}
                    {relatedSearches.length > 0 && renderRelatedSearches()}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Globe className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Search the web securely</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a search term above to get started
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="images">
              <ImageResults 
                isLoading={isLoading} 
                results={imageResults} 
                searchQuery={lastSearchedQuery}
              />
            </TabsContent>
            
            <TabsContent value="videos">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-nexus-purple" />
                  </div>
                ) : lastSearchedQuery ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                    {videoResults.length > 0 ? (
                      videoResults.map((result) => (
                        <Card key={result.id} className="overflow-hidden hover:shadow-md transition-all">
                          <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
                            <div className="relative aspect-video">
                              {result.imageUrl ? (
                                <>
                                  <img 
                                    src={result.imageUrl} 
                                    alt={result.title} 
                                    className="w-full h-full object-cover" 
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-black bg-opacity-20 rounded-full p-2">
                                      <Play className="h-8 w-8 text-white" fill="white" />
                                    </div>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Video className="h-10 w-10 text-muted-foreground/50" />
                                </div>
                              )}
                              {result.duration && (
                                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-1 py-0.5 rounded text-xs text-white">
                                  {result.duration}
                                </div>
                              )}
                            </div>
                          </a>
                          <CardContent className="p-3">
                            <a 
                              href={result.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="block truncate font-medium hover:text-nexus-purple"
                            >
                              {result.title}
                            </a>
                            <div className="text-xs text-muted-foreground truncate mt-1">
                              {result.source || result.url.replace(/^https?:\/\//, '').split('/')[0]}
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-6">
                        <p className="text-muted-foreground">No video results found for "{lastSearchedQuery}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Video className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Search for videos</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a search term above to get started
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="news">
              <ScrollArea className="h-full">
                {isLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-nexus-purple" />
                  </div>
                ) : lastSearchedQuery ? (
                  <div className="space-y-1">
                    {newsResults.length > 0 ? (
                      newsResults.map((result) => (
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
                                <div className="text-xs text-muted-foreground mt-1">
                                  {result.source && <span className="font-medium mr-2">{result.source}</span>}
                                  {result.date && <span>{result.date}</span>}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground">No news results found for "{lastSearchedQuery}"</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <FileText className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">Search for news</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Enter a search term above to get started
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="nexus" className="h-full flex flex-col">
              <NexusChat onSearch={(query) => {
                setSearchQuery(query);
                if (!lastSearchedQuery) {
                  setLastSearchedQuery(query);
                }
              }} />
            </TabsContent>
            
            <TabsContent value="wave" className="h-full">
              <ScrollArea className="h-full">
                <CategoryGrid />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Search;
