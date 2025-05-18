
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Globe, AlertCircle, SidebarClose } from "lucide-react";
import { searchWithSerper } from '@/services/searchApi';
import { ChatMessage } from '@/types';
import { useToast } from "@/hooks/use-toast";

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
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Build context-aware search query based on conversation history
  const buildContextualQuery = () => {
    // Start with the current query
    if (!currentQuery) return '';
    
    // Get the last 2 user messages for context (excluding the current one)
    const recentUserMessages = conversations
      .filter(msg => msg.role === "user")
      .slice(-3, -1)
      .map(msg => msg.content);
      
    // If we have context, enhance the query
    if (recentUserMessages.length > 0) {
      // Extract key topics/entities from the conversation
      const keyTerms = recentUserMessages.join(' ')
        .split(' ')
        .filter(word => 
          word.length > 3 && 
          !['what', 'when', 'where', 'which', 'who', 'how', 'why', 'can', 'will', 'should', 'would', 'could', 'the', 'and', 'for', 'that'].includes(word.toLowerCase())
        )
        .slice(0, 5)
        .join(' ');
        
      // Combine current query with context
      return `${currentQuery} ${keyTerms ? `context: ${keyTerms}` : ''}`.trim();
    }
    
    return currentQuery;
  };

  // Fetch search results
  const fetchSearchResults = async () => {
    const query = buildContextualQuery();
    if (!query) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await searchWithSerper(query, "search", true, 5);
      
      if (response.error) {
        setError(response.error);
      }
      
      setResults(response.results || []);
      
      // Log the query and results for debugging
      console.log("Search query:", query);
      console.log("Search results:", response.results);
    } catch (err) {
      console.error("Error fetching results:", err);
      setError("Failed to fetch search results");
      toast({
        title: "Search Error",
        description: "Failed to fetch web search results",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch results when the current query changes
  useEffect(() => {
    if (currentQuery) {
      fetchSearchResults();
    }
  }, [currentQuery]);

  const handleRefresh = () => {
    fetchSearchResults();
    toast({
      title: "Refreshing results",
      description: "Getting the latest search results"
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 flex items-center justify-between border-b">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-nexus-purple" />
          <h3 className="text-sm font-medium">Web Results</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={onClose}
          >
            <SidebarClose className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        {currentQuery && (
          <Badge variant="outline" className="bg-nexus-purple/10 text-xs mb-3">
            Searching for: {currentQuery}
          </Badge>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="h-32 flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-nexus-purple" />
          </div>
        ) : error ? (
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
          <div className="p-4 space-y-3">
            {results.map((result, index) => (
              <Card key={index} className="p-3 hover:shadow-md transition-all">
                <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
                  <h4 className="text-sm font-medium line-clamp-2 hover:text-nexus-purple">
                    {result.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {result.description}
                  </p>
                  <div className="text-xs text-muted-foreground mt-1 truncate">
                    {result.url.replace(/^https?:\/\/(www\.)?/, '')}
                  </div>
                </a>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default WebSearchSidebar;
