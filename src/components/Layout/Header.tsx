
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Coins, LineChart, Clock, Calendar, Moon, Home, UserRound, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeaderProps {
  onNavigate?: (url: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme } = useTheme();
  
  const isAppRoute = location.pathname.startsWith('/app');
  const isSearchRoute = location.pathname.startsWith('/search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Hide header on search, extension-store, and history routes only
  const shouldHideHeader = isSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }
  
  // State for current time and date
  const [currentTime, setCurrentTime] = React.useState(new Date());
  
  // Update time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Format time as HH:MM:SS
  const formattedTime = currentTime.toLocaleTimeString();
  
  // Format date as Day, Month DD, YYYY
  const formattedDate = currentTime.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
  
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

  const handleGoHome = () => {
    navigate('/');
  };
  
  const handleMenuAction = (action: string) => {
    switch(action) {
      case "profile":
        navigate("/profile");
        break;
      case "settings":
        navigate("/settings");
        break;
      case "history":
        navigate("/history");
        break;
      case "extensions":
        navigate("/extensions");
        break;
      default:
        toast({
          title: `Action: ${action}`,
          description: "This feature is coming soon",
        });
    }
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
        
        {/* Center section - DateTime (only show on /app route) */}
        {isAppRoute && (
          <div className="flex items-center gap-4 text-sm text-white mx-4">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-nexus-purple" />
              <span className="font-mono">{formattedTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-nexus-purple" />
              <span>{formattedDate}</span>
            </div>
          </div>
        )}
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Show browser controls only on /app route */}
          {isAppRoute && (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 bg-nexus-purple/10 hover:bg-nexus-purple/20"
                    onClick={handleGoHome}
                  >
                    <Home className="h-5 w-5 text-nexus-purple" />
                    <span className="sr-only">Go to Homepage</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Go to Homepage</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 bg-nexus-purple/10 hover:bg-nexus-purple/20"
                  >
                    <Moon className="h-5 w-5 text-nexus-purple" />
                    <span className="sr-only">Dark Mode</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dark Mode</p>
                </TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 bg-nexus-purple/10 hover:bg-nexus-purple/20"
                    onClick={() => navigate("/settings-docs")}
                  >
                    <Settings className="h-5 w-5 text-nexus-purple" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Open Settings</p>
                </TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="rounded-full h-8 w-8 bg-nexus-purple/10 hover:bg-nexus-purple/20"
                  >
                    <UserRound className="h-5 w-5 text-nexus-purple" />
                    <span className="sr-only">User settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56" 
                  align="end"
                  sideOffset={8}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">User</p>
                      <p className="text-xs text-muted-foreground">zephyr@platodata.io</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => handleMenuAction("profile")}>
                      <UserRound className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleMenuAction("settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
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
