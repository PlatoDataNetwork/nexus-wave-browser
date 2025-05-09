import React, { useState, useEffect } from "react";
import { Bookmark, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(true);
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
    
    // For demonstration purposes, we'll show the actual content in an iframe
    // Real browsers might have additional security or rendering considerations
    const timer = setTimeout(() => {
      clearInterval(loadingInterval);
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        // Always show content - in a real browser, you'd check for X-Frame-Options, etc.
      }, 300);
    }, 1000);
    
    return () => {
      clearInterval(loadingInterval);
      clearTimeout(timer);
    };
  }, [url]);

  // This function is never going to trigger in our demo since we're using srcdoc
  // But we'll keep it for future implementation with real iframes
  const handleIframeError = () => {
    console.error("Iframe loading error!");
    setShowFallback(true);
    toast.error("Could not load website content. Displaying fallback interface.");
  };

  // Generate demo HTML content for the iframe
  // This simulates a real website while avoiding CORS/iframe embedding issues
  const generateDemoContent = () => {
    // Use different templates for well-known sites
    if (domain.includes("opensea")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #141517;
                color: white;
              }
              header {
                padding: 16px;
                background: #1868b7;
                display: flex;
                align-items: center;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
              }
              .banner {
                width: 100%;
                background-image: linear-gradient(to right, #1a1b22, #2d2e38);
                padding: 40px 20px;
                text-align: center;
              }
              .nft-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 20px;
                padding: 20px;
              }
              .nft-card {
                background: #222432;
                border-radius: 10px;
                overflow: hidden;
              }
              .nft-image {
                height: 200px;
                background: #2a2d3a;
              }
              .nft-info {
                padding: 10px;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">OpenSea</div>
              <div>NFTs & Digital Items</div>
            </header>
            <div class="banner">
              <h1>Welcome to OS2. Your new home for NFTs and tokens.</h1>
            </div>
            <div class="nft-grid">
              ${Array(8).fill(0).map(() => `
                <div class="nft-card">
                  <div class="nft-image"></div>
                  <div class="nft-info">
                    <h3>NFT Collection</h3>
                    <p>Floor: 0.08 ETH</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
    }
    
    // Generic template for other sites
    return `
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: sans-serif;
              background: #f4f5f7;
              color: #333;
            }
            header {
              padding: 16px;
              background: #3c40c6;
              color: white;
              text-align: center;
            }
            .content {
              padding: 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
          </style>
        </head>
        <body>
          <header>
            <h2>${domain}</h2>
          </header>
          <div class="content">
            <h1>Welcome to ${domain}</h1>
            <p>This is a simulated view of ${url}.</p>
            <p>The Nexus Wave Browser prototype is showing this placeholder content.</p>
            <p>In a real implementation, this would render actual web content via a browser engine.</p>
          </div>
        </body>
      </html>
    `;
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
            {/* Use srcdoc instead of src to avoid CORS issues */}
            <iframe 
              srcDoc={generateDemoContent()}
              className="w-full h-full border-0"
              title={`Web content for ${domain}`}
              onError={handleIframeError}
              sandbox="allow-same-origin allow-scripts"
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
      <h2 className="text-3xl font-bold mb-3 text-white">Nexus Web3 Browser</h2>
      
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
