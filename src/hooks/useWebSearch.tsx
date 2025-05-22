import { useState, useEffect, useCallback, useRef } from 'react';
import { searchWithSerper } from '@/services/searchApi';
import { ChatMessage } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { dataCache } from '@/utils/dataCache';

export const useWebSearch = (currentQuery: string, conversations: ChatMessage[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchStage, setSearchStage] = useState<'query' | 'searching' | 'analyzing' | 'complete'>('complete');
  const { toast } = useToast();
  
  // Keep track of the current and previous queries
  const previousQueryRef = useRef<string>('');
  const hasSearchedForCurrentQueryRef = useRef<boolean>(false);
  
  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  
  // Abort controller for cancelling API requests
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Set cache key
  const cacheKeyRef = useRef<string>(`search_${currentQuery.toLowerCase().trim()}_${page}`);

  useEffect(() => {
    // Set isMounted to true when component mounts
    isMountedRef.current = true;
    
    // Clean up function for when component unmounts
    return () => {
      isMountedRef.current = false;
      
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clear any pending timers
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Helper function to get cached results
  const getCachedResults = useCallback((query: string, pageNum: number): any[] | null => {
    if (!query) return null;
    
    const normalizedQuery = query.toLowerCase().trim();
    const key = `search_${normalizedQuery}_${pageNum}`;
    
    const cachedItem = dataCache.get(key);
    if (cachedItem) {
      console.log('Using cached search results for:', normalizedQuery);
      try {
        return JSON.parse(cachedItem.data);
      } catch (e) {
        console.error('Error parsing cached results:', e);
      }
    }
    
    return null;
  }, []);

  // Debounced search function
  const debouncedSearch = useCallback((query: string, pageNum: number, isLoadMore: boolean = false) => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      fetchSearchResults(query, pageNum, isLoadMore);
    }, 300);
  }, []);
  
  // Fetch search results
  const fetchSearchResults = useCallback(async (query: string, pageNum: number, isLoadMore: boolean = false) => {
    if (!query) return;
    
    // Skip if this query has already been searched (unless loading more pages)
    if (!isLoadMore && query === previousQueryRef.current && hasSearchedForCurrentQueryRef.current) {
      console.log('Skipping duplicate search for:', query);
      return;
    }
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    // Check cache first
    const cachedResults = getCachedResults(query, pageNum);
    if (cachedResults) {
      if (isLoadMore) {
        setResults(prev => [...prev, ...cachedResults]);
      } else {
        setResults(cachedResults);
      }
      setHasMore(cachedResults.length > 0);
      
      // Update refs
      previousQueryRef.current = query;
      hasSearchedForCurrentQueryRef.current = true;
      
      return;
    }
    
    // Set loading state
    setIsLoading(true);
    if (!isLoadMore) {
      setSearchStage('query');
      setError(null);
    }
    
    try {
      // Update search stage
      setSearchStage('searching');
      
      // Record the current query
      previousQueryRef.current = query;
      
      // Simulate network delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Perform search
      const pageSize = 10;
      const response = await searchWithSerper(query, "search", true, pageSize);
      
      // Update search stage
      setSearchStage('analyzing');
      
      // Check if component is still mounted
      if (!isMountedRef.current) return;
      
      // Process results
      if (response.error) {
        setError(response.error);
      } else {
        const searchResults = response.results || [];
        
        // Process and store results
        if (isLoadMore) {
          setResults(prev => [...prev, ...searchResults]);
        } else {
          setResults(searchResults);
        }
        
        // Update has more flag
        setHasMore(searchResults.length === pageSize);
        
        // Cache results
        const cacheKey = `search_${query.toLowerCase().trim()}_${pageNum}`;
        dataCache.set(
          cacheKey,
          JSON.stringify(searchResults),
          searchResults.slice(0, 3).map((result: any) => ({ title: result.title, url: result.url })),
          'search_results'
        );
      }
      
      // Mark as searched for this query
      hasSearchedForCurrentQueryRef.current = true;
    } catch (err: any) {
      // Only set error if not aborted
      if (err.name !== 'AbortError' && isMountedRef.current) {
        console.error('Search error:', err);
        setError('Failed to fetch search results');
      }
    } finally {
      // Only update state if still mounted
      if (isMountedRef.current) {
        setIsLoading(false);
        setSearchStage('complete');
      }
    }
  }, [getCachedResults]);

  // Handle query changes
  useEffect(() => {
    console.log('Query changed to:', currentQuery);
    
    if (currentQuery) {
      if (currentQuery !== previousQueryRef.current) {
        console.log('Resetting page and search state for new query');
        setPage(1);
        hasSearchedForCurrentQueryRef.current = false;
        debouncedSearch(currentQuery, 1);
      } else if (!hasSearchedForCurrentQueryRef.current) {
        console.log('Initial search for current query');
        debouncedSearch(currentQuery, 1);
      }
    } else {
      // Clear results if no query
      setResults([]);
      setError(null);
      previousQueryRef.current = '';
      hasSearchedForCurrentQueryRef.current = false;
    }
  }, [currentQuery, debouncedSearch]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && currentQuery) {
      const nextPage = page + 1;
      setPage(nextPage);
      debouncedSearch(currentQuery, nextPage, true);
    }
  }, [currentQuery, debouncedSearch, hasMore, isLoading, page]);

  // Refresh results
  const handleRefresh = useCallback(() => {
    if (currentQuery) {
      console.log('Forcing refresh for query:', currentQuery);
      setPage(1);
      hasSearchedForCurrentQueryRef.current = false;
      
      // Cancel any pending searches
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      // Force immediate search
      fetchSearchResults(currentQuery, 1, false);
      
      toast({
        title: "Refreshing results",
        description: "Getting the latest information from the web"
      });
    }
  }, [currentQuery, fetchSearchResults, toast]);

  return {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore,
    searchStage
  };
};
