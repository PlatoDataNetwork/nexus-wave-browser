
import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';

interface Source {
  title: string;
  url: string;
}

interface MessageSourcesListProps {
  sources: Source[];
}

const MessageSourcesList: React.FC<MessageSourcesListProps> = ({ sources }) => {
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

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 text-xs font-medium mb-2">
        <Clock className="h-3 w-3" />
        <span>Sources:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sources.map((source, index) => {
          if (!source.url) {
            console.warn("Source missing URL:", source);
            return null;
          }
          
          const domain = getDomainFromUrl(source.url);
          const faviconUrl = getFaviconUrl(domain);
          
          return (
            <a 
              key={index} 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center gap-1 px-2 py-1 bg-background rounded-full text-xs hover:bg-muted transition-colors group border border-border"
            >
              <img 
                src={faviconUrl} 
                alt={domain} 
                className="h-4 w-4 rounded-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="truncate max-w-[150px]">
                {source.title || domain}
              </span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default MessageSourcesList;
