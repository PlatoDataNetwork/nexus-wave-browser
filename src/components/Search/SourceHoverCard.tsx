
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Calendar, Clock } from 'lucide-react';

interface Source {
  title: string;
  url: string;
  snippet?: string;
  timestamp?: string;
}

interface SourceHoverCardProps {
  source: Source;
  children: React.ReactNode;
}

const SourceHoverCard: React.FC<SourceHoverCardProps> = ({ source, children }) => {
  // Extract domain for display
  const getDomainFromUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      return url.split('/')[0];
    }
  };
  
  const domain = getDomainFromUrl(source.url);
  const timestamp = source.timestamp 
    ? new Date(source.timestamp).toLocaleString() 
    : 'Unknown time';

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm" side="top">
        <div className="space-y-2">
          <h4 className="font-medium">{source.title || domain}</h4>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{timestamp}</span>
          </div>
          
          {source.snippet && (
            <p className="text-xs text-muted-foreground line-clamp-3">
              {source.snippet}
            </p>
          )}
          
          <div className="pt-2">
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-nexus-purple hover:underline"
            >
              View source →
            </a>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SourceHoverCard;
