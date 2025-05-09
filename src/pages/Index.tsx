
import React, { useState } from "react";
import BrowserHeader from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import BrowserFooter from "@/components/Browser/BrowserFooter";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const [footerVisible, setFooterVisible] = useState(true);
  
  const toggleFooter = () => {
    setFooterVisible(prev => !prev);
  };

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
      
      {/* Only show footer if visible */}
      {footerVisible && <BrowserFooter 
        onNavigate={navigateToUrl} 
        toggleFooter={toggleFooter}
        isFooterVisible={footerVisible}
      />}
      
      {/* If footer is not visible, show toggle button */}
      {!footerVisible && (
        <div className="flex justify-center py-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleFooter}
            className="h-6 rounded-full text-green-500 bg-muted/50 hover:bg-muted"
          >
            <ChevronUp className="h-4 w-4 text-green-500" />
          </Button>
        </div>
      )}
      
      <CustomToaster position="bottom-right" />
    </div>
  );
};

export default Index;
