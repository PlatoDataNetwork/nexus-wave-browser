
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Globe, Users, TrendingUp, Download } from "lucide-react";
import { Link } from "react-router-dom";
import BrowserPreview from "@/components/Marketing/BrowserPreview";
import FeatureShowcase from "@/components/Marketing/FeatureShowcase";
import TestimonialSlider from "@/components/Marketing/TestimonialSlider";
import CallToAction from "@/components/Marketing/CallToAction";

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: "Privacy First",
      description: "Built-in ad blocking, tracker protection, and enhanced privacy controls to keep your browsing secure."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized performance with faster page loads and seamless Web3 integration."
    },
    {
      icon: Globe,
      title: "Web3 Native",
      description: "Native support for decentralized applications, crypto wallets, and blockchain protocols."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-nexus-space-black via-nexus-card-navy to-nexus-space-black">
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  <span className="block text-white">The Future of</span>
                  <span className="block bg-gradient-to-r from-nexus-purple via-nexus-light-purple to-nexus-purple bg-clip-text text-transparent">
                    Web3 Browsing
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                  Experience the next generation of web browsing with NexusWave. 
                  Built for privacy, speed, and seamless Web3 integration.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button size="lg" className="bg-nexus-purple hover:bg-nexus-deep-purple text-white rounded-xl px-8 py-4 text-lg">
                  <Download className="mr-2 h-5 w-5" />
                  Download Now
                </Button>
                <Link to="/app">
                  <Button variant="outline" size="lg" className="border-nexus-purple text-nexus-purple hover:bg-nexus-purple/10 rounded-xl px-8 py-4 text-lg">
                    Try Web Version <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center space-x-8 pt-8">
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">100K+</span>
                  <span className="text-sm text-gray-400">Users</span>
                </div>
                <div className="h-8 border-l border-gray-700" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">99.9%</span>
                  <span className="text-sm text-gray-400">Uptime</span>
                </div>
                <div className="h-8 border-l border-gray-700" />
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">24/7</span>
                  <span className="text-sm text-gray-400">Support</span>
                </div>
              </div>
            </div>
            
            <div className="lg:pl-8">
              <div className="relative h-[500px] lg:h-[600px]">
                <BrowserPreview />
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative background elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-nexus-purple/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-nexus-purple/10 rounded-full blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-nexus-card-navy/30">
        <div className="max-w-7xl mx-auto">
          <FeatureShowcase 
            features={features}
            title="Why Choose NexusWave?"
            subtitle="Discover the features that make NexusWave the ultimate Web3 browser experience."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Trusted by Web3 Users Worldwide
          </h2>
          <p className="text-gray-300 mb-12 max-w-2xl mx-auto">
            Join thousands of users who have already made the switch to a better browsing experience.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-nexus-purple" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">100K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Globe className="h-12 w-12 text-nexus-purple" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">5,000+</div>
              <div className="text-gray-400">dApps Supported</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-nexus-purple" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-gray-400">Security Score</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-nexus-purple" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">15+</div>
              <div className="text-gray-400">Blockchain Networks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-nexus-card-navy/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              What Users Say About NexusWave
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Hear from our community of users who have transformed their browsing experience.
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-6 relative">
        <CallToAction />
      </section>
    </div>
  );
};

export default LandingPage;
