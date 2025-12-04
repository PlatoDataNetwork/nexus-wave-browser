
import React, { useState } from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: React.ReactNode;
  includeFooter?: boolean;
  includeHeader?: boolean;
  onNavigate?: (url: string) => void;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  includeFooter = true,
  includeHeader = true,
  onNavigate 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isFooterVisible, setIsFooterVisible] = useState(!isMobile); // Hide footer by default on mobile
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

  // Add responsive classes for mobile optimization
  const containerClassName = `flex flex-col ${isSearchPage ? 'h-screen overflow-hidden' : 'h-full'} w-full`;
  const contentClassName = `flex-1 ${isSearchPage ? 'overflow-auto pb-14' : 'h-full'} w-full ${isMobile ? 'px-2' : ''}`;

  return (
    <div className={containerClassName}>
      {includeHeader && <Header onNavigate={onNavigate} />}
      <div className={contentClassName}>
        {children}
      </div>
      
      {includeFooter && isFooterVisible && (
        <div className={`${isSearchPage || isMobile ? 'fixed bottom-0 left-0 right-0' : 'mt-auto'} w-full z-10`}>
          <BrowserFooter onNavigate={handleNavigate} onToggleFooter={toggleFooter} isVisible={isFooterVisible} />
        </div>
      )}
      
      {/* Show footer button with mobile optimization */}
      {includeFooter && !isFooterVisible && (
        <Button 
          size={isMobile ? "sm" : "sm"}
          className="fixed bottom-4 right-4 bg-[#7B63DD] hover:bg-[#6E59A5] text-white font-medium px-3 py-1 rounded-md shadow-lg z-50 text-xs sm:text-sm"
          onClick={toggleFooter}
        >
          {isMobile ? "Footer" : "Show Footer"}
        </Button>
      )}
    </div>
  );
};

export default PageLayout;
