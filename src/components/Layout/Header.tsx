
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onNavigate?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const location = useLocation();
  
  const isSearchRoute = location.pathname.startsWith('/search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Hide header on search, extension-store, and history routes only
  const shouldHideHeader = isSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-12 sm:h-16 max-w-screen-2xl items-center justify-between px-2 sm:px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src="/favicon.png" alt="TMRW" className="h-8 w-8 neon-icon-glow" />
          <span className="font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap text-foreground">
            TMRW W3AI
          </span>
        </div>
        
        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/token">
            <Button 
              size="sm" 
              className="bg-nexus-blue hover:bg-nexus-deep-blue text-white font-semibold px-4"
            >
              Token
            </Button>
          </Link>
          <Link to="/staking">
            <Button 
              size="sm" 
              className="bg-nexus-blue hover:bg-nexus-deep-blue text-white font-semibold px-4"
            >
              Staking
            </Button>
          </Link>
          <Link to="/ai-features">
            <Button 
              size="sm" 
              className="bg-nexus-blue hover:bg-nexus-deep-blue text-white font-semibold px-4"
            >
              W3 AI
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
