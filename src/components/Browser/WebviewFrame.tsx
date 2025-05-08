
import React, { useState, useEffect } from "react";
import { Bookmark, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showFallback, setShowFallback] = useState(false);

  // Extract domain for display purposes
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];

  // Handle iframe load events
  useEffect(() => {
    // Simulate page loading
    setIsLoading(true);
    setProgress(0);
    setShowFallback(false);
    
    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    const timer = setTimeout(() => {
      clearInterval(loadingInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 1000);
    
    return () => {
      clearInterval(loadingInterval);
      clearTimeout(timer);
    };
  }, [url]);

  // Function to handle iframe errors and display fallback
  const handleIframeError = () => {
    setShowFallback(true);
    toast.error("Could not load website content. Displaying fallback interface.");
  };

  return (
    <div className="flex flex-col h-full border border-border rounded-md overflow-hidden bg-[#0f111a]">
      {/* Loading bar */}
      {isLoading && (
        <div className="relative h-1">
          <Progress value={progress} className="h-1 bg-muted" />
        </div>
      )}
      
      {/* Website content */}
      <div className="flex-1 flex items-center justify-center nexus-scrollbar overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-nexus-purple animate-spin" />
          </div>
        ) : showFallback ? (
          <FallbackInterface domain={domain} />
        ) : (
          <div className="w-full h-full">
            <iframe 
              src={url}
              className="w-full h-full border-0"
              title={`Web content for ${domain}`}
              onError={handleIframeError}
              onLoad={() => console.log(`Loaded: ${url}`)}
              sandbox="allow-same-origin allow-scripts allow-forms"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Fallback interface when iframe fails to load or for restricted sites
const FallbackInterface: React.FC<{ domain: string }> = ({ domain }) => {
  return (
    <div className="text-center py-10 px-4 max-w-3xl mx-auto">
      <Globe className="mx-auto h-20 w-20 text-[#8c7ae6] mb-6" />
      <h2 className="text-3xl font-bold mb-3 text-white">Nexus Wave Browser Web3 V2.1</h2>
      
      <p className="text-lg text-gray-300 mb-6">
        Currently displaying: <span className="text-[#8c7ae6]">{domain}</span>
      </p>
      
      <p className="text-base text-gray-400 mb-10">
        This website couldn't be displayed in the iframe due to security restrictions.
        In a real implementation, this would render web content via Chromium's webview.
      </p>
      
      <div className="bg-[#1e2132] rounded-lg p-6 mb-8 max-w-xl mx-auto border border-[#2a2f45]">
        <div className="flex items-center mb-4">
          <Globe className="h-6 w-6 mr-3 text-[#8c7ae6]" />
          <h3 className="text-xl font-medium text-white">Web3-Optimized Features</h3>
        </div>
        
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">Built-in cryptocurrency wallet integration</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">DApp browser with Web3 support</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">Privacy-focused with built-in ad blocker</span>
          </li>
          <li className="flex items-start">
            <span className="w-2 h-2 rounded-full bg-[#8c7ae6] mt-2 mr-3 flex-shrink-0"></span>
            <span className="text-gray-300">Chromium-based for compatibility</span>
          </li>
        </ul>
      </div>
      
      <Button className="bg-[#8c7ae6] hover:bg-[#7c6ad6] text-white px-6 py-2 rounded-md transition-colors flex items-center mx-auto">
        <Bookmark className="h-5 w-5 mr-2" />
        Add to Bookmarks
      </Button>
    </div>
  );
};

export default WebviewFrame;
