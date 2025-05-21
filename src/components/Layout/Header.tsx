
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Coins, LineChart, Download, Sparkles } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  const isSearchRoute = location.pathname.startsWith('/search');
  const isWaveSearchRoute = location.pathname.startsWith('/wave-search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Don't display header on app routes that have their own browser chrome
  const shouldHideHeader = isAppRoute || isSearchRoute || isWaveSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }
  
  // Determine if the current path is active
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo and Brand */}
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" 
                alt="Nexus Wave Logo" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className="hidden text-xl font-bold text-white sm:inline-block">
              Nexus Wave
            </span>
          </Link>
        </div>
        
        {/* Main Navigation - Updated menu items with Wave Search added */}
        <nav className="flex-1">
          <ul className="flex gap-1 md:gap-2">
            <li>
              <Link to="/search">
                <Button
                  variant={isActive('/search') ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Search className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Search</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/wave-search">
                <Button
                  variant={isActive('/wave-search') ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Sparkles className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Wave</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/app">
                <Button
                  variant={isActive('/app') ? "secondary" : "ghost"}
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
                  variant={isActive('/token') ? "secondary" : "ghost"}
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
                  variant={isActive('/staking') ? "secondary" : "ghost"}
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
              variant={isActive('/profile') ? "secondary" : "ghost"}
              size="sm"
              className="text-white"
            >
              Signup
            </Button>
          </Link>

          <Link to="/downloads">
            <Button variant="macos" size="sm">
              Download
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
