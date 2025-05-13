
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Shield, Rocket, Book, 
  Wallet, Database, Lock, Globe, 
  Layers, Zap, Smartphone, RefreshCw 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BrowserPreview from "@/components/Marketing/BrowserPreview";
import FeatureShowcase from "@/components/Marketing/FeatureShowcase";
import TestimonialSlider from "@/components/Marketing/TestimonialSlider";
import CallToAction from "@/components/Marketing/CallToAction";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const LandingPage: React.FC = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <MotionConfig>
      <div className="bg-nexus-space-black min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-nexus-dark-blue opacity-50" />
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nexus-purple/20 via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
                    Next Generation Web3 Browser
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Experience The Future Of Browsing
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                    Nexus Wave Browser seamlessly integrates Web3 functionality into a secure, 
                    private browsing experience designed for the decentralized future.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/app">
                      <Button size="lg" className="bg-nexus-purple hover:bg-nexus-deep-purple text-white">
                        Try Browser Now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="lg" variant="outline" className="border-nexus-purple text-nexus-light-purple hover:bg-nexus-purple/10">
                      View Features
                    </Button>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="nexus-glass rounded-2xl p-1 shadow-lg animate-pulse-glow">
                  <AspectRatio ratio={16/9} className="overflow-hidden rounded-xl">
                    <BrowserPreview />
                  </AspectRatio>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Overview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
                Powerful Features
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">The Most Innovative Browser</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Designed from the ground up to redefine how you interact with both traditional and decentralized web.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-nexus-purple" />}
                title="Enhanced Privacy"
                description="Built-in privacy features block trackers, fingerprinting, and unwanted ads while maintaining full browsing speed."
              />
              <FeatureCard 
                icon={<Wallet className="h-8 w-8 text-nexus-purple" />}
                title="Web3 Integration"
                description="Connect to dApps and manage your crypto assets seamlessly within your browser environment."
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-nexus-purple" />}
                title="Lightning Fast"
                description="Engineered for performance with optimized rendering and resource management."
              />
              <FeatureCard 
                icon={<Database className="h-8 w-8 text-nexus-purple" />}
                title="Decentralized Apps"
                description="Access and interact with the growing ecosystem of decentralized applications."
              />
              <FeatureCard 
                icon={<Lock className="h-8 w-8 text-nexus-purple" />}
                title="Enhanced Security"
                description="Advanced security protocols protect your data and digital assets from threats."
              />
              <FeatureCard 
                icon={<RefreshCw className="h-8 w-8 text-nexus-purple" />}
                title="Sync Across Devices"
                description="Your browsing experience, bookmarks, and Web3 identities follow you across all your devices."
              />
            </div>
          </div>
        </section>

        {/* Web3 Connectivity */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="h-full w-full bg-gradient-to-b from-nexus-dark-blue to-nexus-space-black" />
          </div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="nexus-glass rounded-2xl p-6 shadow-lg">
                  <Tabs defaultValue="wallets" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-nexus-card-dark rounded-lg p-1">
                      <TabsTrigger value="wallets">Wallets</TabsTrigger>
                      <TabsTrigger value="dapps">dApps</TabsTrigger>
                      <TabsTrigger value="protocols">Protocols</TabsTrigger>
                    </TabsList>
                    <TabsContent value="wallets" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {["MetaMask", "Coinbase Wallet", "Trust Wallet", "Nexus Wallet"].map((wallet, i) => (
                          <div key={i} className="bg-nexus-card-dark p-4 rounded-lg flex items-center gap-3 hover:bg-nexus-purple/10 transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-full bg-nexus-purple/20 flex items-center justify-center">
                              <Wallet className="h-5 w-5 text-nexus-purple" />
                            </div>
                            <span>{wallet}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="dapps" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {["Uniswap", "Aave", "The Graph", "Lens Protocol"].map((dapp, i) => (
                          <div key={i} className="bg-nexus-card-dark p-4 rounded-lg flex items-center gap-3 hover:bg-nexus-purple/10 transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-full bg-nexus-purple/20 flex items-center justify-center">
                              <Globe className="h-5 w-5 text-nexus-purple" />
                            </div>
                            <span>{dapp}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="protocols" className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        {["Ethereum", "Solana", "Polkadot", "Cosmos"].map((protocol, i) => (
                          <div key={i} className="bg-nexus-card-dark p-4 rounded-lg flex items-center gap-3 hover:bg-nexus-purple/10 transition-all cursor-pointer">
                            <div className="h-10 w-10 rounded-full bg-nexus-purple/20 flex items-center justify-center">
                              <Layers className="h-5 w-5 text-nexus-purple" />
                            </div>
                            <span>{protocol}</span>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
                  Web3 First
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Seamless Blockchain Integration</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Nexus Wave Browser is built from the ground up with Web3 in mind. Connect to your favorite wallets, 
                  interact with dApps, and manage your digital assets all from within a secure, intuitive interface.
                </p>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-purple/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Multi-Wallet Support</h4>
                      <p className="text-gray-400">Connect and manage multiple wallets across different blockchains</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-purple/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">One-Click dApp Access</h4>
                      <p className="text-gray-400">Instantly connect to decentralized applications without additional plugins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-purple/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Cross-Chain Compatibility</h4>
                      <p className="text-gray-400">Support for all major blockchains and Layer 2 solutions</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
                Enterprise-Grade Security
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Protection At Every Layer</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Your data and digital assets deserve the highest level of protection. Nexus Wave goes beyond
                standard security to provide a truly private browsing experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Anti-Phishing Protection",
                  description: "Real-time detection of malicious websites and phishing attempts targeting Web3 users."
                },
                {
                  title: "Secure Transaction Verification",
                  description: "Double-check transactions before signing to prevent theft and scams."
                },
                {
                  title: "Tracker Blocking",
                  description: "Comprehensive protection against trackers, fingerprinting, and data collection."
                },
                {
                  title: "Private Browsing Mode",
                  description: "Enhanced privacy mode that leaves no trace of your browsing activity."
                },
                {
                  title: "Smart Contract Analysis",
                  description: "Detect potentially harmful smart contracts before interacting with them."
                },
                {
                  title: "VPN Integration",
                  description: "Built-in support for VPN connections to further enhance your privacy."
                }
              ].map((feature, i) => (
                <Card key={i} className="bg-nexus-card-dark border-nexus-purple/10 hover:border-nexus-purple/30 transition-all">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-nexus-purple" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* AI Integration */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
                  AI-Powered
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Intelligent Browsing Assistant</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Our built-in AI assistant helps you navigate both Web2 and Web3, providing context, explanations,
                  and insights as you browse.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center flex-shrink-0">
                      <Book className="h-6 w-6 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl mb-2">Decode Crypto Concepts</h4>
                      <p className="text-gray-400">Get instant explanations of complex crypto and blockchain terminology while browsing.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl mb-2">Smart Security Alerts</h4>
                      <p className="text-gray-400">Receive intelligent warnings about potential security risks before connecting your wallet.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center flex-shrink-0">
                      <Smartphone className="h-6 w-6 text-nexus-purple" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl mb-2">Natural Language Search</h4>
                      <p className="text-gray-400">Ask questions in plain language and get intelligent, contextual responses from across the web.</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" className="mt-8 bg-nexus-purple hover:bg-nexus-deep-purple text-white">
                  Explore AI Features
                </Button>
              </div>
              
              <div className="nexus-glass rounded-2xl p-6 shadow-lg animate-pulse-glow">
                <div className="bg-nexus-card-dark rounded-xl p-5 max-h-[500px] overflow-hidden">
                  <div className="flex flex-col space-y-4">
                    <div className="self-end max-w-[80%] bg-nexus-purple text-white p-3 rounded-lg">
                      What is the difference between Layer 1 and Layer 2 blockchains?
                    </div>
                    
                    <div className="self-start max-w-[80%] bg-secondary border border-border p-3 rounded-lg">
                      <p>Layer 1 blockchains are the base protocols like Ethereum, Bitcoin, and Solana that process and finalize transactions directly on their own blockchain.</p>
                      <p className="mt-2">Layer 2 solutions are built on top of Layer 1 blockchains to improve scalability, speed, and transaction costs. They handle transactions off the main chain but derive their security from the Layer 1.</p>
                      <p className="mt-2">Examples of Layer 2 solutions include Optimism, Arbitrum, and zkSync for Ethereum.</p>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs font-medium mb-1">Sources:</p>
                        <ul className="space-y-1">
                          <li className="text-xs">
                            <a href="#" className="text-nexus-purple underline hover:text-nexus-deep-purple">
                              Ethereum.org - Layer 2 Scaling
                            </a>
                          </li>
                          <li className="text-xs">
                            <a href="#" className="text-nexus-purple underline hover:text-nexus-deep-purple">
                              Blockchain Fundamentals - Scaling Solutions
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="self-end max-w-[80%] bg-nexus-purple text-white p-3 rounded-lg">
                      Which Layer 2 solutions have the highest TVL currently?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Cross-Device Experience */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
                Seamless Experience
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Everywhere You Are</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Nexus Wave synchronizes your browsing experience across all your devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Desktop",
                  description: "Available for Windows, macOS, and Linux with full feature parity across all platforms.",
                  icon: <Layers />
                },
                {
                  title: "Mobile",
                  description: "Take your Web3 browsing experience on the go with our iOS and Android applications.",
                  icon: <Smartphone />
                },
                {
                  title: "Browser Extension",
                  description: "Extend your existing browser with our powerful Web3 capabilities and security features.",
                  icon: <Zap />
                }
              ].map((platform, i) => (
                <Card key={i} className="bg-nexus-card-dark border-nexus-purple/10 hover:border-nexus-purple/30 transition-all">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center mb-4">
                      {React.cloneElement(platform.icon, { className: "h-6 w-6 text-nexus-purple" })}
                    </div>
                    <CardTitle>{platform.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{platform.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="border-nexus-purple text-nexus-light-purple hover:bg-nexus-purple/10">
                      Learn More
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <TestimonialSlider />
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <CallToAction />
        </section>
      </div>
    </MotionConfig>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card className="bg-nexus-card-dark border-nexus-purple/10 hover:border-nexus-purple/30 transition-all h-full">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default LandingPage;
