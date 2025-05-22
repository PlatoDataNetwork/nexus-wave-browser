
import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Calendar, Clock, Globe, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

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
    
  // Calculate freshness label
  const getFreshnessLabel = (dateString?: string): { label: string; color: string } => {
    if (!dateString) return { label: 'Unknown date', color: 'text-gray-500' };
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        return { label: 'Just now', color: 'text-green-500' };
      } else if (diffInHours < 24) {
        return { label: `${Math.floor(diffInHours)}h ago`, color: 'text-green-500' };
      } else if (diffInHours < 168) { // 7 days
        return { label: `${Math.floor(diffInHours / 24)}d ago`, color: 'text-amber-500' };
      } else {
        return { 
          label: date.toLocaleDateString(), 
          color: 'text-muted-foreground' 
        };
      }
    } catch (e) {
      return { label: dateString, color: 'text-muted-foreground' };
    }
  };
  
  const freshness = getFreshnessLabel(source.timestamp);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent className="w-80 text-sm" side="top">
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium">{source.title || domain}</h4>
            <div className={`text-xs font-medium ${freshness.color}`}>
              {freshness.label}
            </div>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <Globe className="h-3 w-3" />
            <span className="truncate">{domain}</span>
          </div>
          
          {source.snippet && (
            <p className="text-xs text-muted-foreground line-clamp-3 border-l-2 border-nexus-purple/30 pl-2">
              {source.snippet}
            </p>
          )}
          
          <div className="pt-2">
            <motion.a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1 text-nexus-purple hover:underline w-fit"
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ExternalLink className="h-3 w-3" />
              View source
            </motion.a>
          </div>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default SourceHoverCard;
