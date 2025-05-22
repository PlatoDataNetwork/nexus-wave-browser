
import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from 'framer-motion';
import { Globe, Search, ArrowRight } from 'lucide-react';

interface WebResearchCardProps {
  query: string;
  isSearching: boolean;
  results: Array<{title: string, url: string, snippet: string}>;
}

const WebResearchCard: React.FC<WebResearchCardProps> = ({ query, isSearching, results }) => {
  // Animation for search indicators
  const dotVariants = {
    animate: (i: number) => ({
      opacity: [0.2, 1, 0.2],
      transition: {
        delay: i * 0.15,
        duration: 0.8,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    })
  };
  
  // Animation for search terms
  const termVariants = {
    initial: { opacity: 0, y: -5 },
    animate: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      } 
    })
  };
  
  // Generate search terms based on the query
  const generateSearchTerms = (query: string) => {
    const terms = query.split(' ');
    if (terms.length <= 3) return [query];
    
    // Create combinations of terms
    const combinations = [
      query,
      `"${query}"`,
      `${query} latest`,
      `${query} facts`
    ];
    
    return combinations.slice(0, 3);
  };
  
  const searchTerms = generateSearchTerms(query);
  
  return (
    <Card className="overflow-hidden bg-gradient-to-r from-nexus-purple/5 to-transparent border border-nexus-purple/20 mb-3">
      <div className="p-3">
        {isSearching ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm text-nexus-purple">
              <Search className="h-4 w-4" />
              <span className="font-medium">Researching web for information</span>
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Searching</span>
              <div className="flex">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={dotVariants}
                    animate="animate"
                    className="mx-0.5 text-nexus-purple"
                  >
                    •
                  </motion.span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1 mt-1">
              {searchTerms.map((term, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={termVariants}
                  initial="initial"
                  animate="animate"
                  className="bg-nexus-purple/10 text-nexus-purple text-xs px-2 py-0.5 rounded-full flex items-center"
                >
                  <span className="max-w-[150px] truncate">{term}</span>
                  <ArrowRight className="h-3 w-3 ml-1 animate-pulse-slow" />
                </motion.div>
              ))}
            </div>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <Globe className="h-4 w-4 text-nexus-purple" />
              <span className="font-medium">Web search results</span>
            </div>
            
            <div className="max-h-[120px] overflow-y-auto space-y-2 pr-1">
              {results.slice(0, 3).map((result, index) => (
                <a 
                  key={index} 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block text-xs hover:bg-nexus-purple/5 p-1 rounded transition-colors"
                >
                  <div className="font-medium text-nexus-purple truncate">{result.title}</div>
                  <div className="text-muted-foreground line-clamp-1">{result.snippet}</div>
                </a>
              ))}
            </div>
            
            {results.length > 3 && (
              <div className="text-xs text-muted-foreground border-t border-border/30 pt-1 text-right">
                + {results.length - 3} more results
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>No web results found</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WebResearchCard;
