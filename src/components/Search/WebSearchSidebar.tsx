
import React, { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { searchWithSerper } from '@/services/searchApi';
import { ChatMessage } from '@/types';
import { useToast } from "@/hooks/use-toast";
import SearchSidebarHeader from './SearchSidebarHeader';
import SearchResultsList from './SearchResultsList';

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

  // Fetch results when the current query changes
  useEffect(() => {
    if (currentQuery) {
      setPage(1);
      fetchSearchResults(1);
    }
  }, [currentQuery]);

  // Add scroll detection for infinite loading with proper isolation
  useEffect(() => {
    const scrollableElement = scrollAreaRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    
    if (!scrollableElement) return;
    
    // Create an Intersection Observer to detect when near bottom
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && hasMore) {
          setPage(prevPage => {
            const nextPage = prevPage + 1;
            fetchSearchResults(nextPage, true);
            return nextPage;
          });
        }
      },
      { root: scrollableElement, threshold: 0.1, rootMargin: '100px' }
    );
    
    // Create a sentinel element to observe
    const sentinel = document.createElement('div');
    sentinel.style.height = '10px';
    sentinel.style.width = '100%';
    sentinel.id = 'scroll-sentinel';
    
    // Add sentinel to DOM and observe it
    const resultsContainer = scrollableElement.querySelector('div');
    if (resultsContainer) {
      resultsContainer.appendChild(sentinel);
      observer.observe(sentinel);
    }
    
    // Cleanup
    return () => {
      observer.disconnect();
      sentinel.remove();
    };
  }, [isLoading, hasMore, results]);

  // Handle refresh action
  const handleRefresh = () => {
    setPage(1);
    fetchSearchResults(1);
    toast({
      title: "Refreshing results",
      description: "Getting the latest search results"
    });
  };

  // Prevent scroll propagation on all touch and wheel events
  useEffect(() => {
    const preventPropagation = (e: Event) => {
      e.stopPropagation();
    };
    
    const element = scrollAreaRef.current;
    if (element) {
      // Capture these events at the earliest possible phase
      element.addEventListener('wheel', preventPropagation, { capture: true });
      element.addEventListener('touchstart', preventPropagation, { capture: true });
      element.addEventListener('touchmove', preventPropagation, { capture: true });
      element.addEventListener('touchend', preventPropagation, { capture: true });
      
      return () => {
        element.removeEventListener('wheel', preventPropagation, { capture: true });
        element.removeEventListener('touchstart', preventPropagation, { capture: true });
        element.removeEventListener('touchmove', preventPropagation, { capture: true });
        element.removeEventListener('touchend', preventPropagation, { capture: true });
      };
    }
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ isolation: 'isolate', touchAction: 'none' }}>
      <SearchSidebarHeader 
        currentQuery={currentQuery}
        onRefresh={handleRefresh}
        onClose={onClose}
      />
      
      <div 
        className="flex-1 relative overflow-hidden"
        style={{ 
          isolation: 'isolate', 
          touchAction: 'none', 
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <ScrollArea 
          className="absolute inset-0" 
          ref={scrollAreaRef}
        >
          <div className="p-4">
            <SearchResultsList 
              results={results}
              error={error}
              isLoading={isLoading}
              page={page}
              hasMore={hasMore}
              currentQuery={currentQuery}
            />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default WebSearchSidebar;
