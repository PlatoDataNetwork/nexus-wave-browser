
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);

  // Extract domain for display purposes - with null check
  const domain = url ? url.replace(/^https?:\/\//, "").split("/")[0] : "unknown";

  // Handle iframe load events
  useEffect(() => {
    // Reset states on URL change
    setIsLoading(true);
    setProgress(0);
    setLoadError(false);
    
    // Guard clause for undefined URLs
    if (!url) {
      console.error("WebviewFrame: URL is undefined");
      setLoadError(true);
      return;
    }
    
    console.log(`Loading URL in WebviewFrame: ${url}`);
    toast.info(`Loading web content for: ${domain}`);
    
    // Force a clear timeout to prevent any race conditions
    let loadingInterval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;
    
    // Small delay to ensure React has fully updated before we start loading
    setTimeout(() => {
      loadingInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 20;
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 200);
      
      // Keep the loading animation for visual feedback
      timer = setTimeout(() => {
        clearInterval(loadingInterval);
        setProgress(100);
        
        setTimeout(() => {
          setIsLoading(false);
          toast.success(`Loaded content from: ${domain}`);
        }, 300);
      }, 1500);
    }, 100);
    
    return () => {
      clearInterval(loadingInterval);
      clearTimeout(timer);
    };
  }, [url, domain]);

  const handleIframeError = () => {
    console.error("Iframe loading error for URL:", url);
    setLoadError(true);
    toast.error(`Could not load content from ${domain}. The site may be blocking embedding.`);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setProgress(100);
    toast.success(`Loaded content from: ${domain}`);
  };

  // Function to ensure URL has proper protocol
  const getProperUrl = (urlString: string | undefined) => {
    if (!urlString) return "about:blank"; // Fallback for undefined URLs
    
    if (urlString.startsWith('/')) {
      // Internal URL, keep as is
      return urlString;
    }
    // Ensure external URLs have https:// prefix
    if (!urlString.startsWith('http://') && !urlString.startsWith('https://')) {
      return `https://${urlString}`;
    }
    return urlString;
  };

  return (
    <div className="flex flex-col h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-40 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-lg font-medium">Loading {domain}...</span>
          </div>
          <Progress className="w-[80%] max-w-md" value={progress} />
        </div>
      )}

      <div className="flex-1 w-full h-full">
        {loadError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6">
            <div className="text-center max-w-md">
              <h3 className="text-lg font-semibold mb-2 text-destructive">Unable to load {domain}</h3>
              <p className="text-muted-foreground mb-6">
                This website cannot be displayed in an iframe due to security restrictions set by the site owner.
              </p>
              <a 
                href={getProperUrl(url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Open in New Tab
              </a>
            </div>
          </div>
        ) : (
          <iframe
            title={`Web content for ${url || 'empty URL'}`}
            className="w-full h-full"
            src={getProperUrl(url)}
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  );
};

export default WebviewFrame;
