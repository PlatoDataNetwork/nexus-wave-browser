import React, { useState } from "react";
import BrowserHeader, { DateTime, UserMenu, SettingsButton, ThemeToggle, HomeButton } from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import Header from "@/components/Layout/Header";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";
import WalletConnect from "@/components/Browser/WalletConnect";
import { useIsMobile } from "@/hooks/use-mobile";

interface IndexProps {
  defaultUrl?: string;
}

const Index: React.FC<IndexProps> = ({ defaultUrl = "https://platodata.io" }) => {
  const [showWalletConnect, setShowWalletConnect] = useState(true);
  const [bookmarksBarState, setBookmarksBarState] = useState<"visible" | "minimized" | "hidden">("hidden");
  const isMobile = useIsMobile();
  
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
      // On mobile, hide bookmarks by default to save space
      if (isMobile) {
        switch (current) {
          case "visible": return "hidden";
          case "hidden": return "visible";
          default: return "hidden";
        }
      }
      // Desktop behavior unchanged
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
      {/* Main browser header with title and time - Responsive layout */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 bg-nexus-header-blue border-b border-border">
        <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
          <div className="flex flex-col text-white min-w-0">
            <div className="text-xs sm:text-sm font-semibold truncate">
              {isMobile ? "Nexus Wave" : "Nexus Wave by PlatoAI"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          {/* Hide date/time on very small screens */}
          {!isMobile && <DateTime />}
          <HomeButton />
          <ThemeToggle />
          {/* Hide settings on mobile to save space */}
          {!isMobile && <SettingsButton />}
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
          bookmarksBarState={isMobile ? "hidden" : bookmarksBarState}
          onToggleBookmarksBar={toggleBookmarksBarState}
        />
        
        <BrowserContent 
          currentUrl={currentUrl} 
          onNavigate={navigateToUrl}
        />
        
        {/* Wallet connect overlay - adjusted for mobile */}
        {showWalletConnect && <WalletConnect onClose={handleCloseWalletConnect} />}
      </div>
      
      <CustomToaster 
        position={isMobile ? "top-center" : "bottom-right"} 
        toastOptions={{
          style: {
            fontSize: isMobile ? '14px' : '16px',
          }
        }}
      />
    </div>
  );
};

export default Index;
