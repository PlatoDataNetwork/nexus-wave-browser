import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import ComingSoonModal from "@/components/Downloads/ComingSoonModal";

const CallToAction: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleMacOSDownload = () => {
    setShowModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="relative z-10">
        <h2 className="text-2xl md:text-4xl font-bold mb-6 tracking-tight">
          <span className="block">Search. Browse. Earn.</span>
          <span className="block">The Way Web3 was Meant to Be.</span>
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Step into the future with TMRW W3AI Browser, a truly immersive Web3 browser built
          for both MacOS & PC with seamless integration across the decentralized web.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            variant="macos" 
            size="macos-lg" 
            className="rounded-lg shadow-lg"
            onClick={handleMacOSDownload}
          >
            <Download className="mr-2 h-5 w-5" />
            Download for MacOS
          </Button>
          <Link to="/app">
            <Button size="macos-lg" variant="macos-light" className="rounded-lg">
              <Globe className="mr-2 h-5 w-5" />
              Try Web Version
            </Button>
          </Link>
          <Button size="macos-lg" variant="link" className="text-nexus-light-blue">
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-blue mb-2">10K+</span>
            <span className="text-sm text-gray-400">Digital Assets</span>
          </div>
          <div className="h-10 border-l border-gray-700" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-blue mb-2">5,000+</span>
            <span className="text-sm text-gray-400">dApps Supported</span>
          </div>
          <div className="h-10 border-l border-gray-700" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-blue mb-2">30+</span>
            <span className="text-sm text-gray-400">Blockchain Protocols</span>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute bottom-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-nexus-blue/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-60 h-60 bg-nexus-blue/5 rounded-full blur-3xl" />
      </div>

      <ComingSoonModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        platform="macOS"
      />
    </div>
  );
};

export default CallToAction;
