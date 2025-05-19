
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, RefreshCw, X } from "lucide-react";

interface SearchSidebarHeaderProps {
  currentQuery: string;
  onRefresh: () => void;
  onClose: () => void;
}

const SearchSidebarHeader: React.FC<SearchSidebarHeaderProps> = ({ 
  currentQuery, 
  onRefresh, 
  onClose 
}) => {
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
          >
            <RefreshCw className="h-4 w-4" />
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
      <div className="p-3 bg-background sticky top-[49px] z-10">
        {currentQuery && (
          <Badge variant="outline" className="bg-nexus-purple/10 text-xs">
            Searching for: {currentQuery}
          </Badge>
        )}
      </div>
    </>
  );
};

export default SearchSidebarHeader;
