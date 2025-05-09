
import React, { useState } from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageLayoutProps {
  children: React.ReactNode;
  includeFooter?: boolean;
  onNavigate?: (url: string) => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  includeFooter = true, 
  onNavigate 
}) => {
  const [footerVisible, setFooterVisible] = useState(true);
  
  const toggleFooter = () => {
    setFooterVisible(prev => !prev);
  };
  
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
      
      {/* Only show footer if visible */}
      {footerVisible && <BrowserFooter 
        onNavigate={onNavigate}
        toggleFooter={toggleFooter}
        isFooterVisible={footerVisible}
      />}
      
      {/* If footer is not visible, show toggle button */}
      {!footerVisible && (
        <div className="flex justify-center py-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFooter}
            className="h-6 rounded-full text-green-500 bg-muted/50 hover:bg-muted"
          >
            <ChevronUp className="h-4 w-4 text-green-500" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default PageLayout;
