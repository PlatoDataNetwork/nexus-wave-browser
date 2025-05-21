
import React from 'react';
import { useWebSearch } from '@/hooks/useWebSearch';
import SearchSidebarHeader from './SearchSidebarHeader';
import SearchSidebarContent from './SearchSidebarContent';
import { useConversationContext } from '@/contexts/ConversationContext';

interface WebSearchSidebarProps {
  onClose: () => void;
}

const WebSearchSidebar: React.FC<WebSearchSidebarProps> = ({ onClose }) => {
  const { currentQuery, messages } = useConversationContext();
  
  const {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore
  } = useWebSearch(currentQuery, messages);

  return (
    <div className="flex flex-col h-full" style={{ isolation: 'isolate', touchAction: 'none' }}>
      <SearchSidebarHeader 
        currentQuery={currentQuery}
        onRefresh={handleRefresh}
        onClose={onClose}
      />
      
      <SearchSidebarContent
        isLoading={isLoading}
        results={results}
        error={error}
        page={page}
        hasMore={hasMore}
        currentQuery={currentQuery}
        onLoadMore={loadMore}
      />
    </div>
  );
};

export default WebSearchSidebar;
