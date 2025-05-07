
import React, { useState, useEffect } from "react";
import { Bookmark, Globe, RefreshCw, Shield, Star, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import WalletConnect from "./WalletConnect";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSecure, setIsSecure] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  
  // Extract domain for display purposes
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];
  
  // Simulate page loading
  useEffect(() => {
    if (!url) return;
    
    setLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
    
    // Check if site is secure
    setIsSecure(url.startsWith('https://'));
    
    return () => clearInterval(interval);
  }, [url]);
  
  const handleRefresh = () => {
    toast.info("Reloading page...");
    setLoading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          toast.success("Page loaded");
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };
  
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked) {
      toast.success(`Added ${domain} to bookmarks`);
    } else {
      toast.info(`Removed ${domain} from bookmarks`);
    }
  };
  
  const toggleWallet = () => {
    setShowWallet(!showWallet);
  };
  
  return (
    <div className="flex flex-col h-full border border-border rounded-md overflow-hidden bg-card">
      {loading && <Progress value={progress} className="h-1" />}
      
      <div className="flex-1 nexus-scrollbar overflow-y-auto">
        {showWallet ? (
          <div className="p-4 relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={toggleWallet}
            >
              <X className="h-4 w-4" />
            </Button>
            <h3 className="text-lg font-medium mb-4">Web3 Wallet</h3>
            <WalletConnect />
          </div>
        ) : (
          <div className="text-center py-20">
            <Globe className="mx-auto h-16 w-16 text-nexus-purple mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nexus Web3 Browser</h2>
            <p className="text-muted-foreground mb-2 flex items-center justify-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${isSecure ? 'bg-green-500' : 'bg-amber-500'}`}></span>
              <span className="text-nexus-purple">{domain}</span>
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
              This simulated browser provides a preview of how the Nexus Wave Web3 Browser will render web content
              with integrated cryptocurrency and blockchain features.
            </p>
            
            <div className="flex justify-center space-x-2 mb-6">
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={handleRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant={isBookmarked ? "default" : "outline"}
                className={`flex items-center ${isBookmarked ? 'bg-nexus-purple text-white' : ''}`} 
                onClick={toggleBookmark}
              >
                <Star className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-white' : ''}`} />
                {isBookmarked ? 'Bookmarked' : 'Bookmark'}
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center" 
                onClick={toggleWallet}
              >
                <Bookmark className="h-4 w-4 mr-2" />
                Web3 Wallet
              </Button>
            </div>
            
            <div className="mt-8 max-w-md mx-auto p-4 nexus-glass rounded-lg">
              <div className="flex items-center mb-3">
                <Shield className="h-5 w-5 mr-2 text-nexus-purple" />
                <h3 className="font-medium">Advanced Security Features</h3>
              </div>
              <ul className="text-left text-sm space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
                  Built-in phishing and scam protection
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
                  Privacy-first browsing with automatic tracker blocking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
                  Smart contract verification and security analysis
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
                  Multi-chain compatibility and fraud detection
                </li>
              </ul>
            </div>
            
            <div className="mt-6 text-xs text-muted-foreground">
              <p>Connected as: Nexus Wave Demo User · Production version 1.0.0</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center p-2 border-t border-border bg-card/80 text-xs text-muted-foreground">
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-1 ${isSecure ? 'bg-green-500' : 'bg-amber-500'}`}></span>
          {isSecure ? 'Secure Connection' : 'Standard Connection'}
        </div>
        <div>Nexus Wave · Production v1.0.0</div>
      </div>
    </div>
  );
};

export default WebviewFrame;
