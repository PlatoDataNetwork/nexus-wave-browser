
import React, { useState } from "react";
import BrowserHeader from "@/components/Browser/BrowserHeader";
import BrowserContent from "@/components/Browser/BrowserContent";
import { useTabs } from "@/hooks/useTabs";
import { Toaster as CustomToaster } from "@/components/ui/sonner";
import WalletConnect from "@/components/Browser/WalletConnect";
import { Link } from "react-router-dom";
import { Clock, Calendar, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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

  // Navigation menu items
  const navigationItems = [
    { name: "Home", href: "/" },
    { name: "Settings", href: "/settings" },
    { name: "History", href: "/history" },
    { name: "Extensions", href: "/extension-store" },
    { name: "Documentation", href: "/documentation" },
  ];

  return (
    <div className="flex flex-col h-screen bg-nexus-dark-blue">
      {/* Title bar with combined Nexus Wave logo and browser title */}
      <div className="flex items-center justify-between h-8 px-4 bg-card border-b border-border nexus-gradient-bg">
        {/* Logo with Link to home */}
        <Link to="/" className="flex items-center gap-2 hover:text-nexus-purple transition-colors">
          <div className="w-5 h-5 rounded-full animate-pulse-glow bg-gradient-to-r from-nexus-purple to-nexus-light-purple" />
          <h1 className="text-xs font-bold bg-gradient-to-r from-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
            Nexus Wave Browser - Web3 V2.1
          </h1>
        </Link>
        
        {/* Center space */}
        <div className="flex-1"></div>
        
        {/* Date and Time */}
        <div className="flex items-center gap-4 text-xs mr-4">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-nexus-purple" />
            <span className="font-mono">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-nexus-purple" />
            <span>{formattedDate}</span>
          </div>
        </div>
        
        {/* Hamburger Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button className="p-1 rounded-md hover:bg-nexus-card-navy transition-colors">
              <Menu className="h-4 w-4 text-nexus-light-purple" />
              <span className="sr-only">Menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-nexus-card-navy border-nexus-deep-purple">
            <div className="py-6">
              <h3 className="text-lg font-bold bg-gradient-to-r from-nexus-purple to-nexus-light-purple bg-clip-text text-transparent mb-6">
                Nexus Wave Navigation
              </h3>
              <nav className="flex flex-col space-y-3">
                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="px-4 py-2 rounded-lg hover:bg-nexus-dark-blue text-white hover:text-nexus-light-purple transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-8 pt-6 border-t border-nexus-deep-purple">
                <div className="flex flex-col space-y-3">
                  <button 
                    onClick={() => navigateToUrl('https://platodata.io')}
                    className="px-4 py-2 rounded-lg bg-nexus-purple text-white hover:bg-nexus-deep-purple transition-colors"
                  >
                    Visit PlatoData.io
                  </button>
                  <button 
                    onClick={() => addTab()}
                    className="px-4 py-2 rounded-lg bg-nexus-deep-purple text-white hover:bg-nexus-purple transition-colors"
                  >
                    New Tab
                  </button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
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
