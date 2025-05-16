
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { SearchResultItem } from '@/services/searchApi';
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SearchSidebarProps {
  isLoading: boolean;
  results: SearchResultItem[];
  searchQuery: string;
  recencyFilter?: "day" | "week" | "month" | "any";
  onRefresh?: () => void;
  error?: string;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ 
  isLoading, 
  results, 
  searchQuery,
  recencyFilter = "any",
  onRefresh,
  error
}) => {
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  
  // Update the last refreshed timestamp when results update or manual refresh
  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh();
      setLastRefreshed(new Date());
    }
  };

  // Helper function to format the recency filter text
  const formatRecencyText = (filter: "day" | "week" | "month" | "any") => {
    switch(filter) {
      case "day": return "the past 24 hours";
      case "week": return "the past week";
      case "month": return "the past month";
      default: return "any time";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-nexus-purple" />
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-muted-foreground text-center">
          Ask a question to see related search results
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Search Results</h3>
          <div className="flex items-end">
            {recencyFilter !== "any" && (
              <div className="text-xs text-muted-foreground">
                From {formatRecencyText(recencyFilter)}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs flex items-center justify-center"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Refresh Results
          </Button>
        </div>

        {error && (
          <Alert className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {error}. Using best available data.
            </AlertDescription>
          </Alert>
        )}

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground text-center">
              No results found for "{searchQuery}"
            </p>
            <Button 
              variant="link" 
              size="sm" 
              className="mt-2"
              onClick={handleRefresh}
            >
              Try refreshing
            </Button>
          </div>
        ) : (
          results.map((result, index) => (
            <Card key={index} className="hover:shadow-sm transition-all">
              <CardContent className="p-3">
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block"
                >
                  <h4 className="text-sm font-medium line-clamp-2 hover:text-nexus-purple">{result.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {result.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </div>
                </a>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </ScrollArea>
  );
};

export default SearchSidebar;
