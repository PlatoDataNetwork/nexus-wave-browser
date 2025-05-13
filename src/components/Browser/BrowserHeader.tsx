
import React, { useState, useEffect } from "react";
import TabBar from "./TabBar";
import AddressBar from "./AddressBar";
import Bookmarks from "./Bookmarks";
import { Tab } from "@/lib/dummyData";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

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
  canGoForward
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

  return (
    <div className="flex flex-col">
      {/* Logo and DateTime Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-nexus-dark-blue border-b border-border">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:text-nexus-purple transition-colors">
          <div className="text-lg font-bold bg-gradient-to-r from-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
            Nexus Wave
          </div>
        </Link>
        
        {/* Date and Time */}
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
      <Bookmarks onNavigate={handleNavigate} />
    </div>
  );
};

export default BrowserHeader;
