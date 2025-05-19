
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Globe, AlertCircle } from "lucide-react";
import { searchWithSerper } from '@/services/searchApi';
import { ChatMessage } from '@/types';
import { useToast } from "@/hooks/use-toast";

interface WebSearchSidebarProps {
  currentQuery: string;
  conversations: ChatMessage[];
  onClose: () => void;
}

const WebSearchSidebar: React.FC<WebSearchSidebarProps> = ({ 
  currentQuery, 
  conversations,
  onClose
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const INITIAL_PAGE_SIZE = 30;
  const ADDITIONAL_PAGE_SIZE = 10;

  // Build context-aware search query based on conversation history
  const buildContextualQuery = () => {
    // Start with the current query
    if (!currentQuery) return '';
    
    // Get the last 2 user messages for context (excluding the current one)
    const recentUserMessages = conversations
      .filter(msg => msg.role === "user")
      .slice(-3, -1)
      .map(msg => msg.content);
      
    // If we have context, enhance the query
    if (recentUserMessages.length > 0) {
      // Extract key topics/entities from the conversation
      const keyTerms = recentUserMessages.join(' ')
        .split(' ')
        .filter(word => 
          word.length > 3 && 
          !['what', 'when', 'where', 'which', 'who', 'how', 'why', 'can', 'will', 'should', 'would', 'could', 'the', 'and', 'for', 'that'].includes(word.toLowerCase())
        )
        .slice(0, 5)
        .join(' ');
        
      // Combine current query with context
      return `${currentQuery} ${keyTerms ? `context: ${keyTerms}` : ''}`.trim();
    }
    
    return currentQuery;
  };

  // Fetch search results
  const fetchSearchResults = async (pageNum: number, isLoadMore: boolean = false) => {
    const query = buildContextualQuery();
    if (!query) return;
    
    setIsLoading(true);
    if (!isLoadMore) setError(null);
    
    try {
      const pageSize = pageNum === 1 ? INITIAL_PAGE_SIZE : ADDITIONAL_PAGE_SIZE;
      const response = await searchWithSerper(query, "search", true, pageSize);
      
      if (response.error) {
        setError(response.error);
      }
      
      // If loading more results, append to existing results
      if (isLoadMore && pageNum > 1) {
        setResults(prevResults => [...prevResults, ...(response.results || [])]);
      } else {
        setResults(response.results || []);
      }
      
      // Determine if there are more results to load
      setHasMore(Boolean(response.results?.length === pageSize));
      
      // Log the query and results for debugging
      console.log("Search query:", query);
      console.log("Search results:", response.results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Failed to fetch search results");
      toast({
        title: "Search Error",
        description: "Failed to fetch web search results",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch results when the current query changes
  useEffect(() => {
    if (currentQuery) {
      setPage(1);
      fetchSearchResults(1);
    }
  }, [currentQuery]);

  // Enhanced scroll handler with better isolation
  const handleScroll = useCallback((e: Event) => {
    // Prevent default behavior and stop propagation completely
    e.preventDefault();
    e.stopPropagation();
    
    if (!scrollAreaRef.current || isLoading || !hasMore) return;
    
    const scrollableArea = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
    if (!scrollableArea) return;
    
    // Check if scrolled to bottom
    const { scrollTop, scrollHeight, clientHeight } = scrollableArea as HTMLDivElement;
    if (scrollHeight - scrollTop - clientHeight < 50) { // 50px threshold
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchSearchResults(nextPage, true);
        return nextPage;
      });
    }
  }, [isLoading, hasMore, fetchSearchResults]); 

  // Add scroll event listener with improved isolation using capture phase
  useEffect(() => {
    const scrollableArea = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollableArea) {
      // Use capture phase to intercept events before they bubble up
      scrollableArea.addEventListener('scroll', handleScroll, { passive: false, capture: true });
      return () => scrollableArea.removeEventListener('scroll', handleScroll, { capture: true });
    }
  }, [handleScroll]);

  const handleRefresh = () => {
    setPage(1);
    fetchSearchResults(1);
    toast({
      title: "Refreshing results",
      description: "Getting the latest search results"
    });
  };

  // Extract domain from URL for display and favicon
  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, '');
      return domain;
    } catch (e) {
      return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    }
  };

  // Generate favicon URL
  const getFaviconUrl = (url: string) => {
    const domain = extractDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Fixed header */}
      <div className="p-3 flex items-center justify-between border-b sticky top-0 z-10 bg-background">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-nexus-purple" />
          <h3 className="text-sm font-medium">Web Results</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Search query label, also sticky */}
      <div className="p-3 sticky top-[53px] z-10 bg-background">
        {currentQuery && (
          <Badge variant="outline" className="bg-nexus-purple/10 text-xs">
            Searching for: {currentQuery}
          </Badge>
        )}
      </div>
      
      {/* Scrollable content area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full overscroll-contain" ref={scrollAreaRef}>
          {isLoading && page === 1 ? (
            <div className="h-32 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-nexus-purple" />
            </div>
          ) : error && page === 1 ? (
            <div className="p-4">
              <Card className="p-4 flex items-center gap-2 bg-red-500/10">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-sm">{error}</p>
              </Card>
            </div>
          ) : results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {currentQuery ? 'No results found' : 'Start a conversation to see web results'}
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {results.map((result, index) => (
                <Card key={index} className="p-3 hover:shadow-md transition-all">
                  <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <img 
                          src={getFaviconUrl(result.url)} 
                          alt={`${extractDomain(result.url)} favicon`}
                          className="h-4 w-4"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%23F0F0F0' /%3E%3Ctext x='8' y='12' font-size='12' text-anchor='middle' fill='%23666666'%3E?%3C/text%3E%3C/svg%3E";
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-medium line-clamp-2 hover:text-nexus-purple">{result.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
                        <div className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-1">
                          <span className="font-medium text-muted-foreground/70">{extractDomain(result.url)}</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </Card>
              ))}
              {isLoading && page > 1 && (
                <div className="py-3 flex justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-nexus-purple" />
                </div>
              )}
              {!hasMore && results.length > 0 && (
                <div className="py-2 text-center text-xs text-muted-foreground">
                  No more results available
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default WebSearchSidebar;
