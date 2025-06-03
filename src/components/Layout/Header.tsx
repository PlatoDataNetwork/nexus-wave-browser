
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Coins, LineChart, Download, Compass, Palette, BarChart3 } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const isSearchRoute = location.pathname.startsWith('/search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Don't display header on app routes that have their own browser chrome
  const shouldHideHeader = isAppRoute || isSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }
  
  // Determine if the current path is active
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  // Handle Discovery link click to open in browser
  const handleDiscoveryClick = () => {
    window.location.href = '/app?url=https://ai.platodata.io';
  };

  // Handle PlatoAI Creator link click to open in browser
  const handleCreatorClick = () => {
    window.location.href = '/app?url=https://dashboard.platodata.io';
  };

  // Handle PlatoAI Analyst link click to open in browser
  const handleAnalystClick = () => {
    window.location.href = '/app?url=https://analyst.platodata.io';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo and Brand */}
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col">
              <span className="text-lg font-bold text-white leading-tight">
                Nexus Wave by PlatoAI
              </span>
            </div>
          </Link>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1">
          <ul className="flex gap-1 md:gap-2">
            <li>
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Search className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </Link>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={handleCreatorClick}
              >
                <Palette className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">PlatoAI Creator</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={handleAnalystClick}
              >
                <BarChart3 className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">PlatoAI Analyst</span>
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={handleDiscoveryClick}
              >
                <Compass className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Discovery</span>
              </Button>
            </li>
            <li>
              <Link to="/app">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Globe className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Browser</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/token">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Coins className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Token</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/staking">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <LineChart className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Staking</span>
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Link to="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
            >
              Signup
            </Button>
          </Link>
          <Link to="/downloads">
            <Button variant="macos" size="sm">
              Downloads
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
