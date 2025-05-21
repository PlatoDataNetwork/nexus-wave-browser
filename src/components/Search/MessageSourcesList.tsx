
import React, { useState } from 'react';
import { Clock, ExternalLink, Shield, Calendar, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Source {
  title: string;
  url: string;
  date?: string;
  trustScore?: number;
}

interface MessageSourcesListProps {
  sources: Source[];
  expanded?: boolean;
}

const MessageSourcesList: React.FC<MessageSourcesListProps> = ({ 
  sources,
  expanded = false
}) => {
  if (!sources || sources.length === 0) {
    return null;
  }

  // Extract domain from URL for favicon
  const getDomainFromUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      console.error("Error parsing URL:", url, e);
      return url.split('/')[0];
    }
  };

  // Get favicon URL from domain
  const getFaviconUrl = (domain: string): string => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };

  // Format date for display
  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return 'Unknown date';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  // Generate trust score badge
  const getTrustScoreBadge = (score?: number): JSX.Element => {
    if (score === undefined) return <></>;
    
    let color = 'text-amber-500';
    if (score >= 80) color = 'text-green-500';
    else if (score < 50) color = 'text-red-500';
    
    return (
      <div className="flex items-center gap-0.5">
        <Award className={`h-3 w-3 ${color}`} />
        <span className={`text-xs ${color}`}>{score}</span>
      </div>
    );
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-xs font-medium">
          <Clock className="h-3 w-3" />
          <span>Sources:</span>
        </div>
        <div className="text-xs text-muted-foreground">
          {sources.length} {sources.length === 1 ? 'source' : 'sources'} used
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sources.map((source, index) => {
          if (!source.url) {
            console.warn("Source missing URL:", source);
            return null;
          }
          
          const domain = getDomainFromUrl(source.url);
          const faviconUrl = getFaviconUrl(domain);
          
          return (
            <div key={index} className="group">
              <a 
                href={source.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`flex items-center gap-2 p-2 bg-background rounded-lg text-sm hover:bg-muted transition-colors group border border-border ${expanded ? 'flex-col items-start' : ''}`}
              >
                <div className="flex items-center gap-2 w-full">
                  <img 
                    src={faviconUrl} 
                    alt={domain} 
                    className="h-4 w-4 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <span className={`${expanded ? 'font-medium' : 'truncate max-w-[200px]'}`}>
                    {source.title || domain}
                  </span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                </div>
                
                {expanded && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pl-5 mt-1">
                    {source.date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(source.date)}</span>
                      </div>
                    )}
                    {source.trustScore !== undefined && getTrustScoreBadge(source.trustScore)}
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>{domain}</span>
                    </div>
                  </div>
                )}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageSourcesList;
