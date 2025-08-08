
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Menu } from "lucide-react";
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
  };

  // Types for nav items to satisfy TS
  type NavItem = { label: string; icon: any; action?: () => void; path?: string; iconClass?: string };

  // Mobile navigation menu items
  const baseItems: NavItem[] = [
    { label: "Search", icon: Search, action: handleSearchClick },
    { label: "Browser", icon: Globe, path: "/app" },
    { label: "Protocols", icon: Globe, action: () => navigate('/app?openProtocols=1') },
  ];

  const nexusItems: NavItem[] = [
    { label: "Nexus AI", icon: Globe, action: () => { toast({ title: "Nexus AI", description: "URL coming soon. Opening browser." }); navigate('/app'); }, iconClass: "text-popover-foreground" },
    { label: "NexusArk", icon: Globe, action: () => { toast({ title: "NexusArk", description: "URL coming soon. Opening browser." }); navigate('/app'); }, iconClass: "text-secondary" },
    { label: "NexusCarbon", icon: Globe, action: () => navigate(`/app?url=${encodeURIComponent('https://nexus-wave-carbon.vercel.app/')}`), iconClass: "text-destructive" },
    { label: "NexusChain", icon: Globe, action: () => { toast({ title: "NexusChain", description: "URL coming soon. Opening browser." }); navigate('/app'); }, iconClass: "text-muted-foreground" },
    { label: "NexusCode", icon: Globe, action: () => navigate(`/app?url=${encodeURIComponent('https://nexus-web3-mirror.vercel.app/')}`), iconClass: "text-accent" },
    { label: "NexusMusic", icon: Globe, action: () => { toast({ title: "NexusMusic", description: "URL coming soon. Opening browser." }); navigate('/app'); }, iconClass: "text-card-foreground" },
    { label: "NexusStake", icon: Globe, action: () => { toast({ title: "NexusStake", description: "URL coming soon. Opening browser." }); navigate('/app'); }, iconClass: "text-ring" },
    { label: "NexusTrade", icon: Globe, action: () => navigate(`/app?url=${encodeURIComponent('https://nexus-trade-henna.vercel.app/')}`), iconClass: "text-primary" },
  ];

  const navigationItems: NavItem[] = [
    ...baseItems,
    ...[...nexusItems].sort((a, b) => a.label.localeCompare(b.label))
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-12 sm:h-16 max-w-screen-2xl items-center px-2 sm:px-4">
        {/* Brand removed per request */}
        <div className="mr-2 sm:mr-4 flex-shrink-0" />
        
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
                        className="text-white text-xs sm:text-sm"
                      >
                        <item.icon className={`mr-1 h-3 w-3 sm:h-4 sm:w-4 ${item.iconClass ?? ''}`} />
                        <span className="hidden sm:inline">{item.label}</span>
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white text-xs sm:text-sm"
                      onClick={item.action}
                    >
                      <item.icon className={`mr-1 h-3 w-3 sm:h-4 sm:w-4 ${item.iconClass ?? ''}`} />
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
                    <item.icon className={`mr-2 h-4 w-4 ${item.iconClass ?? ''}`} />
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        
        {/* Right side actions removed per request */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0" />
      </div>
    </header>
  );
};

export default Header;
