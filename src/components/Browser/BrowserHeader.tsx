
import React, { useState, useEffect } from "react";

import AddressBar from "./AddressBar";

import { Tab } from "@/lib/dummyData";
import { Link, useNavigate } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  Maximize2, 
  Minimize2, 
  BookmarkX,
  UserRound,
  Settings,
  AppWindow,
  EyeOff,
  Torus,
  Star,
  Wallet,
  Shield,
  LayoutPanelLeft,
  Key,
  History,
  Bookmark,
  Download,
  Puzzle,
  Trash,
  HelpCircle,
  Moon,
  Home,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  MoreVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";
import BuyNFW3Button from "@/components/Swap/BuyNFW3Button";
import ProtocolsMenu from "./ProtocolsMenu";

// Removed duplicate import of useNavigate

interface BrowserHeaderProps {
  tabs: Tab[];
  currentUrl: string;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onActivateTab: (id: string) => void;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  bookmarksBarState?: "visible" | "minimized" | "hidden";
  onToggleBookmarksBar?: () => void;
}

// Create a DateTime component that can be used independently
export const DateTime: React.FC = () => {
  // State for current time and date
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  useEffect(() => {
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

  return (
    <div className="flex items-center gap-4 text-sm text-white">
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4 text-nexus-purple" />
        <span className="font-mono">{formattedTime}</span>
      </div>
      <div className="flex items-center gap-1">
        <Calendar className="h-4 w-4 text-nexus-purple" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

// Create a ThemeToggle component - now just a display element
export const ThemeToggle: React.FC = () => {
  const { theme } = useTheme();
  
  return (
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
  );
};

// Create a HomeButton component
export const HomeButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGoHome = () => {
    navigate('/');
  };
  
  return (
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
  );
};

// Create a UserMenu component
export const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleMenuAction("new-window")}>
            <AppWindow className="mr-2 h-4 w-4" />
            <span>New Window</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("incognito")}>
            <EyeOff className="mr-2 h-4 w-4" />
            <span>New Incognito Window</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => handleMenuAction("web3")}>
            <Torus className="mr-2 h-4 w-4" />
            <span>Web3</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("bookmarks")}>
            <Star className="mr-2 h-4 w-4" />
            <span>Bookmarks</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("wallet")}>
            <Wallet className="mr-2 h-4 w-4" />
            <span>Wallet</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("shields")}>
            <Shield className="mr-2 h-4 w-4" />
            <span>Shields & Privacy</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleMenuAction("extensions")}>
            <Puzzle className="mr-2 h-4 w-4" />
            <span>Extensions</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleMenuAction("history")}>
          <History className="mr-2 h-4 w-4" />
          <span>History</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleMenuAction("help")}>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help & Feedback</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Create a Settings button component
export const SettingsButton: React.FC = () => {
  const navigate = useNavigate();
  
  const handleOpenSettings = () => {
    navigate("/settings-docs");
  };
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-8 w-8 bg-nexus-purple/10 hover:bg-nexus-purple/20"
          onClick={handleOpenSettings}
        >
          <Settings className="h-5 w-5 text-nexus-purple" />
          <span className="sr-only">Settings</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Open Settings</p>
      </TooltipContent>
    </Tooltip>
  );
};

const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  tabs,
  currentUrl,
  onAddTab,
  onCloseTab,
  onActivateTab,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  canGoBack,
  canGoForward,
  bookmarksBarState,
  onToggleBookmarksBar
}) => {
  // Ensure navigation handler properly handles URLs
  const handleNavigate = (url: string) => {
    console.log(`BrowserHeader: Navigation requested to ${url}`);
    
    // Format URL if needed
    let formattedUrl = url;
    
    // If URL doesn't start with http(s):// or /, add https://
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      formattedUrl = `https://${url}`;
    }
    
    // Pass the formatted URL to the navigation handler
    onNavigate(formattedUrl);
  };

  // Get the appropriate icon for the bookmarks bar toggle button
  const getBookmarksBarIcon = () => {
    switch (bookmarksBarState) {
      case "visible": return <Minimize2 className="h-4 w-4" />;
      case "minimized": return <BookmarkX className="h-4 w-4" />;
      case "hidden": return <Maximize2 className="h-4 w-4" />;
      default: return <Minimize2 className="h-4 w-4" />;
    }
  };

  // Get the tooltip text for the bookmarks bar toggle button
  const getBookmarksBarTooltip = () => {
    switch (bookmarksBarState) {
      case "visible": return "Minimize bookmarks";
      case "minimized": return "Hide bookmarks";
      case "hidden": return "Show bookmarks";
      default: return "Bookmarks options";
    }
  };

  return (
    <div className="flex flex-col bg-background border-b border-border">
      {/* Navigation and Address Bar */}
      <div className="flex items-center gap-2 p-2">
        <ProtocolsMenu onNavigate={handleNavigate} />
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoBack}
            disabled={!canGoBack}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoForward}
            disabled={!canGoForward}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Address Bar */}
        <div className="flex-1">
          <AddressBar 
            currentUrl={currentUrl} 
            onNavigate={onNavigate}
            onGoBack={onGoBack}
            onGoForward={onGoForward}
            onRefresh={onRefresh}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Bookmarks toggle removed for cleaner UI */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};

export default BrowserHeader;
