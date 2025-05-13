
import React from "react";
import TabBar from "./TabBar";
import AddressBar from "./AddressBar";
import Bookmarks from "./Bookmarks";
import { Tab } from "@/lib/dummyData";

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
      {/* Logo and DateTime Bar are now removed from here since they're moved to the title bar */}
      
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
