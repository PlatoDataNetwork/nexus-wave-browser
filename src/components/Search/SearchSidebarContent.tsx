
import React, { useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchResultsList from './SearchResultsList';
import InfiniteScrollSentinel from './InfiniteScrollSentinel';

interface SearchSidebarContentProps {
  isLoading: boolean;
  results: any[];
  error: string | null;
  page: number;
  hasMore: boolean;
  currentQuery: string;
  onLoadMore: () => void;
  searchStage?: 'query' | 'searching' | 'analyzing' | 'complete';
}

const SearchSidebarContent: React.FC<SearchSidebarContentProps> = ({
  isLoading,
  results,
  error,
  page,
  hasMore,
  currentQuery,
  onLoadMore,
  searchStage = 'complete'
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Prevent scroll propagation on all touch and wheel events
  const preventPropagation = (e: React.UIEvent) => {
    e.stopPropagation();
  };

  return (
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
        onWheel={preventPropagation}
        onTouchStart={preventPropagation}
        onTouchMove={preventPropagation}
        onTouchEnd={preventPropagation}
      >
        <div className="p-4">
          <SearchResultsList 
            results={results}
            error={error}
            isLoading={isLoading}
            page={page}
            hasMore={hasMore}
            currentQuery={currentQuery}
            searchStage={searchStage}
          />
          
          {results.length > 0 && hasMore && (
            <InfiniteScrollSentinel
              onIntersect={onLoadMore}
              isLoading={isLoading}
              hasMore={hasMore}
              scrollableRef={scrollAreaRef}
            />
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default SearchSidebarContent;
