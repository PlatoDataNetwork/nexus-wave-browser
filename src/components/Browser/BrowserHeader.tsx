import React, { useState, useEffect } from "react";
import TabBar from "./TabBar";
import AddressBar from "./AddressBar";
import Bookmarks from "./Bookmarks";
import { Tab } from "@/lib/dummyData";
import { Link } from "react-router-dom";
import { Clock, Calendar, Maximize2, Minimize2, BookmarkX } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  bookmarksBarState = "visible",
  onToggleBookmarksBar
}) => {
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
    <div className="flex flex-col">
      {/* Logo and DateTime Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-nexus-dark-blue border-b border-border">
        {/* Title on left */}
        <div className="flex items-center gap-2">
          <div className="text-sm text-white">
            Nexus Wave Browser - Web3 V2.1
          </div>
        </div>
        
        {/* Empty middle section for balance */}
        <div className="flex-1"></div>
        
        {/* Date and Time on right */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-nexus-purple" />
            <span className="font-mono">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-nexus-purple" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      
      <TabBar
        tabs={tabs}
        onAddTab={onAddTab}
        onCloseTab={onCloseTab}
        onActivateTab={onActivateTab}
      />
      <div className="flex-none">
        <AddressBar
          currentUrl={currentUrl}
          onNavigate={handleNavigate}
          onGoBack={onGoBack}
          onGoForward={onGoForward}
          onRefresh={onRefresh}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
      </div>
      
      {/* Bookmarks bar with toggle button */}
      {bookmarksBarState !== "hidden" && (
        <div className="relative">
          {/* Bookmarks toggle button */}
          {onToggleBookmarksBar && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2 z-10 h-5 w-5 rounded-full bg-muted/80 hover:bg-muted"
                  onClick={onToggleBookmarksBar}
                >
                  {getBookmarksBarIcon()}
                  <span className="sr-only">{getBookmarksBarTooltip()}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{getBookmarksBarTooltip()}</p>
              </TooltipContent>
            </Tooltip>
          )}
          
          {/* Show full or minimized bookmarks based on state */}
          {bookmarksBarState === "visible" ? (
            <Bookmarks onNavigate={handleNavigate} />
          ) : (
            <div className="flex items-center px-4 py-1 border-b border-border bg-secondary/20">
              <span className="text-xs text-muted-foreground">Bookmarks minimized</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BrowserHeader;
