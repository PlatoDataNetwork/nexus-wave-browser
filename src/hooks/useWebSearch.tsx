
import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  
  // Strong reference tracking to prevent redundant searches
  const previousQueryRef = useRef<string>('');
  const hasSearchedRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Use a ref to store a debounce timer
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const INITIAL_PAGE_SIZE = 20;
  const ADDITIONAL_PAGE_SIZE = 10;
  
  // Cache key for this query
  const cacheKeyRef = useRef<string>('');
  
  // Normalize the current query to prevent case or whitespace differences
  const normalizedQuery = useMemo(() => 
    currentQuery?.trim().toLowerCase() || '', 
    [currentQuery]
  );

  // Build context-aware search query based on conversation history
  const buildContextualQuery = useCallback(() => {
    if (!normalizedQuery) return '';
    
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
        
      return `${normalizedQuery} ${keyTerms ? `context: ${keyTerms}` : ''}`.trim();
    }
    
    return normalizedQuery;
  }, [normalizedQuery, conversations]);

  // Memoize the complete query to reduce unnecessary recalculations
  const fullQuery = useMemo(() => buildContextualQuery(), [buildContextualQuery]);

  // Check cache before fetching - memoized to avoid recreating on each render
  const checkCache = useCallback((query: string, pageNum: number): any[] | null => {
    if (!query) return null;
    
    const cacheKey = `search_${query.toLowerCase().trim()}_${pageNum}`;
    cacheKeyRef.current = cacheKey;
    
    // Try to get from cache
    const cachedItem = dataCache.get(cacheKey);
    if (cachedItem) {
      console.log('Using cached search results for:', query);
      return JSON.parse(cachedItem.data);
    }
    
    return null;
  }, []);

  // Fetch search results - carefully memoized
  const fetchSearchResults = useCallback(async (
    pageNum: number, 
    isLoadMore: boolean = false, 
    forceRefresh: boolean = false
  ) => {
    // Skip if query is empty
    if (!fullQuery) return;
    
    // Skip if this is the same query and we've already searched
    // unless explicitly forced or loading more results
    if (!forceRefresh && !isLoadMore && 
        fullQuery === previousQueryRef.current && 
        hasSearchedRef.current) {
      console.log('Skipping redundant search for:', fullQuery);
      return;
    }
    
    console.log('Performing search for:', fullQuery, { pageNum, isLoadMore, forceRefresh });
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      console.log('Cancelled previous search request');
    }
    abortControllerRef.current = new AbortController();
    
    // Update search stage based on the state of the operation
    if (!isLoadMore) {
      setSearchStage('query');
    }
    
    setIsLoading(true);
    if (!isLoadMore) setError(null);
    
    // Update reference to current query
    previousQueryRef.current = fullQuery;
    
    // Short delay to allow the UI to update and prevent flickering
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Check cache first (unless forced refresh)
    const cachedResults = forceRefresh ? null : checkCache(fullQuery, pageNum);
    if (cachedResults) {
      if (isLoadMore && pageNum > 1) {
        setResults(prevResults => [...prevResults, ...cachedResults]);
      } else {
        setResults(cachedResults);
      }
      setHasMore(Boolean(cachedResults.length === (pageNum === 1 ? INITIAL_PAGE_SIZE : ADDITIONAL_PAGE_SIZE)));
      setIsLoading(false);
      setSearchStage('complete');
      hasSearchedRef.current = true;
      return;
    }
    
    // Performance measurement
    const startTime = performance.now();
    
    try {
      // Update search stage to searching
      setSearchStage('searching');
      
      // Short delay to show the searching state
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const pageSize = pageNum === 1 ? INITIAL_PAGE_SIZE : ADDITIONAL_PAGE_SIZE;
      const response = await searchWithSerper(fullQuery, "search", true, pageSize);
      
      // Update search stage to analyzing
      setSearchStage('analyzing');
      
      // Short delay to show the analyzing state
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (response.error) {
        setError(response.error);
      }
      
      // Process and enhance search results with metadata
      const searchResults = response.results || [];
      const enhancedResults = searchResults.map((result: any) => {
        // Add calculated fields
        return {
          ...result,
          publishDate: result.publishedDate || result.date,
          isRecent: isRecentContent(result.publishedDate || result.date),
          credibilityScore: calculateCredibilityScore(result)
        };
      });
      
      // Store in cache
      dataCache.set(
        cacheKeyRef.current,
        JSON.stringify(enhancedResults),
        enhancedResults.slice(0, 3).map((result: any) => ({ title: result.title, url: result.url })),
        'search_results'
      );
      
      if (isLoadMore && pageNum > 1) {
        setResults(prevResults => [...prevResults, ...enhancedResults]);
      } else {
        setResults(enhancedResults);
      }
      
      setHasMore(Boolean(enhancedResults.length === pageSize));
      
      // Log performance metrics
      const endTime = performance.now();
      console.log(`Search fetch completed in ${(endTime - startTime).toFixed(0)}ms`);
      
      // Mark that we've searched for this query
      hasSearchedRef.current = true;
      
      // Update search stage to complete
      setSearchStage('complete');
    } catch (err: any) {
      // Only set error if this request wasn't aborted
      if (err.name !== 'AbortError') {
        console.error("Error fetching results:", err);
        setError("Failed to fetch search results");
        toast({
          title: "Search Error",
          description: "Failed to fetch web search results",
          variant: "destructive"
        });
      } else {
        console.log('Search request was aborted');
      }
      setSearchStage('complete');
    } finally {
      setIsLoading(false);
    }
  }, [fullQuery, checkCache, toast]);

  // Check if content is recent (published within the last month)
  const isRecentContent = useCallback((dateString?: string): boolean => {
    if (!dateString) return false;
    
    try {
      const publishDate = new Date(dateString);
      const now = new Date();
      // Content is recent if it's from the last month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      return publishDate >= oneMonthAgo;
    } catch (e) {
      return false;
    }
  }, []);
  
  // Calculate a simple credibility score (0-100) based on domain and content
  const calculateCredibilityScore = useCallback((result: any): number => {
    let score = 50; // Start with neutral score
    
    // Domain authority approximation
    if (result.url) {
      try {
        const domain = new URL(result.url).hostname;
        
        // Bonus for known authoritative sites
        const authorityDomains = [
          'bloomberg.com', 'reuters.com', 'ap.org', 'nytimes.com', 'wsj.com',
          'bbc.com', 'bbc.co.uk', 'cnn.com', 'theguardian.com', 'ft.com',
          'forbes.com', 'economist.com', 'gov', 'edu', 'un.org', 'who.int'
        ];
        
        // Check if domain ends with or contains any of the authority domains
        for (const authDomain of authorityDomains) {
          if (domain.endsWith(authDomain) || domain.includes(authDomain)) {
            score += 30;
            break;
          }
        }
      } catch (e) {
        // Invalid URL format, no adjustment
      }
    }
    
    // Recency bonus
    if (isRecentContent(result.publishedDate || result.date)) {
      score += 15;
    }
    
    // Content length approximation
    if (result.description && result.description.length > 100) {
      score += 5;
    }
    
    // Cap at 100
    return Math.min(score, 100);
  }, [isRecentContent]);

  // Handle refresh action - force a new search
  const handleRefresh = useCallback(() => {
    console.log('Forcing refresh of search results');
    hasSearchedRef.current = false;
    setPage(1);
    fetchSearchResults(1, false, true);
    toast({
      title: "Refreshing results",
      description: "Getting the latest search results"
    });
  }, [fetchSearchResults, toast]);

  // Load more results
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log('Loading more results, page:', page + 1);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(nextPage, true);
    }
  }, [fetchSearchResults, hasMore, isLoading, page]);

  // Debounced search function to prevent multiple API calls
  const debouncedSearch = useCallback((pageNum: number = 1) => {
    // Clear any existing timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }
    
    // Set a new timer
    searchTimerRef.current = setTimeout(() => {
      fetchSearchResults(pageNum);
    }, 300);
  }, [fetchSearchResults]);

  // Run search once when the query changes or component mounts
  useEffect(() => {
    // Only search if there's a query and it's different from the previous one
    if (normalizedQuery && normalizedQuery !== previousQueryRef.current) {
      console.log('Query changed, initiating new search:', normalizedQuery);
      
      // Reset state for new search
      setPage(1);
      hasSearchedRef.current = false;
      
      // Use debounced search to prevent multiple rapid API calls
      debouncedSearch(1);
    } 
    // If we have a query but haven't searched yet (first load)
    else if (normalizedQuery && !hasSearchedRef.current) {
      console.log('Initial search for query:', normalizedQuery);
      debouncedSearch(1);
    }
    
    // Cleanup function
    return () => {
      // Cancel any pending debounced search
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
      
      // Cancel any in-flight requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [normalizedQuery, debouncedSearch]);

  // Calculate whether to show the sidebar based on query and results
  const shouldShowSidebar = useMemo(() => {
    return Boolean(normalizedQuery) && (results.length > 0 || isLoading);
  }, [normalizedQuery, results, isLoading]);

  return {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore,
    searchStage,
    shouldShowSidebar
  };
};
