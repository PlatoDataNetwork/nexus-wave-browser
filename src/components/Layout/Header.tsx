
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Coins, LineChart, Download, Menu } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    
    // Navigate to /app first, then load search in the address bar
    navigate('/app?url=/search');
    
    toast({
      title: "Opening Nexus Search",
      description: "Loading the privacy-focused Nexus Search engine in browser"
    });
  };

  // Mobile navigation menu items
  const navigationItems = [
    { label: "Search", icon: Search, action: handleSearchClick },
    { label: "Browser", icon: Globe, path: "/app" },
    { label: "Token", icon: Coins, path: "/token" },
    { label: "Staking", icon: LineChart, path: "/staking" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-10 sm:h-12 md:h-16 max-w-screen-2xl items-center px-2 sm:px-4">
        {/* Logo and Brand - Mobile Optimized */}
        <div className="mr-2 sm:mr-4 flex items-center flex-shrink-0">
          <Link to="/" className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm md:text-lg font-bold text-white leading-tight">
                {isMobile ? "Nexus" : "Nexus Wave by PlatoAI"}
              </span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        {!isMobile && (
          <nav className="flex-1">
            <ul className="flex gap-1 md:gap-2">
              {navigationItems.map((item) => (
                <li key={item.label}>
                  {item.path ? (
                    <Link to={item.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3"
                      >
                        <item.icon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3"
                      onClick={item.action}
                    >
                      <item.icon className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
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
                  className="text-white hover:bg-white/10 p-2"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48 bg-background border-border">
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
                    className="cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {/* Right side actions - Mobile Optimized */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {!isMobile && (
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-white text-xs sm:text-sm hover:bg-white/10 px-2 sm:px-3"
              >
                Signup
              </Button>
            </Link>
          )}
          <Link to="/downloads">
            <Button 
              variant="macos" 
              size="sm" 
              className="text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 min-h-8 sm:min-h-10"
            >
              {isMobile ? "DL" : "Downloads"}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
