
import React from "react";
import { Card } from "@/components/ui/card";

const BrowserPreview: React.FC = () => {
  return (
    <div className="relative w-full h-full">
      {/* Browser mockup */}
      <div className="w-full h-full bg-nexus-dark-blue rounded-xl overflow-hidden flex flex-col">
        {/* Browser header */}
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
              <span className="truncate">Nexus Wave</span>
            </div>
            <div className="browser-tab flex items-center px-3 py-1 text-xs opacity-70">
              <div className="w-2 h-2 rounded-full bg-gray-500 mr-2" />
              <span className="truncate">Uniswap</span>
            </div>
          </div>
        </div>
        
        {/* Address bar */}
        <div className="bg-nexus-card-navy p-2 border-b border-border">
          <div className="address-bar bg-nexus-card-dark rounded-md flex items-center px-3 py-1.5 text-sm">
            <div className="w-4 h-4 rounded-full bg-nexus-purple/50 mr-2" />
            <span className="text-gray-400">https://nexuswave.io</span>
          </div>
        </div>
        
        {/* Browser content */}
        <div className="flex-1 bg-nexus-space-black p-4 overflow-hidden">
          <div className="nexus-gradient-bg h-full rounded-lg p-4">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-medium text-white mb-2">Welcome to Nexus Wave</h3>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="bg-nexus-card-dark p-3 flex items-center">
                    <div className="w-8 h-8 rounded-full bg-nexus-purple/20 flex items-center justify-center mr-3">
                      <div className="w-4 h-4 rounded-md bg-nexus-purple/70" />
                    </div>
                    <div>
                      <div className="h-2.5 w-16 bg-nexus-purple/30 rounded mb-1.5" />
                      <div className="h-2 w-10 bg-nexus-purple/20 rounded" />
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="bg-nexus-card-dark rounded-lg p-3 mb-3">
                <div className="h-2.5 w-3/4 bg-nexus-purple/30 rounded mb-2" />
                <div className="h-2 w-1/2 bg-nexus-purple/20 rounded" />
              </div>
              
              <div className="flex gap-2 mt-auto">
                <div className="h-8 w-24 bg-nexus-purple rounded-md" />
                <div className="h-8 w-24 bg-nexus-card-dark border border-nexus-purple/30 rounded-md" />
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
