
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
  const checkCache = useCallback((query: string): any[] | null => {
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

  // Fetch search results
  const fetchSearchResults = useCallback(async (pageNum: number, isLoadMore: boolean = false) => {
    const query = buildContextualQuery();
    if (!query) return;
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    
    // Update searchStage based on the state of the operation
    if (!isLoadMore) {
      setSearchStage('query');
    }
    
    setIsLoading(true);
    if (!isLoadMore) setError(null);
    
    // Short delay to allow the UI to update
    await new Promise(resolve => setTimeout(resolve, 300));
    
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
      setSearchStage('complete');
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
      const response = await searchWithSerper(query, "search", true, pageSize);
      
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
        cacheKey.current,
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
      
      // Update search stage to complete
      setSearchStage('complete');
    } catch (err) {
      // Only set error if this request wasn't aborted
      if (err.name !== 'AbortError') {
        console.error("Error fetching results:", err);
        setError("Failed to fetch search results");
        toast({
          title: "Search Error",
          description: "Failed to fetch web search results",
          variant: "destructive"
        });
      }
      setSearchStage('complete');
    } finally {
      setIsLoading(false);
    }
  }, [buildContextualQuery, checkCache, toast]);

  // Check if content is recent (published within the last month)
  const isRecentContent = (dateString?: string): boolean => {
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
  };
  
  // Calculate a simple credibility score (0-100) based on domain and content
  const calculateCredibilityScore = (result: any): number => {
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
  };

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
    loadMore,
    searchStage
  };
};
