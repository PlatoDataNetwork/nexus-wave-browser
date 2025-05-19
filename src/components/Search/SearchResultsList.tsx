
import React from 'react';
import { Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
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
  return (
    <div className="p-4 space-y-3">
      {isLoading && page === 1 ? (
        <div className="h-32 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-nexus-purple" />
        </div>
      ) : error && page === 1 ? (
        <div className="p-4">
          <Card className="p-4 flex items-center gap-2 bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm">{error}</p>
          </Card>
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          {currentQuery ? 'No results found' : 'Start a conversation to see web results'}
        </div>
      ) : (
        <>
          {results.map((result, index) => (
            <SearchResultItem key={index} result={result} />
          ))}
          {isLoading && page > 1 && (
            <div className="py-3 flex justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-nexus-purple" />
            </div>
          )}
          {!hasMore && results.length > 0 && (
            <div className="py-2 text-center text-xs text-muted-foreground">
              No more results available
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResultsList;
