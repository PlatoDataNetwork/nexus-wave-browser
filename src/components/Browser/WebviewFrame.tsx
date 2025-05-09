
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
    // Reset states on URL change
    setIsLoading(true);
    setProgress(0);
    setShowFallback(false);
    
    console.log(`Loading URL in WebviewFrame: ${url}`);
    
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
    } else if (domain.includes("platodata")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #0f1118;
                color: white;
              }
              header {
                padding: 16px;
                background: #16192a;
                display: flex;
                align-items: center;
                border-bottom: 1px solid #2a2f45;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
                color: #6772e5;
              }
              .hero {
                width: 100%;
                background-image: linear-gradient(to right, #16192a, #22273c);
                padding: 60px 20px;
                text-align: center;
              }
              .data-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                padding: 40px 20px;
              }
              .data-card {
                background: #1a1f33;
                border-radius: 10px;
                padding: 20px;
                border: 1px solid #2a2f45;
              }
              .data-title {
                font-size: 18px;
                margin-bottom: 10px;
                color: #6772e5;
              }
              .data-value {
                font-size: 28px;
                font-weight: bold;
              }
              .chart-placeholder {
                height: 120px;
                background: linear-gradient(45deg, #1a1f33 25%, #242a40 25%, #242a40 50%, #1a1f33 50%, #1a1f33 75%, #242a40 75%, #242a40 100%);
                background-size: 20px 20px;
                opacity: 0.3;
                margin-top: 15px;
                border-radius: 6px;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">PlatoData.io</div>
              <div>Web3 Analytics & Insights</div>
            </header>
            <div class="hero">
              <h1>Welcome to Web3 Analytics Dashboard</h1>
              <p>Comprehensive data insights for blockchain and DeFi protocols</p>
            </div>
            <div class="data-grid">
              ${Array(6).fill(0).map((_, i) => `
                <div class="data-card">
                  <div class="data-title">${['Total Value Locked', 'Daily Active Addresses', 'Transaction Volume', 'Gas Used', 'NFT Sales', 'Protocol Revenue'][i]}</div>
                  <div class="data-value">${['$4.28B', '1.24M', '$892.5M', '12.4 ETH', '8,245', '$3.75M'][i]}</div>
                  <div class="chart-placeholder"></div>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `;
    } else if (domain.includes("ethereum") || domain.includes("eth")) {
      return `
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: sans-serif;
                background: #f7f8fa;
                color: #333;
              }
              header {
                padding: 16px;
                background: #627eea;
                color: white;
                display: flex;
                align-items: center;
              }
              .logo {
                font-weight: bold;
                font-size: 24px;
                margin-right: 20px;
              }
              .hero {
                width: 100%;
                background-image: linear-gradient(to right, #627eea, #8097ef);
                padding: 60px 20px;
                text-align: center;
                color: white;
              }
              .content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 40px 20px;
              }
              .stats {
                display: flex;
                justify-content: space-between;
                margin-bottom: 40px;
              }
              .stat {
                text-align: center;
                padding: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                flex: 1;
                margin: 0 10px;
              }
              .stat-value {
                font-size: 24px;
                font-weight: bold;
                color: #627eea;
              }
              .blocks {
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 20px;
              }
              .block {
                padding: 15px 0;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
              }
            </style>
          </head>
          <body>
            <header>
              <div class="logo">Ethereum</div>
              <div>Blockchain Explorer</div>
            </header>
            <div class="hero">
              <h1>Ethereum Blockchain</h1>
              <p>Decentralized, open-source blockchain with smart contract functionality</p>
            </div>
            <div class="content">
              <div class="stats">
                <div class="stat">
                  <div>Current Price</div>
                  <div class="stat-value">$3,487.21</div>
                </div>
                <div class="stat">
                  <div>Market Cap</div>
                  <div class="stat-value">$419.2B</div>
                </div>
                <div class="stat">
                  <div>Network Hash Rate</div>
                  <div class="stat-value">980 TH/s</div>
                </div>
                <div class="stat">
                  <div>Difficulty</div>
                  <div class="stat-value">12.65P</div>
                </div>
              </div>
              <div class="blocks">
                <h2>Latest Blocks</h2>
                ${Array(5).fill(0).map((_, i) => `
                  <div class="block">
                    <div>Block #${16482937 - i}</div>
                    <div>${Math.floor(Math.random() * 300) + 100} transactions</div>
                    <div>${Math.floor(Math.random() * 10) + 2} mins ago</div>
                  </div>
                `).join('')}
              </div>
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
              padding: 40px 20px;
              max-width: 1200px;
              margin: 0 auto;
            }
            .hero {
              background: linear-gradient(45deg, #3c40c6, #5352ed);
              padding: 60px 20px;
              text-align: center;
              color: white;
              margin-bottom: 40px;
            }
            .cards {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
              gap: 20px;
              margin-top: 40px;
            }
            .card {
              background: white;
              border-radius: 10px;
              padding: 20px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <header>
            <h2>${domain}</h2>
          </header>
          <div class="hero">
            <h1>Welcome to ${domain}</h1>
            <p>This is a simulated view of ${url}</p>
          </div>
          <div class="content">
            <p>The Nexus Wave Browser prototype is showing this website content.</p>
            <p>In a real implementation, this would render actual web content via a browser engine.</p>
            
            <div class="cards">
              ${Array(4).fill(0).map((_, i) => `
                <div class="card">
                  <h3>Featured Content ${i+1}</h3>
                  <p>This is sample content for ${domain}. In a real browser, you would see the actual website content here.</p>
                </div>
              `).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Loading bar */}
      {isLoading && (
        <div className="relative h-1">
          <Progress value={progress} className="h-1 bg-muted" />
        </div>
      )}
      
      {/* Website content - taking up full available space */}
      <div className="flex-1 flex items-center justify-center h-full w-full overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full w-full">
            <Loader2 className="h-8 w-8 text-nexus-purple animate-spin" />
          </div>
        ) : showFallback ? (
          <FallbackInterface domain={domain} />
        ) : (
          <iframe 
            srcDoc={generateDemoContent()}
            className="w-full h-full border-0"
            title={`Web content for ${domain}`}
            onError={handleIframeError}
            sandbox="allow-same-origin allow-scripts"
            style={{ display: 'block', width: '100%', height: '100%' }}
          />
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
