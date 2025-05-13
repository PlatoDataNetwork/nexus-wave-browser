
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download, Github } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto text-center">
      <div className="relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready to Experience the Future of Web Browsing?
        </h2>
        <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Join thousands of early adopters who are already enjoying a seamless, secure, and
          decentralized browsing experience with Nexus Wave.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/app">
            <Button size="lg" className="bg-nexus-purple hover:bg-nexus-deep-purple text-white">
              Try Browser Now
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="border-nexus-purple text-nexus-light-purple hover:bg-nexus-purple/10">
            <Github className="mr-2 h-5 w-5" />
            View On Github
          </Button>
          <Button size="lg" variant="link" className="text-nexus-light-purple">
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-12 flex items-center justify-center space-x-8">
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-purple mb-2">50K+</span>
            <span className="text-sm text-gray-400">Active Users</span>
          </div>
          <div className="h-10 border-l border-gray-700" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-purple mb-2">120+</span>
            <span className="text-sm text-gray-400">Supported dApps</span>
          </div>
          <div className="h-10 border-l border-gray-700" />
          <div className="flex flex-col items-center">
            <span className="text-3xl font-bold text-nexus-purple mb-2">10M+</span>
            <span className="text-sm text-gray-400">Transactions Secured</span>
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
