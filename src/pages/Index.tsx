
import React, { useState } from "react";
import BrowserHeader from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";
import WalletConnect from "@/components/Browser/WalletConnect";
import { Link } from "react-router-dom";
import { Clock, Calendar } from "lucide-react";

interface IndexProps {
  defaultUrl?: string;
}

const Index: React.FC<IndexProps> = ({ defaultUrl = "https://Platodata.io" }) => {
  const [showWalletConnect, setShowWalletConnect] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update time every second
  React.useEffect(() => {
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

  const handleCloseWalletConnect = () => {
    setShowWalletConnect(false);
  };

  return (
    <div className="flex flex-col h-screen bg-nexus-dark-blue">
      {/* Title bar with combined Nexus Wave logo and browser title */}
      <div className="flex items-center justify-between h-8 px-4 bg-card border-b border-border nexus-gradient-bg">
        {/* Nexus Wave - Left Corner */}
        <Link to="/" className="hover:text-nexus-purple transition-colors">
          <h1 className="text-xs font-bold text-white">
            Nexus Wave
          </h1>
        </Link>
        
        {/* Centered title text */}
        <div className="flex-grow text-center">
          <h1 className="text-xs text-white">
            Nexus Wave Browser - Web3 V2.1
          </h1>
        </div>
        
        {/* Date and Time - Right Side */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-nexus-purple" />
            <span className="font-mono">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-nexus-purple" />
            <span>{formattedDate}</span>
          </div>
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
