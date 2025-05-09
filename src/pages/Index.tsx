
import React from "react";
import BrowserHeader from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";

interface IndexProps {
  defaultUrl?: string;
}

const Index: React.FC<IndexProps> = ({ defaultUrl = "https://Platodata.io" }) => {
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

  // Debug log to check what URL is being loaded initially
  console.log("Index component rendering with defaultUrl:", defaultUrl);
  console.log("Current URL in tabs system:", currentUrl);

  return (
    <div className="flex flex-col h-screen bg-nexus-dark-blue">
      {/* Title bar - would be handled by the native window in a real app */}
      <div className="flex items-center justify-center h-8 bg-card border-b border-border nexus-gradient-bg">
        <h1 className="text-xs font-medium">Nexus Wave Browser - Web3 V2.1</h1>
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
        />
        
        <BrowserContent 
          currentUrl={currentUrl} 
          onNavigate={navigateToUrl}
        />
      </div>
      
      {/* Only render BrowserFooter from PageLayout */}
      <CustomToaster position="bottom-right" />
    </div>
  );
};

export default Index;
