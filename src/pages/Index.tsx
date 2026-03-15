import React, { useState } from "react";
import BrowserHeader, { DateTime, UserMenu, SettingsButton, ThemeToggle, HomeButton } from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import { useTabs } from "@/hooks/useTabs";
import WalletConnect from "@/components/Browser/WalletConnect";
import { useIsMobile } from "@/hooks/use-mobile";
import SidebarMenu from "@/components/Browser/SidebarMenu";
import ProtocolsMenu from "@/components/Browser/ProtocolsMenu";
import { useNavigate } from "react-router-dom";
import { Search, BarChart3, Compass, Globe, Newspaper, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface IndexProps {
  defaultUrl?: string;
}

const Index: React.FC<IndexProps> = ({ defaultUrl = "https://tmrw-digital.com" }) => {
  const [showWalletConnect, setShowWalletConnect] = useState(false);
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
      if (isMobile) {
        switch (current) {
          case "visible": return "hidden";
          case "hidden": return "visible";
          default: return "hidden";
        }
      }
      switch (current) {
        case "visible": return "minimized";
        case "minimized": return "hidden";
        case "hidden": return "visible";
        default: return "visible";
      }
    });
  };

  return (
    <div className="flex h-screen bg-background dark:bg-nexus-space-black">
      {/* Permanent sidebar - hidden on mobile */}
      {!isMobile && (
        <div className="w-56 flex-shrink-0">
          <SidebarMenu onNavigate={navigateToUrl} />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        {/* Main browser header */}
        <div className="flex items-center justify-between px-2 sm:px-4 py-1 bg-nexus-header-blue border-b border-border">
          <div className="flex items-center gap-2 min-w-0">
            {isMobile && <ProtocolsMenu onNavigate={navigateToUrl} />}
            {!isMobile && <DateTime />}
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted/20 hover:bg-muted/40" onClick={() => navigate('/search')}>
                <Search className="h-4 w-4 text-foreground" /><span className="sr-only">Discovery</span>
              </Button>
            </TooltipTrigger><TooltipContent>Discovery</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted/20 hover:bg-muted/40" onClick={() => navigate('/token')}>
                <BarChart3 className="h-4 w-4 text-foreground" /><span className="sr-only">Analytics</span>
              </Button>
            </TooltipTrigger><TooltipContent>Analytics</TooltipContent></Tooltip>

            <Tooltip><TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-muted/20 hover:bg-muted/40" onClick={() => navigateToUrl('https://platodata.io')}>
                <Newspaper className="h-4 w-4 text-foreground" /><span className="sr-only">Intelligence</span>
              </Button>
            </TooltipTrigger><TooltipContent>Intelligence</TooltipContent></Tooltip>

            <HomeButton />
            <ThemeToggle />
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
          
          {showWalletConnect && <WalletConnect onClose={handleCloseWalletConnect} />}
        </div>
      </div>
    </div>
  );
};

export default Index;
