
import React from "react";
import BrowserHeader from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import BrowserFooter from "@/components/Browser/BrowserFooter";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";

const Index = () => {
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
  } = useTabs();

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
        
        <BrowserFooter />
      </div>
      
      <CustomToaster position="bottom-right" />
    </div>
  );
};

export default Index;
