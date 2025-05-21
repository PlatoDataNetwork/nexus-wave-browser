
import React, { useState } from 'react';
import { useWebSearch } from '@/hooks/useWebSearch';
import { ChatMessage } from '@/types';
import SearchSidebarHeader from './SearchSidebarHeader';
import SearchSidebarContent from './SearchSidebarContent';
import ResponseProgress from './ResponseProgress';

interface WebSearchSidebarProps {
  currentQuery: string;
  conversations: ChatMessage[];
  onClose: () => void;
  scrapeProgress?: number;
  processingStage?: string;
}

const WebSearchSidebar: React.FC<WebSearchSidebarProps> = ({ 
  currentQuery, 
  conversations,
  onClose,
  scrapeProgress = 0,
  processingStage = ''
}) => {
  const {
    isLoading,
    results,
    error,
    page,
    hasMore,
    handleRefresh,
    loadMore
  } = useWebSearch(currentQuery, conversations);

  return (
    <div className="flex flex-col h-full" style={{ isolation: 'isolate', touchAction: 'none' }}>
      <SearchSidebarHeader 
        currentQuery={currentQuery}
        onRefresh={handleRefresh}
        onClose={onClose}
      />
      
      {/* Show scraping progress if in progress */}
      {scrapeProgress > 0 && scrapeProgress < 100 && (
        <div className="px-4 py-2 bg-muted/50">
          <ResponseProgress 
            stage="searching"
            percentage={scrapeProgress}
            showDetails={true}
            stageDetails={processingStage || "Extracting data from web sources..."}
          />
        </div>
      )}
      
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
