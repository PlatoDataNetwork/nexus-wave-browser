
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Calendar } from "lucide-react";
import { SearchResultItem } from '@/services/searchApi';

interface SearchSidebarProps {
  isLoading: boolean;
  results: SearchResultItem[];
  searchQuery: string;
  recencyFilter?: "day" | "week" | "month" | "any";
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({ 
  isLoading, 
  results, 
  searchQuery,
  recencyFilter = "any"
}) => {
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

  if (results.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <p className="text-muted-foreground text-center">
          No results found for "{searchQuery}"
        </p>
      </div>
    );
  }

  // Helper function to format the recency filter text
  const formatRecencyText = (filter: "day" | "week" | "month" | "any") => {
    switch(filter) {
      case "day": return "the past 24 hours";
      case "week": return "the past week";
      case "month": return "the past month";
      default: return "any time";
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Related Search Results</h3>
          {recencyFilter !== "any" && (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              <span>From {formatRecencyText(recencyFilter)}</span>
            </div>
          )}
        </div>

        {results.map((result) => (
          <Card key={result.id} className="hover:shadow-sm transition-all">
            <CardContent className="p-3">
              <a 
                href={result.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <h4 className="text-sm font-medium line-clamp-2 hover:text-nexus-purple">{result.title}</h4>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
              </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SearchSidebar;
