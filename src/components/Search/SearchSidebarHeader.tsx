
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, RefreshCw, X, Search, Database, Zap } from "lucide-react";
import { motion } from 'framer-motion';

interface SearchSidebarHeaderProps {
  currentQuery: string;
  onRefresh: () => void;
  onClose: () => void;
  searchStage?: 'query' | 'searching' | 'analyzing' | 'complete';
}

const SearchSidebarHeader: React.FC<SearchSidebarHeaderProps> = ({ 
  currentQuery, 
  onRefresh, 
  onClose,
  searchStage = 'complete'
}) => {
  // Helper function to show appropriate stage indicator
  const renderStageIndicator = () => {
    switch(searchStage) {
      case 'query':
        return (
          <Badge variant="outline" className="bg-nexus-purple/10 text-xs flex items-center gap-1">
            <Search className="h-3 w-3" />
            <span>Preparing search...</span>
          </Badge>
        );
      case 'searching':
        return (
          <Badge variant="outline" className="bg-nexus-purple/20 text-xs flex items-center gap-1">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Globe className="h-3 w-3" />
            </motion.div>
            <span>Searching web...</span>
          </Badge>
        );
      case 'analyzing':
        return (
          <Badge variant="outline" className="bg-nexus-purple/30 text-xs flex items-center gap-1">
            <Database className="h-3 w-3" />
            <span>Analyzing results...</span>
          </Badge>
        );
      case 'complete':
      default:
        return currentQuery ? (
          <Badge variant="outline" className="bg-nexus-purple/10 text-xs flex items-center gap-1">
            <Zap className="h-3 w-3" />
            <span>Results for: {currentQuery}</span>
          </Badge>
        ) : null;
    }
  };

  return (
    <>
      {/* Fixed header */}
      <div className="p-3 flex items-center justify-between border-b sticky top-0 z-10 bg-background">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-nexus-purple" />
          <h3 className="text-sm font-medium">Web Results</h3>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={onRefresh}
            disabled={searchStage === 'searching' || searchStage === 'analyzing'}
          >
            <RefreshCw className={`h-4 w-4 ${searchStage === 'searching' || searchStage === 'analyzing' ? 'animate-spin' : ''}`} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Search query label, also fixed/sticky under the header */}
      <div className="p-3 bg-background/95 backdrop-blur-sm sticky top-[49px] z-10">
        {renderStageIndicator()}
      </div>
    </>
  );
};

export default SearchSidebarHeader;
