
import React, { useState } from "react";
import BrowserHeader, { DateTime, UserMenu, SettingsButton, ThemeToggle, HomeButton } from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";
import WalletConnect from "@/components/Browser/WalletConnect";

interface IndexProps {
  defaultUrl?: string;
}

const Index: React.FC<IndexProps> = ({ defaultUrl = "https://Platodata.io" }) => {
  const [showWalletConnect, setShowWalletConnect] = useState(true);
  const [bookmarksBarState, setBookmarksBarState] = useState<"visible" | "minimized" | "hidden">("visible");
  
  const { 
    tabs, 
    currentUrl, 
    addTab, 
    closeTab, 
    activateTab, 
    navigateToUrl,
    goBack,
    goForward,
    refreshPage,
    canGoBack,
    canGoForward
  } = useTabs(defaultUrl);

  const handleCloseWalletConnect = () => {
    setShowWalletConnect(false);
  };

  const toggleBookmarksBarState = () => {
    setBookmarksBarState(current => {
      // Cycle through states: visible -> minimized -> hidden -> visible
      switch (current) {
        case "visible": return "minimized";
        case "minimized": return "hidden";
        case "hidden": return "visible";
        default: return "visible";
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-nexus-space-black">
      {/* Main browser header with title and time - Always dark in both themes */}
      <div className="flex items-center justify-between px-4 py-2 bg-nexus-header-blue border-b border-border">
        <div className="flex items-center gap-2">
          <div className="text-sm text-white">
            Nexus Wave Browser - Web3 V2.1
          </div>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-4">
          <DateTime />
          <HomeButton />
          <ThemeToggle />
          <SettingsButton />
          <UserMenu />
        </div>
      </div>
      
      {/* Browser interface */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <BrowserHeader
          tabs={tabs}
          currentUrl={currentUrl}
          onAddTab={addTab}
          onCloseTab={closeTab}
          onActivateTab={activateTab}
          onNavigate={navigateToUrl}
          onGoBack={goBack}
          onGoForward={goForward}
          onRefresh={refreshPage}
          canGoBack={canGoBack()}
          canGoForward={canGoForward()}
          bookmarksBarState={bookmarksBarState}
          onToggleBookmarksBar={toggleBookmarksBarState}
        />
        
        <BrowserContent 
          currentUrl={currentUrl} 
          onNavigate={navigateToUrl}
        />
        
        {/* Nexus Wave Bridge overlay - centered in the browser */}
        {showWalletConnect && <WalletConnect onClose={handleCloseWalletConnect} />}
      </div>
      
      <CustomToaster position="bottom-right" />
    </div>
  );
};

export default Index;
