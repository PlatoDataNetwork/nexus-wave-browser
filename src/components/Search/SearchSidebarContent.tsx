import React from 'react';
import { Loader2 } from 'lucide-react';

interface WebSearchResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  published?: string;
  position?: number;
}

interface SearchSidebarContentProps {
  isLoading: boolean;
  results: WebSearchResult[];
  error: Error | null;
  page: number;
  hasMore: boolean;
  currentQuery: string;
  onLoadMore: () => void;
  categoryContext?: string | null;
}

const SearchSidebarContent: React.FC<SearchSidebarContentProps> = ({
  isLoading,
  results,
  error,
  page,
  hasMore,
  currentQuery,
  onLoadMore,
  categoryContext
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {isLoading && results.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <Loader2 className="animate-spin h-8 w-8 text-nexus-purple" />
        </div>
      ) : error ? (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          <p>Error loading search results: {error.message}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {currentQuery ? (
            <p>No results found for "{currentQuery}"</p>
          ) : categoryContext ? (
            <p>No results found for {categoryContext}</p>
          ) : (
            <p>Type a query to search</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Results for {currentQuery || categoryContext || "your query"}:
          </p>
          
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-3 bg-card">
              <a 
                href={result.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-nexus-purple font-medium hover:underline"
              >
                {result.title}
              </a>
              <p className="text-xs text-muted-foreground truncate mt-1">{result.link}</p>
              <p className="text-sm mt-2">{result.snippet}</p>
            </div>
          ))}
          
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button 
                onClick={onLoadMore} 
                className="px-4 py-2 bg-nexus-purple/10 text-nexus-purple rounded-lg hover:bg-nexus-purple/20 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Loading...
                  </span>
                ) : (
                  "Load more results"
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchSidebarContent;
