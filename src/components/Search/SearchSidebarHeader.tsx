
import React from 'react';
import { X, RefreshCw, Search as SearchIcon, Loader2, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchSidebarHeaderProps {
  currentQuery: string;
  onRefresh: () => void;
  onClose: () => void;
  searchStage?: 'query' | 'searching' | 'analyzing' | 'complete';
  processingType?: 'individual' | 'contextual';
}

const SearchSidebarHeader: React.FC<SearchSidebarHeaderProps> = ({
  currentQuery,
  onRefresh,
  onClose,
  searchStage = 'complete',
  processingType = 'individual'
}) => {
  // Helper function to get status text based on search stage
  const getStatusText = () => {
    switch (searchStage) {
      case 'query':
        return 'Preparing search...';
      case 'searching':
        return 'Searching...';
      case 'analyzing':
        return 'Analyzing results...';
      default:
        return currentQuery ? `Results for "${currentQuery}"` : 'No active search';
    }
  };

  const isSearching = searchStage === 'searching' || searchStage === 'analyzing' || searchStage === 'query';

  return (
    <div className="p-3 flex items-center justify-between border-b border-border bg-muted/50">
      <div className="flex items-center gap-2 text-sm font-medium">
        {isSearching ? (
          <Loader2 className="h-4 w-4 text-nexus-purple animate-spin" />
        ) : processingType === 'contextual' ? (
          <Database className="h-4 w-4 text-purple-500" />
        ) : (
          <SearchIcon className="h-4 w-4 text-nexus-purple" />
        )}
        <div className="max-w-[180px] truncate">
          {getStatusText()}
          {processingType === 'contextual' && searchStage === 'complete' && (
            <span className="ml-1 text-xs text-purple-500">(context-aware)</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={onRefresh}
          disabled={isSearching || !currentQuery}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default SearchSidebarHeader;
