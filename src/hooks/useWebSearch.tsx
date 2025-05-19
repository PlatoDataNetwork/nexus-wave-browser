
import { useState, useEffect } from 'react';
import { searchWithSerper } from '@/services/searchApi';
import { ChatMessage } from '@/types';
import { useToast } from "@/hooks/use-toast";

export const useWebSearch = (currentQuery: string, conversations: ChatMessage[]) => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();

  const INITIAL_PAGE_SIZE = 30;
  const ADDITIONAL_PAGE_SIZE = 10;

  // Build context-aware search query based on conversation history
  const buildContextualQuery = () => {
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
      
      if (isLoadMore && pageNum > 1) {
        setResults(prevResults => [...prevResults, ...(response.results || [])]);
      } else {
        setResults(response.results || []);
      }
      
      setHasMore(Boolean(response.results?.length === pageSize));
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

  // Handle refresh action
  const handleRefresh = () => {
    setPage(1);
    fetchSearchResults(1);
    toast({
      title: "Refreshing results",
      description: "Getting the latest search results"
    });
  };

  // Load more results
  const loadMore = () => {
    if (!isLoading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(nextPage, true);
    }
  };

  // Fetch results when the current query changes
  useEffect(() => {
    if (currentQuery) {
      setPage(1);
      fetchSearchResults(1);
    }
  }, [currentQuery]);

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
