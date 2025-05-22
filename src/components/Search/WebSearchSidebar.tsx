
import React, { memo, useEffect } from 'react';
import { useWebSearch } from '@/hooks/useWebSearch';
import { ChatMessage } from '@/types';
import SearchSidebarHeader from './SearchSidebarHeader';
import SearchSidebarContent from './SearchSidebarContent';

interface WebSearchSidebarProps {
  currentQuery: string;
  conversations: ChatMessage[];
  onClose: () => void;
  processingType?: 'individual' | 'contextual';
}

// Create a memoized version of the component to prevent unnecessary rerenders
const WebSearchSidebar: React.FC<WebSearchSidebarProps> = memo(({ 
  currentQuery, 
  conversations,
  onClose,
  processingType = 'individual'
}) => {
  const {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore,
    searchStage
  } = useWebSearch(currentQuery, conversations);
  
  useEffect(() => {
    // Log when the component is rendered with a new query
    console.log('WebSearchSidebar render with query:', currentQuery);
  }, [currentQuery]);

  return (
    <div className="flex flex-col h-full" style={{ isolation: 'isolate', touchAction: 'none' }}>
      <SearchSidebarHeader 
        currentQuery={currentQuery}
        onRefresh={handleRefresh}
        onClose={onClose}
        searchStage={searchStage}
        processingType={processingType}
      />
      
      <SearchSidebarContent
        isLoading={isLoading}
        results={results}
        error={error}
        page={page}
        hasMore={hasMore}
        currentQuery={currentQuery}
        onLoadMore={loadMore}
        searchStage={searchStage}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary rerenders
  // Only rerender if the currentQuery changes
  return prevProps.currentQuery === nextProps.currentQuery;
});

WebSearchSidebar.displayName = 'WebSearchSidebar';

export default WebSearchSidebar;
