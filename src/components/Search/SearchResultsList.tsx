
import React from 'react';
import { Loader2, AlertCircle, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface SearchResultsListProps {
  results: any[];
  error: string | null;
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  currentQuery: string;
  searchStage?: 'query' | 'searching' | 'analyzing' | 'complete';
}

const SearchResultsList: React.FC<SearchResultsListProps> = ({
  results,
  error,
  isLoading,
  page,
  hasMore,
  currentQuery,
  searchStage = 'complete'
}) => {
  // Show appropriate loading states based on search stage
  if (isLoading && page === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-purple mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {searchStage === 'searching' ? 'Searching the web...' : 
           searchStage === 'analyzing' ? 'Analyzing results...' : 
           'Loading results...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <AlertCircle className="h-8 w-8 text-amber-500 mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {error}
        </p>
      </div>
    );
  }

  if (results.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Globe className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground text-center">
          {currentQuery ? `No results found for "${currentQuery}"` : 'Enter a search query to see results'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result, index) => (
        <Card key={index} className="hover:shadow-sm transition-all">
          <CardContent className="p-3">
            <a 
              href={result.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <h4 className="text-sm font-medium line-clamp-2 hover:text-nexus-purple">{result.title}</h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.snippet || result.description}</p>
              <div className="text-xs text-muted-foreground mt-1 truncate">
                {result.url && result.url.replace(/^https?:\/\/(www\.)?/, '')}
              </div>
            </a>
          </CardContent>
        </Card>
      ))}
      
      {isLoading && page > 1 && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-5 w-5 animate-spin text-nexus-purple" />
        </div>
      )}
    </div>
  );
};

export default SearchResultsList;
