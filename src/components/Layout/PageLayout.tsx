
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
      
      {/* Toggle button for footer visibility */}
      <div className="flex justify-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={toggleFooter}
          className="h-6 my-1 rounded-full bg-muted/50 hover:bg-muted"
        >
          {footerVisible ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Only show footer if visible */}
      {footerVisible && <BrowserFooter onNavigate={onNavigate} />}
    </div>
  );
};

export default PageLayout;
