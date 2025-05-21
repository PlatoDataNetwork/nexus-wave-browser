
import React, { useEffect } from 'react';
import { useWebSearch } from '@/hooks/useWebSearch';
import SearchSidebarHeader from './SearchSidebarHeader';
import SearchSidebarContent from './SearchSidebarContent';
import { useConversationContext } from '@/contexts/ConversationContext';

interface WebSearchSidebarProps {
  onClose: () => void;
}

const WebSearchSidebar: React.FC<WebSearchSidebarProps> = ({ onClose }) => {
  const { currentQuery, messages, categoryContext } = useConversationContext();
  
  const {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore
  } = useWebSearch(currentQuery, messages);

  // Effect to refresh search when category changes
  useEffect(() => {
    if (categoryContext && results.length === 0) {
      handleRefresh();
    }
  }, [categoryContext, handleRefresh, results.length]);

  return (
    <div className="flex flex-col h-full" style={{ isolation: 'isolate', touchAction: 'none' }}>
      <SearchSidebarHeader 
        currentQuery={currentQuery || categoryContext || ''}
        onRefresh={handleRefresh}
        onClose={onClose}
      />
      
      <SearchSidebarContent
        isLoading={isLoading}
        results={results}
        error={error}
        page={page}
        hasMore={hasMore}
        currentQuery={currentQuery || categoryContext || ''}
        onLoadMore={loadMore}
        categoryContext={categoryContext}
      />
    </div>
  );
};

export default WebSearchSidebar;
