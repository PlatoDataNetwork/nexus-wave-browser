
import React, { useState } from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  
  // Create a navigation handler to use with the footer
  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      navigate(url);
    }
  };

  // Toggle footer visibility
  const toggleFooter = () => {
    setIsFooterVisible(prev => !prev);
  };

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
      
      {includeFooter && isFooterVisible && <BrowserFooter onNavigate={handleNavigate} onToggleFooter={toggleFooter} isVisible={isFooterVisible} />}
      
      {/* Show footer button that appears when the footer is hidden */}
      {includeFooter && !isFooterVisible && (
        <Button 
          size="sm"
          className="fixed bottom-4 right-4 bg-green-500 hover:bg-green-600 text-white font-medium px-3 py-1 rounded-md shadow-lg z-50"
          onClick={toggleFooter}
        >
          Show Footer
        </Button>
      )}
    </div>
  );
};

export default PageLayout;
