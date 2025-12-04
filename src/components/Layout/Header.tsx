
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

interface HeaderProps {
  onNavigate?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const isAppRoute = location.pathname.startsWith('/app');
  const isSearchRoute = location.pathname.startsWith('/search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Hide header on search, extension-store, and history routes only
  const shouldHideHeader = isSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }
  
  const handleSearchClick = () => {
    console.log("Search clicked, navigating to /app with search URL");
    navigate('/app?url=/search');
  };

  // Navigation items without icons
  const navigationItems = [
    { label: "Search", action: handleSearchClick },
    { label: "Browser", path: "/app" },
    { label: "Token", path: "/token" },
    { label: "Staking", path: "/staking" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-12 sm:h-16 max-w-screen-2xl items-center justify-between px-2 sm:px-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <img src="/favicon.png" alt="Plato" className="h-8 w-8" />
          <span className="text-white font-bold text-sm sm:text-base md:text-lg whitespace-nowrap">
            Plato W3 AI Browser
          </span>
        </div>
        
        {/* Center: Navigation */}
        {!isMobile && (
          <nav className="flex-1 flex justify-center">
            <ul className="flex gap-2 md:gap-6">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  {item.path ? (
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white text-sm hover:bg-white/10"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white text-sm hover:bg-white/10"
                      onClick={item.action}
                    >
                      {item.label}
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Mobile Navigation Menu */}
        {isMobile && (
          <div className="flex-1 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                {navigationItems.map((item) => (
                  <DropdownMenuItem
                    key={item.label}
                    onClick={() => {
                      if (item.path) {
                        navigate(item.path);
                      } else if (item.action) {
                        item.action();
                      }
                    }}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {/* Right: W3 AI Button */}
        <div className="flex items-center flex-shrink-0">
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
