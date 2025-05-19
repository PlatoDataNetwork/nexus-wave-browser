
import React from 'react';
import { Card } from "@/components/ui/card";

interface SearchResultItemProps {
  result: {
    url: string;
    title: string;
    description: string;
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

  return (
    <Card className="p-3 hover:shadow-md transition-all">
      <a href={result.url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <img 
              src={getFaviconUrl(result.url)} 
              alt={`${extractDomain(result.url)} favicon`}
              className="h-4 w-4"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Crect width='16' height='16' fill='%23F0F0F0' /%3E%3Ctext x='8' y='12' font-size='12' text-anchor='middle' fill='%23666666'%3E?%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
          <div className="flex-grow">
            <h4 className="text-sm font-medium line-clamp-2 hover:text-nexus-purple">{result.title}</h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{result.description}</p>
            <div className="text-xs text-muted-foreground mt-1 truncate flex items-center gap-1">
              <span className="font-medium text-muted-foreground/70">{extractDomain(result.url)}</span>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
};

export default SearchResultItem;
