
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import { Shield, Globe, Rocket, Search, Lock, Bookmark } from "lucide-react";

const InvestorHomepage: React.FC = () => {
  return (
    <div className="flex flex-col w-full h-full overflow-auto bg-gradient-to-br from-[#171f2e] to-[#2a2d3e] text-white">
      {/* Hero Section */}
      <section className="pt-16 px-6 md:px-12 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-nexus-purple to-blue-400 bg-clip-text text-transparent mb-6">
            Nexus Wave Browser
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            The Next Generation Web3 Browsing Experience for the Decentralized Future
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button className="bg-nexus-purple hover:bg-nexus-deep-purple text-white px-8 py-6 text-lg">
              View Demo
            </Button>
            <Button variant="outline" className="border-nexus-purple text-nexus-purple hover:bg-nexus-purple/10 px-8 py-6 text-lg">
              Investment Deck
            </Button>
          </div>
        </div>

        {/* Browser Preview */}
        <div className="relative w-full max-w-5xl mx-auto mb-16">
          <div className="absolute inset-0 bg-nexus-purple/20 blur-3xl rounded-full"></div>
          <div className="relative bg-card border border-border rounded-lg shadow-2xl overflow-hidden">
            <div className="h-8 bg-card border-b border-border flex items-center px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-xs font-medium">Nexus Wave Browser - Web3 V2.1</div>
            </div>
            <div className="p-4">
              <img 
                src="/placeholder.svg" 
                alt="Nexus Wave Browser Preview" 
                className="w-full h-80 object-cover object-top bg-gray-800 rounded border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="bg-black/20 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10 text-nexus-purple">Market Opportunity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard title="Market Size" value="$27.5B" description="Projected browser market by 2026" />
            <MetricCard title="Web3 Growth" value="136%" description="Year-over-year growth in Web3 adoption" />
            <MetricCard title="Target Users" value="580M+" description="Cryptocurrency users worldwide by 2025" />
            <MetricCard title="Revenue Potential" value="$1.2B" description="Estimated annual revenue by year 5" />
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Revolutionary Features</h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Nexus Wave combines cutting-edge browsing capabilities with seamless Web3 integration
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-green-500" />}
              title="Enhanced Security"
              description="Industry-leading protection against tracking, malware, and phishing with built-in Web3 wallet protection"
            />
            <FeatureCard 
              icon={<Globe className="h-8 w-8 text-blue-500" />}
              title="Web3 Integration"
              description="Seamless access to decentralized apps, NFT marketplaces, and blockchain platforms"
            />
            <FeatureCard 
              icon={<Rocket className="h-8 w-8 text-purple-500" />}
              title="Performance"
              description="Optimized rendering engine delivers 2x faster page loads than traditional browsers"
            />
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-yellow-500" />}
              title="AI-Powered Search"
              description="Intelligent, privacy-focused search with conversational AI built on multiple LLMs"
            />
            <FeatureCard 
              icon={<Lock className="h-8 w-8 text-red-500" />}
              title="Privacy First"
              description="Zero data collection policy with complete control over your browsing information"
            />
            <FeatureCard 
              icon={<Bookmark className="h-8 w-8 text-indigo-500" />}
              title="Extension Ecosystem"
              description="Curated Web3 extensions marketplace with security verification"
            />
          </div>
        </div>
      </section>

      {/* Testimonials/Partners */}
      <section className="bg-black/20 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Strategic Partners</h2>
          
          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {[1, 2, 3, 4].map((item) => (
                <CarouselItem key={item} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <Card className="border-border bg-card/50 backdrop-blur-sm h-56">
                      <CardHeader className="pb-2">
                        <div className="w-20 h-20 bg-gray-700 rounded-md mb-2"></div>
                        <CardTitle className="text-lg">Partner {item}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-400">
                          "Nexus Wave represents the future of secure Web3 browsing experience."
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex">
              <CarouselPrevious className="-left-5 bg-nexus-purple border-none text-white" />
              <CarouselNext className="-right-5 bg-nexus-purple border-none text-white" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Roadmap */}
      <section className="py-16 px-6 bg-gradient-to-b from-transparent to-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Roadmap to Success</h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Our strategic plan for market expansion and feature development
          </p>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-nexus-purple/30"></div>
            
            <div className="space-y-16">
              <RoadmapItem 
                phase="Phase 1: Q3 2025"
                title="Public Beta Launch" 
                features={["Initial browser release", "Core Web3 integrations", "Basic security features"]}
              />
              
              <RoadmapItem 
                phase="Phase 2: Q1 2026"
                title="Market Expansion" 
                features={["Mobile app release", "Enhanced dApp support", "Partner integrations"]}
                isRight={true}
              />
              
              <RoadmapItem 
                phase="Phase 3: Q3 2026"
                title="Enterprise Adoption" 
                features={["Corporate security solutions", "Institutional partnerships", "Advanced feature set"]}
              />
              
              <RoadmapItem 
                phase="Phase 4: 2027"
                title="Global Scaling" 
                features={["Worldwide marketing", "Localization for major markets", "Advanced AI implementations"]}
                isRight={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Investment Opportunity */}
      <section className="py-16 px-6 bg-gradient-to-b from-black/30 to-nexus-dark-blue">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Investment Opportunity</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Join us in revolutionizing the way users experience the web and interact with Web3 technologies
          </p>
          
          <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-8 mb-12">
            <h3 className="text-2xl font-bold mb-4">Series A Funding Round</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-3xl font-bold text-nexus-purple">$12M</p>
                <p className="text-sm text-gray-400">Funding Target</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-nexus-purple">$85M</p>
                <p className="text-sm text-gray-400">Valuation</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-nexus-purple">14.1%</p>
                <p className="text-sm text-gray-400">Equity Offered</p>
              </div>
            </div>
            
            <Button className="bg-nexus-purple hover:bg-nexus-deep-purple text-white px-8 py-6 text-lg">
              Request Investor Deck
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-gray-400 text-sm">
          <p className="mb-2">© 2025 Nexus Wave | Confidential Investment Presentation</p>
          <p>This document contains proprietary information. Unauthorized disclosure is prohibited.</p>
        </div>
      </footer>
    </div>
  );
};

// Helper Components
type MetricCardProps = {
  title: string;
  value: string;
  description: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => (
  <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 flex flex-col items-center text-center transition-all hover:bg-card/50">
    <h3 className="text-lg font-medium text-gray-300 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-nexus-purple mb-2">{value}</p>
    <p className="text-sm text-gray-400">{description}</p>
  </div>
);

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-card/20 backdrop-blur-sm border border-border rounded-lg p-6 transition-all hover:scale-105 hover:bg-card/30">
    <div className="bg-black/30 p-3 rounded-lg inline-block mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </div>
);

type RoadmapItemProps = {
  phase: string;
  title: string;
  features: string[];
  isRight?: boolean;
};

const RoadmapItem: React.FC<RoadmapItemProps> = ({ phase, title, features, isRight = false }) => (
  <div className={`flex items-center ${isRight ? 'flex-row-reverse' : ''}`}>
    <div className={`w-1/2 ${isRight ? 'text-left' : 'text-right'} px-8`}>
      <p className="text-nexus-purple font-medium mb-2">{phase}</p>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <ul className={`space-y-1 text-gray-400 ${isRight ? 'pl-5' : 'pr-5'}`}>
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    </div>
    
    <div className="relative z-10 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full bg-nexus-purple border-4 border-background"></div>
    </div>
    
    <div className="w-1/2"></div>
  </div>
);

export default InvestorHomepage;
