
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Apple, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ComingSoonModal from "@/components/Downloads/ComingSoonModal";

const Downloads: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'MacOS' | 'Windows'>('MacOS');

  const handleDownloadClick = (platform: 'MacOS' | 'Windows') => {
    console.log(`Download clicked for ${platform}`);
    setSelectedPlatform(platform);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 container max-w-screen-xl mx-auto py-10 px-4 md:px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            Download Nexus Wave Browser
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Experience the future of web browsing with our secure, privacy-focused browser built for Web3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* MacOS Download Section */}
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="h-48 bg-gradient-to-br from-[#1E1E1E] to-[#2D2D2D] flex items-center justify-center">
              <Apple className="h-24 w-24 text-white" />
            </div>
            <CardContent className="p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Download for Mac</h2>
                <p className="text-muted-foreground">
                  Optimized for MacOS with native performance and features.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDownloadClick('MacOS')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Download className="h-5 w-5" />
                  Download for MacOS
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Compatible with MacOS 11.0 or later
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Windows Download Section */}
          <Card className="overflow-hidden border-2 border-primary/5 hover:border-primary/20 transition-all duration-300">
            <div className="h-48 bg-gradient-to-br from-[#0078D7] to-[#0063B1] flex items-center justify-center">
              <svg className="h-24 w-24 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0,0L9.5,1.4V11.4H0ZM10.5,1.6L24,3.5V11.4H10.5ZM0,12.6H9.5V22.6L0,24ZM10.5,12.6H24V20.5L10.5,22.4Z" />
              </svg>
            </div>
            <CardContent className="p-6 flex flex-col gap-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Download for PC</h2>
                <p className="text-muted-foreground">
                  Built for Windows with seamless integration and performance.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => handleDownloadClick('Windows')}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <Download className="h-5 w-5" />
                  Download for Windows
                </button>
                <p className="text-xs text-muted-foreground text-center">
                  Compatible with Windows 10 or later
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Mobile Downloads */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Also Available on Mobile</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" 
                alt="Download on the App Store" 
                className="h-12 w-auto"
              />
            </a>
            <a 
              href="#" 
              target="_blank"
              rel="noopener noreferrer"
            >
              <img 
                src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" 
                alt="Get it on Google Play" 
                className="h-12 w-auto"
              />
            </a>
          </div>
        </div>
        
        {/* System Requirements */}
        <div className="mt-12 max-w-3xl mx-auto border-t border-border pt-8">
          <h3 className="text-xl font-bold mb-4">System Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">MacOS</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>MacOS 11.0 or later</li>
                <li>Apple M1/M2/M3 or Intel processor</li>
                <li>4 GB RAM minimum</li>
                <li>1 GB available storage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Windows</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Windows 10 or later</li>
                <li>Intel or AMD processor</li>
                <li>4 GB RAM minimum</li>
                <li>1 GB available storage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <ComingSoonModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        platform={selectedPlatform}
      />
    </div>
  );
};

export default Downloads;
