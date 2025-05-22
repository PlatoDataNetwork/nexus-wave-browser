
import React from 'react';
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { format } from 'date-fns';

interface SearchResultItemProps {
  result: {
    url: string;
    title: string;
    description: string;
    publishDate?: string;
    sourceName?: string;
    credibilityScore?: number;
    isRecent?: boolean;
  };
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result }) => {
  // Extract domain from URL for display and favicon
  const extractDomain = (url: string) => {
    try {
      const domain = new URL(url).hostname.replace(/^www\./, '');
      return domain;
    } catch (e) {
      return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    }
  };

  // Generate favicon URL
  const getFaviconUrl = (url: string) => {
    const domain = extractDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };
  
  // Format publish date if available
  const formattedDate = result.publishDate ? 
    format(new Date(result.publishDate), 'MMM d, yyyy') : 
    null;

  // Determine credibility indicator color
  const getCredibilityColor = () => {
    const score = result.credibilityScore || 0;
    if (score > 80) return "bg-green-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <Card className="p-3 hover:shadow-md transition-all border-l-4 border-l-nexus-purple/50 group">
      <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <div className="relative">
              <img 
                src={getFaviconUrl(result.url)} 
                alt={`${extractDomain(result.url)} favicon`}
                className="h-5 w-5 rounded-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%23F0F0F0' /%3E%3Ctext x='8' y='12' font-size='12' text-anchor='middle' fill='%23666666'%3E?%3C/text%3E%3C/svg%3E";
                }}
              />
              {result.credibilityScore && (
                <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${getCredibilityColor()} border border-background`}></div>
              )}
            </div>
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-medium line-clamp-2 group-hover:text-nexus-purple transition-colors">{result.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-3">{result.description}</p>
            
            <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
              <span className="font-medium text-muted-foreground/70 truncate">{result.sourceName || extractDomain(result.url)}</span>
              
              {formattedDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                  {result.isRecent ? (
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-nexus-purple" />
                      {formattedDate}
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formattedDate}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
};

export default SearchResultItem;
