
import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import SourceHoverCard from './SourceHoverCard';
import { motion } from 'framer-motion';

interface Source {
  title: string;
  url: string;
  snippet?: string;
  timestamp?: string;
}

interface MessageSourcesListProps {
  sources: Source[];
}

const MessageSourcesList: React.FC<MessageSourcesListProps> = ({ sources }) => {
  // Don't render if no sources are provided
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

  // Limit sources to maximum 5 for display
  const displaySources = sources.slice(0, 5);
  const hasMoreSources = sources.length > 5;
  const additionalSourcesCount = sources.length - 5;

  // Animation variants for sources list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
      initial="hidden"
      animate="show"
      variants={container}
    >
      <div className="flex items-center gap-1 text-xs font-medium mb-2">
        <Clock className="h-3 w-3" />
        <span>Sources:</span>
      </div>
      <ScrollArea className="w-full" style={{ overflowX: 'auto' }}>
        <motion.div className="flex gap-2 pb-1" variants={container}>
          {displaySources.map((source, index) => {
            if (!source.url) {
              console.warn("Source missing URL:", source);
              return null;
            }
            
            const domain = getDomainFromUrl(source.url);
            const faviconUrl = getFaviconUrl(domain);
            
            return (
              <motion.div key={index} variants={item} className="flex-shrink-0">
                <SourceHoverCard source={source}>
                  <a 
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
                    <span className="max-w-24 truncate">
                      {domain}
                    </span>
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </SourceHoverCard>
              </motion.div>
            );
          })}
          
          {hasMoreSources && (
            <motion.span 
              variants={item}
              className="flex-shrink-0 text-xs text-muted-foreground px-2 py-1 border border-border rounded-full hover:bg-secondary/50 transition-colors cursor-help"
              title={`${sources.length} sources in total`}
            >
              +{additionalSourcesCount} more
            </motion.span>
          )}
        </motion.div>
      </ScrollArea>
    </motion.div>
  );
};

export default MessageSourcesList;
