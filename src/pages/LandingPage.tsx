
import React from "react";
import { useNavigate } from "react-router-dom";
import CallToAction from "@/components/Marketing/CallToAction";
import FeatureShowcase from "@/components/Marketing/FeatureShowcase";
import TestimonialSlider from "@/components/Marketing/TestimonialSlider";
import BrowserPreview from "@/components/Marketing/BrowserPreview";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Globe, Wallet, Layers, Lock, Zap } from "lucide-react";
import { FeatureProps } from "@/components/Marketing/FeatureShowcase";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Define browser features
  const browserFeatures: FeatureProps[] = [
    {
      icon: Globe,
      title: "Web3 Integration",
      description: "Seamlessly navigate between Web2 and Web3 with built-in wallet and dApp support."
    },
    {
      icon: Shield,
      title: "Enhanced Privacy",
      description: "Advanced tracking protection and secure browsing with integrated VPN capabilities."
    },
    {
      icon: Wallet,
      title: "Built-in Crypto Wallet",
      description: "Manage your digital assets directly in your browser with multi-chain support."
    },
    {
      icon: Layers,
      title: "Protocol Support",
      description: "Native support for IPFS, ENS, and other decentralized protocols."
    },
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "Your data stays private with encrypted sync across all your devices."
    },
    {
      icon: Zap,
      title: "Lightning Fast Performance",
      description: "Optimized rendering engine provides the fastest browsing experience."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black text-gray-900 dark:text-white">
      <Header />

      {/* Hero Section */}
      <main className="flex-1">
        {/* Hero Section with MacOS-style glass effect */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nexus-purple/10 rounded-full filter blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nexus-light-purple/10 rounded-full filter blur-3xl"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                The Next Generation Web3 Browser
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                Experience seamless navigation between Web2 and Web3 with Nexus Wave - the browser built for the decentralized future.
              </p>
              
              <CallToAction />
            </div>
          </div>
        </section>

        {/* Browser Preview Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BrowserPreview />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Designed for the Modern Web
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover how Nexus Wave is redefining browsing with integrated Web3 capabilities and unmatched security.
              </p>
            </div>
            
            <FeatureShowcase 
              features={browserFeatures} 
              title="Key Features" 
              subtitle="Explore the powerful capabilities of the Nexus Wave browser"
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
                Trusted by Developers & Users
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                See what early adopters are saying about their experience with Nexus Wave.
              </p>
            </div>
            
            <TestimonialSlider />
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-nexus-purple/10 rounded-3xl backdrop-blur-sm p-12 border border-nexus-purple/20">
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Join the Decentralized Future?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Download Nexus Wave today and experience the web as it was meant to be - open, secure, and decentralized.
                </p>
                <Button 
                  variant="macos" 
                  size="macos-lg" 
                  className="rounded-lg shadow-lg"
                  onClick={() => navigate("/app")}
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
