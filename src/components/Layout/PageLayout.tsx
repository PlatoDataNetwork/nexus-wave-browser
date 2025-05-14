
import React, { useState } from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  const location = useLocation();
  const [isFooterVisible, setIsFooterVisible] = useState(true);
  const isSearchPage = location.pathname === "/search";
  
  // Create a navigation handler to use with the footer
  const handleNavigate = (url: string) => {
    if (onNavigate) {
      console.log(`PageLayout: Navigating to ${url}`);
      onNavigate(url);
    } else {
      console.log(`PageLayout: Navigating to ${url} using React Router`);
      // For internal routes, use React Router
      if (url.startsWith('/')) {
        navigate(url);
      } else {
        // For external URLs, use window.open if no onNavigate function is provided
        window.open(url, '_blank');
      }
    }
  };

  // Toggle footer visibility
  const toggleFooter = () => {
    setIsFooterVisible(prev => !prev);
  };

  // Add a specific class for search page to ensure proper scrolling
  const containerClassName = `flex flex-col ${isSearchPage ? 'h-screen overflow-hidden' : 'h-full'} w-full`;
  const contentClassName = `flex-1 ${isSearchPage ? 'overflow-auto pb-14' : 'h-full'} w-full`;

  return (
    <div className={containerClassName}>
      <div className={contentClassName}>
        {children}
      </div>
      
      {includeFooter && isFooterVisible && (
        <div className={`${isSearchPage ? 'fixed bottom-0 left-0 right-0' : 'mt-auto'} w-full z-10`}>
          <BrowserFooter onNavigate={handleNavigate} onToggleFooter={toggleFooter} isVisible={isFooterVisible} />
        </div>
      )}
      
      {/* Show footer button with updated Medium Purple color (#7B63DD) */}
      {includeFooter && !isFooterVisible && (
        <Button 
          size="sm"
          className="fixed bottom-4 right-4 bg-[#7B63DD] hover:bg-[#6E59A5] text-white font-medium px-3 py-1 rounded-md shadow-lg z-50"
          onClick={toggleFooter}
        >
          Show Footer
        </Button>
      )}
    </div>
  );
};

export default PageLayout;
