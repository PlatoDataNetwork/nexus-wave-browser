
import React, { useState } from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

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
      
      {/* Always show footer but make it render the toggle button which controls visibility */}
      <BrowserFooter 
        onNavigate={onNavigate}
        toggleFooter={toggleFooter}
        isFooterVisible={footerVisible}
      />
    </div>
  );
};

export default PageLayout;
