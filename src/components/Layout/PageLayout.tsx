
import React, { useState, useEffect } from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import Header from "./Header";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  const [isFooterVisible, setIsFooterVisible] = useState(!isMobile); // Hide footer by default on mobile
  const isSearchPage = location.pathname === "/search";
  
  // Automatically hide footer on mobile devices and show on desktop
  useEffect(() => {
    setIsFooterVisible(!isMobile);
  }, [isMobile]);
  
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

  // Mobile-optimized responsive classes
  const containerClassName = `flex flex-col ${isSearchPage ? 'h-screen overflow-hidden' : 'min-h-screen'} w-full safe-area-padding`;
  const contentClassName = `flex-1 ${isSearchPage ? 'overflow-auto pb-14' : ''} w-full ${isMobile ? 'px-1 sm:px-2' : 'px-4'}`;

  return (
    <div className={containerClassName}>
      <Header onNavigate={onNavigate} />
      <div className={contentClassName}>
        {children}
      </div>
      
      {includeFooter && isFooterVisible && (
        <div className={`${isSearchPage || isMobile ? 'fixed bottom-0 left-0 right-0' : 'mt-auto'} w-full z-10 safe-area-padding`}>
          <BrowserFooter onNavigate={handleNavigate} onToggleFooter={toggleFooter} isVisible={isFooterVisible} />
        </div>
      )}
      
      {/* Mobile-optimized footer toggle button */}
      {includeFooter && !isFooterVisible && (
        <Button 
          size="sm"
          className="fixed bottom-4 right-4 bg-[#7B63DD] hover:bg-[#6E59A5] text-white font-medium px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg shadow-lg z-50 text-xs sm:text-sm min-h-10 touch-manipulation"
          onClick={toggleFooter}
        >
          {isMobile ? "⬆️" : "Show Footer"}
        </Button>
      )}
    </div>
  );
};

export default PageLayout;
