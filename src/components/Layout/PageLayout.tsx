
import React from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";

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
  
  // Create a navigation handler to use with the footer
  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    } else {
      navigate(url);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4">
          {children}
        </div>
      </ScrollArea>
      
      {includeFooter && <BrowserFooter onNavigate={handleNavigate} />}
    </div>
  );
};

export default PageLayout;
