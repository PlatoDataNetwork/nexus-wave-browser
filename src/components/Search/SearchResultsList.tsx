
import React from 'react';
import { Card } from "@/components/ui/card";
import { Loader2, AlertCircle } from 'lucide-react';
import SearchResultItem from './SearchResultItem';

interface SearchResultsListProps {
  results: any[];
  error: string | null;
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  currentQuery: string;
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  error,
  isLoading,
  page,
  hasMore,
  currentQuery
}) => {
  // Loading indicator for initial load
  if (isLoading && page === 1 && results.length === 0) {
    return (
      <Card className="p-4 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-purple mb-3" />
        <p className="text-center text-sm text-muted-foreground">Searching for results...</p>
      </Card>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="p-4 border-red-200">
        <div className="flex items-center text-red-600 mb-2">
          <AlertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Error</h3>
        </div>
        <p className="text-sm text-muted-foreground">{error}</p>
      </Card>
    );
  }

  // No results state
  if (results.length === 0 && !isLoading) {
    return (
      <Card className="p-4">
        <p className="text-center text-sm text-muted-foreground">
          No results found for <span className="font-medium">"{currentQuery}"</span>
        </p>
      </Card>
    );
  }

  // Results display
  return (
    <div className="space-y-3">
      {results.map((result, index) => (
        <SearchResultItem key={`${result.url}-${index}`} result={result} />
      ))}
      
      {/* Loading indicator for "load more" */}
      {isLoading && page > 1 && (
        <div className="flex justify-center py-3">
          <Loader2 className="h-6 w-6 animate-spin text-nexus-purple" />
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;
