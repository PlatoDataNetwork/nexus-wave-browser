
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Coins, LineChart, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onNavigate?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isAppRoute = location.pathname.startsWith('/app');
  const isSearchRoute = location.pathname.startsWith('/search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Only hide header on search, extension-store, and history routes, but show on app routes
  const shouldHideHeader = isSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }
  
  // Determine if the current path is active
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  const handleSearchClick = () => {
    console.log("Search clicked, navigating to /app with search URL");
    
    // Navigate to /app first, then load search in the address bar
    navigate('/app?url=/search');
    
    toast({
      title: "Opening Nexus Search",
      description: "Loading the privacy-focused Nexus Search engine in browser"
    });
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
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
                onClick={handleSearchClick}
              >
                <Search className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
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
