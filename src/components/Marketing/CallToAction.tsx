import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
          Web3. The Way It Was Meant To Be.
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join thousands of early adopters who are already trading, creating, and building 
          in the decentralized web with Nexus Wave's seamless MacOS integration.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/app">
            <Button variant="macos" size="macos-lg" className="rounded-lg shadow-lg">
              <Download className="mr-2 h-5 w-5" />
              Download for MacOS
            </Button>
          </Link>
          <Button size="macos-lg" variant="macos-light" className="rounded-lg">
            <Globe className="mr-2 h-5 w-5" />
            Try Web Version
          </Button>
          <Button size="macos-lg" variant="link" className="text-nexus-light-purple">
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-purple mb-2">100K+</span>
            <span className="text-sm text-gray-400">Active Users</span>
          </div>
          <div className="h-10 border-l border-gray-700" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-purple mb-2">5,000+</span>
            <span className="text-sm text-gray-400">dApps Supported</span>
          </div>
          <div className="h-10 border-l border-gray-700" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-purple mb-2">15+</span>
            <span className="text-sm text-gray-400">Blockchain Networks</span>
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute bottom-0 left-0 w-full h-full -z-10 overflow-hidden">
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-nexus-purple/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-60 h-60 bg-nexus-purple/5 rounded-full blur-3xl" />
      </div>
    </div>
  );
};

export default CallToAction;
