
import React from "react";
import { Bookmark, Globe } from "lucide-react";

interface WebviewFrameProps {
  url: string;
}

const WebviewFrame: React.FC<WebviewFrameProps> = ({ url }) => {
  // Extract domain for display purposes
  const domain = url.replace(/^https?:\/\//, "").split("/")[0];
  
  return (
    <div className="flex flex-col h-full border border-border rounded-md overflow-hidden">
      {/* Simulated browser content - in a real implementation this would be a webview */}
      <div className="flex-1 bg-card p-4 nexus-scrollbar overflow-y-auto">
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
            <button className="px-4 py-2 bg-nexus-purple hover:bg-nexus-light-purple text-white rounded-md transition-colors flex items-center mx-auto">
              <Bookmark className="h-4 w-4 mr-2" />
              Add to Bookmarks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebviewFrame;
