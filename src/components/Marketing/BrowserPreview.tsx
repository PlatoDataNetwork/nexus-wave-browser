
import React from "react";

const BrowserPreview: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Browser mockup */}
      <div className="w-full h-full bg-nexus-dark-blue rounded-xl overflow-hidden flex flex-col">
        {/* Browser header - macOS style */}
        <div className="bg-nexus-card-navy border-b border-border p-2 flex items-center">
          <div className="flex space-x-2 px-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          
          {/* Tab bar */}
          <div className="flex-1 flex items-center ml-4 space-x-1">
            <div className="browser-tab active flex items-center px-3 py-1 text-xs">
              <div className="w-2 h-2 rounded-full bg-nexus-purple mr-2" />
              <span className="truncate">Nexus Wave | Web3 Dashboard</span>
            </div>
            <div className="browser-tab flex items-center px-3 py-1 text-xs opacity-70">
              <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
              <span className="truncate">DEX Aggregator</span>
            </div>
          </div>
        </div>
        
        {/* Address bar */}
        <div className="bg-nexus-card-navy p-2 border-b border-border">
          <div className="address-bar bg-nexus-card-dark rounded-md flex items-center px-3 py-1.5 text-sm">
            <div className="w-4 h-4 rounded-full bg-green-500/50 mr-2" />
            <span className="text-gray-400">app.uniswap.org</span>
            <div className="ml-auto flex items-center space-x-2">
              <div className="bg-nexus-purple/20 text-nexus-purple text-xs px-2 py-0.5 rounded">Verified</div>
              <div className="w-4 h-4 rounded-full bg-nexus-purple/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-nexus-purple"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Browser content */}
        <div className="flex-1 bg-nexus-space-black p-4 overflow-hidden">
          <div className="nexus-gradient-bg h-full rounded-lg p-4">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium text-white mb-2">Web3 Dashboard</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-nexus-card-dark p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center mr-3">
                      <div className="w-4 h-4 rounded-md bg-nexus-purple/70" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">ETH Balance</div>
                      <div className="text-gray-400">3.45 ETH</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-nexus-card-navy rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-nexus-purple rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-nexus-card-dark p-3 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center mr-3">
                      <div className="w-4 h-4 rounded-md bg-nexus-purple/70" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Gas Tracker</div>
                      <div className="text-gray-400">12 Gwei</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-nexus-card-navy rounded-full overflow-hidden">
                    <div className="h-full w-1/4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-nexus-card-dark p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center mr-3">
                      <div className="w-4 h-4 rounded-md bg-nexus-purple/70" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Security</div>
                      <div className="text-gray-400">Protected</div>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-nexus-card-navy rounded-full overflow-hidden">
                    <div className="h-full w-full bg-green-500 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-nexus-card-dark p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center mr-3">
                      <div className="w-4 h-4 rounded-md bg-nexus-purple/70" />
                    </div>
                    <div className="text-sm">
                      <div className="font-medium">Network</div>
                      <div className="text-gray-400">Ethereum</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-nexus-purple"></div>
                      <div className="w-2 h-2 rounded-full bg-nexus-purple"></div>
                      <div className="w-2 h-2 rounded-full bg-nexus-purple"></div>
                    </div>
                    <div className="text-xs text-nexus-purple">Change</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-nexus-card-dark rounded-lg p-3 mb-3">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Recent Activity</h4>
                  <div className="text-xs text-nexus-purple">View all</div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                    <span className="text-gray-400 mr-2">12:45</span>
                    <span>Swap 0.1 ETH for 125 DAI</span>
                  </div>
                  <div className="flex items-center text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-gray-400 mr-2">09:32</span>
                    <span>Added liquidity to ETH-USDC pool</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-auto">
                <div className="h-8 w-24 bg-nexus-purple rounded-md flex items-center justify-center text-white text-sm">Swap</div>
                <div className="h-8 w-24 bg-nexus-card-dark border border-nexus-purple/30 rounded-md flex items-center justify-center text-sm">Connect</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-nexus-purple/20 rounded-full blur-3xl -z-10" />
      <div className="absolute -top-6 -left-6 w-32 h-32 bg-nexus-purple/10 rounded-full blur-3xl -z-10" />
    </div>
  );
};

export default BrowserPreview;
