
import React, { useState, useEffect } from "react";
import { Bookmark, Globe, Star, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<React.ReactNode>(null);

  // Extract domain for display purposes
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];

  useEffect(() => {
    // Simulate page loading
    setIsLoading(true);
    setProgress(0);
    
    const loadingInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 20;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 200);
    
    // Generate appropriate content based on URL
    const timer = setTimeout(() => {
      clearInterval(loadingInterval);
      setProgress(100);
      
      // Set content based on URL
      setContent(generateContentForURL(url));
      
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    }, 1000);
    
    return () => {
      clearInterval(loadingInterval);
      clearTimeout(timer);
    };
  }, [url]);

  const generateContentForURL = (url: string) => {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.includes('nexus.wave/newtab')) {
      return renderNewTabPage();
    } else if (lowerUrl.includes('nexus.wave/dashboard')) {
      return renderDashboardPage();
    } else if (lowerUrl.includes('github.com')) {
      return renderGitHubPage();
    } else if (lowerUrl.includes('etherscan.io')) {
      return renderEtherscanPage();
    } else if (lowerUrl.includes('uniswap.org')) {
      return renderUniswapPage();
    } else {
      return renderGenericPage(url);
    }
  };
  
  const renderNewTabPage = () => (
    <div className="text-center py-20">
      <Globe className="mx-auto h-16 w-16 text-nexus-purple mb-4" />
      <h2 className="text-2xl font-bold mb-2">Nexus Web3 Browser</h2>
      <p className="text-muted-foreground mb-4">
        Welcome to a new tab
      </p>
      
      <div className="mt-8 grid grid-cols-4 gap-4 max-w-4xl mx-auto">
        {['Uniswap', 'Etherscan', 'GitHub', 'Nexus Dashboard'].map((site) => (
          <div 
            key={site}
            className="flex flex-col items-center p-4 rounded-lg hover:bg-accent cursor-pointer"
          >
            <div className="w-12 h-12 bg-nexus-purple/20 rounded-full flex items-center justify-center mb-2">
              <Star className="h-6 w-6 text-nexus-purple" />
            </div>
            <span className="text-sm">{site}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-8 max-w-md mx-auto p-4 nexus-glass rounded-lg">
        <div className="flex items-center mb-3">
          <ShieldCheck className="h-5 w-5 mr-2 text-nexus-purple" />
          <h3 className="font-medium">Protected by Nexus Security</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Nexus Browser is designed to protect your privacy and security with built-in
          Web3 protections and security enhancements.
        </p>
      </div>
    </div>
  );
  
  const renderDashboardPage = () => (
    <div className="py-8 px-6">
      <h2 className="text-2xl font-bold mb-6 text-nexus-purple">Nexus Wave Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-4">Wallet Overview</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Total Balance</span>
            <span className="font-semibold">3.245 ETH</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">USD Value</span>
            <span className="font-semibold">$7,245.32</span>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <Button variant="outline" size="sm" className="mr-2">Send</Button>
            <Button variant="outline" size="sm" className="mr-2">Receive</Button>
            <Button variant="outline" size="sm">Swap</Button>
          </div>
        </div>
        
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center mr-3">
                    {i % 2 === 0 ? 
                      <Star className="h-4 w-4 text-nexus-purple" /> : 
                      <Globe className="h-4 w-4 text-nexus-purple" />
                    }
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {i % 2 === 0 ? 'Sent ETH' : 'Received ETH'}
                    </div>
                    <div className="text-xs text-muted-foreground">May {i + 4}, 2025</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {i % 2 === 0 ? '-0.35' : '+0.15'} ETH
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i % 2 === 0 ? '- $782.50' : '+ $335.25'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-lg border border-border">
        <h3 className="text-lg font-medium mb-4">Connected DApps</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {['Uniswap', 'Aave', 'OpenSea', 'Compound'].map(dapp => (
            <div key={dapp} className="flex flex-col items-center p-4 bg-background rounded-md">
              <div className="w-12 h-12 rounded-full bg-nexus-purple/20 flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-nexus-purple" />
              </div>
              <span className="text-sm font-medium">{dapp}</span>
              <span className="text-xs text-muted-foreground mt-1">Connected</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGitHubPage = () => (
    <div className="py-8 px-6">
      <div className="flex items-center mb-6">
        <svg height="32" viewBox="0 0 16 16" version="1.1" width="32">
          <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg>
        <h2 className="text-2xl font-bold ml-3">GitHub</h2>
      </div>
      
      <div className="flex mb-8">
        <div className="w-64 pr-6">
          <div className="bg-card rounded-lg p-4 border border-border mb-4">
            <h3 className="text-lg font-medium mb-3">Repositories</h3>
            <ul className="space-y-2 text-sm">
              <li className="py-1 px-2 rounded hover:bg-accent cursor-pointer">nexus-web3-browser</li>
              <li className="py-1 px-2 rounded hover:bg-accent cursor-pointer">blockchain-wallet</li>
              <li className="py-1 px-2 rounded hover:bg-accent cursor-pointer">defi-aggregator</li>
              <li className="py-1 px-2 rounded hover:bg-accent cursor-pointer">smart-contracts</li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">nexus-web3-browser</h3>
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Star
              </Button>
            </div>
            
            <p className="text-muted-foreground mb-6">
              A secure and privacy-focused web3 browser with built-in cryptocurrency wallet integration
            </p>
            
            <div className="flex space-x-4 mb-6">
              <div className="flex items-center text-sm">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                <span>TypeScript</span>
              </div>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 mr-1" />
                <span>324</span>
              </div>
              <div className="flex items-center text-sm">
                <svg className="h-4 w-4 mr-1" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                </svg>
                <span>42</span>
              </div>
            </div>
            
            <div className="border-t border-border pt-6">
              <h4 className="text-lg font-medium mb-4">Commit Activity</h4>
              <div className="flex space-x-1 h-10">
                {Array(20).fill(0).map((_, i) => (
                  <div 
                    key={i}
                    className="flex-1 bg-nexus-purple/10" 
                    style={{ 
                      height: `${20 + Math.random() * 80}%` 
                    }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEtherscanPage = () => (
    <div className="py-8 px-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Etherscan</h2>
        <div className="flex items-center">
          <div className="mr-4">
            <div className="text-sm font-medium">ETH Price</div>
            <div>$2,231.45</div>
          </div>
          <div className="mr-4">
            <div className="text-sm font-medium">Gas Price</div>
            <div>32 Gwei</div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">Transaction Details</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">Transaction Hash:</div>
            <div className="col-span-2 font-mono text-sm text-nexus-purple">0x7b9d5e31b15d43c1b8c2s87df92b80bd51291ed7c3d9e1ee9230...</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">Status:</div>
            <div className="col-span-2">
              <span className="px-2 py-1 text-xs bg-green-500/20 text-green-600 rounded">Success</span>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">Block:</div>
            <div className="col-span-2 text-sm">18452075 (87 confirmations)</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">From:</div>
            <div className="col-span-2 font-mono text-sm">0x7c9e8b601e8c187f43c3d9e1ee9290...</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">To:</div>
            <div className="col-span-2 font-mono text-sm">0x6b9d5e31b14d43c0b8c2987df92b80...</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">Value:</div>
            <div className="col-span-2 text-sm">0.5432 ETH ($1,212.32)</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 py-2 border-b border-border">
            <div className="text-sm text-muted-foreground">Gas Price:</div>
            <div className="col-span-2 text-sm">23.4 Gwei ($1.25)</div>
          </div>
        </div>
      </div>
      
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-medium mb-4">Event Logs</h3>
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-3 bg-card rounded border border-border">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">Transfer Event</div>
                <div className="text-xs bg-nexus-purple/20 text-nexus-purple px-2 py-0.5 rounded">Log #{i}</div>
              </div>
              <div className="font-mono text-xs">Address: 0x7c9e8b601e8c187f43c3d9e1ee9290...</div>
              <div className="font-mono text-xs mt-1">Topics: 0x000000000000000000000000...</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUniswapPage = () => (
    <div className="py-8 px-6">
      <div className="flex items-center mb-6">
        <svg width="32" height="32" viewBox="0 0 20 20">
          <path d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0z" fill="#FF007A"/>
          <path d="M15.92 8.767a.675.675 0 00-.675-.667h-3.382c-.039 0-.074.01-.108.022a.505.505 0 01-.19.038c-.063 0-.127-.013-.19-.038a.341.341 0 00-.108-.022H8.152c.285-.628.484-1.11.596-1.441.14-.407.225-.803.225-1.184 0-.381-.05-.711-.15-.99-.126-.38-.302-.57-.527-.57-.176 0-.366.101-.527.278-.151.164-.264.341-.264.518 0 .152.05.342.152.596.113.279.152.507.15.684-.12.202-.075.443-.226.723a26.952 26.952 0 01-1.39 2.38H4.763c-.264 0-.478.214-.478.478v4.07c0 .264.201.478.466.478h1.67c.18 0 .34-.1.415-.255h4.382c.759 0 1.516-.076 1.516-.862 0-.686-.346-.838-.675-.889.354-.08.7-.22.7-.879 0-.684-.384-.824-.727-.878.32-.06.637-.23.637-.866a.807.807 0 00-.262-.61c.213-.195.339-.435.339-.697v-.001z" fill="#fff"/>
        </svg>
        <h2 className="text-2xl font-bold ml-3">Uniswap</h2>
      </div>
      
      <div className="flex mb-8">
        <div className="w-64 pr-6">
          <div className="flex flex-col space-y-2">
            <Button variant="ghost" className="justify-start">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              Swap
            </Button>
            <Button variant="ghost" className="justify-start">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/>
              </svg>
              Tokens
            </Button>
            <Button variant="ghost" className="justify-start">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path d="M13 5.08c3.06.44 5.48 2.86 5.92 5.92h3.03c-.47-4.72-4.23-8.48-8.95-8.95v3.03zM18.92 13c-.44 3.06-2.86 5.48-5.92 5.92v3.03c4.72-.47 8.48-4.23 8.95-8.95h-3.03zM11 18.92c-3.39-.49-6-3.4-6-6.92s2.61-6.43 6-6.92V2.05c-5.05.5-9 4.76-9 9.95 0 5.19 3.95 9.45 9 9.95v-3.03z"/>
              </svg>
              Pools
            </Button>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Swap</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                </svg>
              </Button>
            </div>
            
            <div className="bg-background rounded-lg p-4 mb-2">
              <div className="flex justify-between mb-2">
                <div className="text-sm">You pay</div>
                <div className="text-sm">Balance: 1.234 ETH</div>
              </div>
              <div className="flex justify-between items-center">
                <input 
                  type="text"
                  value="0.5"
                  className="bg-transparent text-2xl font-medium w-2/3 outline-none"
                />
                <Button variant="outline" className="h-9">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#627EEA"/>
                    <path d="M12 4v5.82l4.93 2.2L12 4z" fill="#fff" fillOpacity=".602"/>
                    <path d="M12 4L7.07 12.02 12 9.82V4z" fill="#fff"/>
                    <path d="M12 16.47v3.51l4.93-6.84L12 16.47z" fill="#fff" fillOpacity=".602"/>
                    <path d="M12 19.98v-3.51l-4.93-3.33L12 19.98z" fill="#fff"/>
                    <path d="M12 15.46l4.93-3.33L12 9.8v5.66z" fill="#fff" fillOpacity=".2"/>
                    <path d="M7.07 12.13L12 15.46V9.8l-4.93 2.33z" fill="#fff" fillOpacity=".602"/>
                  </svg>
                  ETH
                  <svg className="h-4 w-4 ml-2" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="flex justify-center my-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background rounded-full">
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z"/>
                </svg>
              </Button>
            </div>
            
            <div className="bg-background rounded-lg p-4 mb-4">
              <div className="flex justify-between mb-2">
                <div className="text-sm">You receive</div>
                <div className="text-sm">Balance: 0 UNI</div>
              </div>
              <div className="flex justify-between items-center">
                <input 
                  type="text"
                  value="125.4"
                  className="bg-transparent text-2xl font-medium w-2/3 outline-none"
                  readOnly
                />
                <Button variant="outline" className="h-9">
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" fill="#FF007A"/>
                    <path d="M15.92 8.767a.675.675 0 00-.675-.667h-3.382c-.039 0-.074.01-.108.022a.505.505 0 01-.19.038c-.063 0-.127-.013-.19-.038a.341.341 0 00-.108-.022H8.152c.285-.628.484-1.11.596-1.441.14-.407.225-.803.225-1.184 0-.381-.05-.711-.15-.99-.126-.38-.302-.57-.527-.57-.176 0-.366.101-.527.278-.151.164-.264.341-.264.518 0 .152.05.342.152.596.113.279.152.507.15.684-.12.202-.075.443-.226.723a26.952 26.952 0 01-1.39 2.38H4.763c-.264 0-.478.214-.478.478v4.07c0 .264.201.478.466.478h1.67c.18 0 .34-.1.415-.255h4.382c.759 0 1.516-.076 1.516-.862 0-.686-.346-.838-.675-.889.354-.08.7-.22.7-.879 0-.684-.384-.824-.727-.878.32-.06.637-.23.637-.866a.807.807 0 00-.262-.61c.213-.195.339-.435.339-.697v-.001z" fill="#fff"/>
                  </svg>
                  UNI
                  <svg className="h-4 w-4 ml-2" viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </Button>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-4">
              1 ETH = 250.8 UNI ($2,231.45)
            </div>
            
            <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
              Swap
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  
  const renderGenericPage = (url: string) => (
    <div className="text-center py-20">
      <Globe className="mx-auto h-16 w-16 text-nexus-purple mb-4" />
      <h2 className="text-2xl font-bold mb-2">Nexus Web3 Browser</h2>
      <p className="text-muted-foreground mb-4">
        Currently displaying: <span className="text-nexus-purple">{domain}</span>
      </p>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        This is a simulated browser interface. In a real implementation, 
        this would render web content via Chromium's webview.
      </p>
      
      <div className="mt-8 max-w-md mx-auto p-4 nexus-glass rounded-lg">
        <div className="flex items-center mb-3">
          <Globe className="h-5 w-5 mr-2 text-nexus-purple" />
          <h3 className="font-medium">Web3-Optimized Features</h3>
        </div>
        <ul className="text-left text-sm space-y-2">
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
            Built-in cryptocurrency wallet integration
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
            DApp browser with Web3 support
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
            Privacy-focused with built-in ad blocker
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 rounded-full bg-nexus-purple mr-2"></span>
            Chromium-based for compatibility
          </li>
        </ul>
      </div>
      
      <div className="mt-6">
        <Button className="px-4 py-2 bg-nexus-purple hover:bg-nexus-light-purple text-white rounded-md transition-colors flex items-center mx-auto">
          <Bookmark className="h-4 w-4 mr-2" />
          Add to Bookmarks
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full border border-border rounded-md overflow-hidden">
      {/* Loading bar */}
      {isLoading && (
        <div className="relative h-1">
          <Progress value={progress} className="h-1 bg-muted" />
        </div>
      )}
      
      {/* Simulated browser content */}
      <div className="flex-1 bg-card nexus-scrollbar overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-nexus-purple animate-spin" />
          </div>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

export default WebviewFrame;
