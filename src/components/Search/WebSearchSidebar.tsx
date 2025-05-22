
import React from 'react';
import { useWebSearch } from '@/hooks/useWebSearch';
import { ChatMessage } from '@/types';
import SearchSidebarHeader from './SearchSidebarHeader';
import SearchSidebarContent from './SearchSidebarContent';
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from 'lucide-react';

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

  return (
    <div className="flex flex-col h-full" style={{ isolation: 'isolate', touchAction: 'none' }}>
      <SearchSidebarHeader 
        currentQuery={currentQuery}
        onRefresh={handleRefresh}
        onClose={onClose}
        searchStage={searchStage}
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
};

export default WebSearchSidebar;
