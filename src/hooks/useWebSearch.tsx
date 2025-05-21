
import { useState, useEffect, useCallback, useRef } from 'react';
import { searchWithSerper, SearchResultItem } from '@/services/searchApi';
import { ChatMessage, WebSearchResult } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { dataCache } from '@/utils/dataCache';

export const useWebSearch = (currentQuery: string, conversations: ChatMessage[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<WebSearchResult[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const abortControllerRef = useRef<AbortController | null>(null);

  const INITIAL_PAGE_SIZE = 20; // Reduced from 30 for faster initial results
  const ADDITIONAL_PAGE_SIZE = 10;
  
  // Cache key for this query
  const cacheKey = useRef<string>('');

  // Build context-aware search query based on conversation history
  const buildContextualQuery = useCallback(() => {
    if (!currentQuery) return '';
    
    const recentUserMessages = conversations
      .filter(msg => msg.role === "user")
      .slice(-3, -1)
      .map(msg => msg.content);
      
    if (recentUserMessages.length > 0) {
      const keyTerms = recentUserMessages.join(' ')
        .split(' ')
        .filter(word => 
          word.length > 3 && 
          !['what', 'when', 'where', 'which', 'who', 'how', 'why', 'can', 'will', 'should', 'would', 'could', 'the', 'and', 'for', 'that'].includes(word.toLowerCase())
        )
        .slice(0, 5)
        .join(' ');
        
      return `${currentQuery} ${keyTerms ? `context: ${keyTerms}` : ''}`.trim();
    }
    
    return currentQuery;
  }, [currentQuery, conversations]);

  // Check cache before fetching
  const checkCache = useCallback((query: string): WebSearchResult[] | null => {
    const normalizedQuery = query.toLowerCase().trim();
    cacheKey.current = `search_${normalizedQuery}_${page}`;
    
    // Try to get from cache
    const cachedItem = dataCache.get(cacheKey.current);
    if (cachedItem) {
      console.log('Using cached search results');
      return JSON.parse(cachedItem.data);
    }
    
    return null;
  }, [page]);

  // Convert SearchResultItem to WebSearchResult
  const mapToWebSearchResult = (item: SearchResultItem): WebSearchResult => {
    return {
      title: item.title,
      link: item.url,
      snippet: item.description,
      source: item.source,
      published: item.date,
      position: item.position
    };
  };

  // Fetch search results
  const fetchSearchResults = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    const query = buildContextualQuery();
    if (!query) return;
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    setIsLoading(true);
    if (!isLoadMore) setError(null);
    
    // Check cache first
    const cachedResults = checkCache(query);
    if (cachedResults) {
      if (isLoadMore && pageNum > 1) {
        setResults(prevResults => [...prevResults, ...cachedResults]);
      } else {
        setResults(cachedResults);
      }
      setHasMore(Boolean(cachedResults.length === (pageNum === 1 ? INITIAL_PAGE_SIZE : ADDITIONAL_PAGE_SIZE)));
      setIsLoading(false);
      return;
    }
    
    // Performance measurement
    const startTime = performance.now();
    
    try {
      const pageSize = pageNum === 1 ? INITIAL_PAGE_SIZE : ADDITIONAL_PAGE_SIZE;
      const response = await searchWithSerper(query, "search", true, pageSize);
      
      if (response.error) {
        setError(new Error(response.error));
      }
      
      // Map the SearchResultItem objects to WebSearchResult objects
      const searchResults = response.results.map(mapToWebSearchResult);
      
      // Store in cache
      dataCache.set(
        cacheKey.current,
        JSON.stringify(searchResults),
        searchResults.slice(0, 3).map(result => ({ title: result.title, url: result.link })),
        'search_results'
      );
      
      if (isLoadMore && pageNum > 1) {
        setResults(prevResults => [...prevResults, ...searchResults]);
      } else {
        setResults(searchResults);
      }
      
      setHasMore(Boolean(searchResults.length === pageSize));
      
      // Log performance metrics
      const endTime = performance.now();
      console.log(`Search fetch completed in ${(endTime - startTime).toFixed(0)}ms`);
    } catch (err: any) {
      // Only set error if this request wasn't aborted
      if (err.name !== 'AbortError') {
        console.error("Error fetching results:", err);
        setError(new Error("Failed to fetch search results"));
        toast({
          title: "Search Error",
          description: "Failed to fetch web search results",
          variant: "destructive"
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [buildContextualQuery, checkCache, toast, mapToWebSearchResult]);

  // Handle refresh action
  const handleRefresh = useCallback(() => {
    setPage(1);
    // Force skip cache by adding timestamp
    cacheKey.current = `search_${buildContextualQuery()}_${Date.now()}`;
    fetchSearchResults(1);
    toast({
      title: "Refreshing results",
      description: "Getting the latest search results"
    });
  }, [buildContextualQuery, fetchSearchResults, toast]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(nextPage, true);
    }
  }, [fetchSearchResults, hasMore, isLoading, page]);

  // Fetch results when the current query changes
  useEffect(() => {
    if (currentQuery) {
      setPage(1);
      fetchSearchResults(1);
    }
    
    // Cleanup function to abort any in-flight requests when component unmounts
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [currentQuery, fetchSearchResults]);

  return {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore
  };
};
