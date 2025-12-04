import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Shield, Rocket, Book, 
  Wallet, Database, Lock, Globe, 
  Layers, Zap, Smartphone, RefreshCw,
  Code, Maximize2, Star
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
            <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nexus-blue/20 via-transparent to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Badge variant="outline" className="mb-6 px-6 py-3 text-base font-semibold border-nexus-blue text-nexus-light-blue bg-nexus-blue/20 backdrop-blur-sm shadow-lg shadow-nexus-blue/30 animate-pulse-glow">
                    Revolutionary AI-Powered Web3 Experience
                  </Badge>
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    <span className="block">The World's Most</span>
                    <span className="block">ECO Friendly AI Web3</span>
                    <span className="block">Browser</span>
                  </h1>
                  <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                    Step into the future with Plato W3 AI Browser, 
                    a truly immersive Web3 browser built exclusively for MacOS & Windows with seamless integration across the decentralized web.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Link to="/app">
                      <Button size="lg" className="bg-nexus-blue hover:bg-nexus-deep-blue text-white">
                        Download for MacOS <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/app">
                      <Button size="lg" variant="outline" className="border-nexus-blue text-nexus-light-blue hover:bg-nexus-blue/10">
                        Try Demo
                      </Button>
                    </Link>
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
              <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
                Crafted for MacOS
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">The Complete Web3 Experience</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Instantly connect with thousands of decentralized applications, access real-time intelligence,
                and explore the Web3 ecosystem—all through one sleek, unified interface.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Globe className="h-8 w-8 text-nexus-blue" />}
                title="Seamless dApp Access"
                description="Connect instantly to thousands of decentralized applications without additional plugins or configurations."
              />
              <FeatureCard 
                icon={<Wallet className="h-8 w-8 text-nexus-blue" />}
                title="Unified Wallet Integration"
                description="Connect and manage multiple crypto wallets in one secure, intuitive interface."
              />
              <FeatureCard 
                icon={<Zap className="h-8 w-8 text-nexus-blue" />}
                title="Blazing-Fast Performance"
                description="Optimized specifically for MacOS with native performance that outpaces traditional browsers."
              />
              <FeatureCard 
                icon={<Shield className="h-8 w-8 text-nexus-blue" />}
                title="Enhanced Security"
                description="Built-in protection against common Web3 threats, phishing attempts, and malicious smart contracts."
              />
              <FeatureCard 
                icon={<Layers className="h-8 w-8 text-nexus-blue" />}
                title="Multi-Chain Support"
                description="Seamlessly interact with all major blockchains and Layer 2 solutions in one browser."
              />
              <FeatureCard 
                icon={<Code className="h-8 w-8 text-nexus-blue" />}
                title="Developer Tools"
                description="Comprehensive suite of developer tools optimized for blockchain and Web3 development."
              />
            </div>
          </div>
        </section>

        {/* MacOS Integration Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="nexus-glass rounded-2xl p-6 shadow-lg">
                  <Tabs defaultValue="performance" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 bg-nexus-card-dark rounded-lg p-1">
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="design">Design</TabsTrigger>
                      <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="performance" className="mt-4 space-y-4">
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Native Performance</h4>
                        <p className="text-gray-400">Built specifically for Apple Silicon with optimized rendering and resource management.</p>
                      </div>
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">M-Series Optimized</h4>
                        <p className="text-gray-400">Takes full advantage of Apple's M-series processors for lightning-fast transactions and dApp interactions.</p>
                      </div>
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Memory Efficient</h4>
                        <p className="text-gray-400">Intelligent memory management keeps your Mac running smoothly even with multiple dApps open.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="design" className="mt-4 space-y-4">
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">MacOS Native UI</h4>
                        <p className="text-gray-400">Follows Apple's Human Interface Guidelines for a truly native MacOS experience.</p>
                      </div>
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">System Integration</h4>
                        <p className="text-gray-400">Seamless integration with MacOS notifications, shortcuts, and system services.</p>
                      </div>
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Dark Mode Support</h4>
                        <p className="text-gray-400">Full support for MacOS dark mode with custom themes that match your system preferences.</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="security" className="mt-4 space-y-4">
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Sandboxed Architecture</h4>
                        <p className="text-gray-400">Leverages MacOS sandboxing for enhanced security between dApps and your system.</p>
                      </div>
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Apple Keychain Integration</h4>
                        <p className="text-gray-400">Securely store sensitive wallet information using Apple's encrypted keychain technology.</p>
                      </div>
                      <div className="bg-nexus-card-dark p-4 rounded-lg">
                        <h4 className="font-medium text-lg mb-2">Privacy Controls</h4>
                        <p className="text-gray-400">Granular privacy controls aligned with MacOS standards to protect your digital identity.</p>
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
                <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
                  Built for MacOS
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Native Integration That Feels Like Magic</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Plato W3 AI Browser isn't just a browser that runs on Mac—it's built from the ground up to leverage everything 
                  MacOS has to offer, from Apple Silicon performance to system-level integration that makes your 
                  Web3 experience truly seamless.
                </p>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Designed for Apple Silicon</h4>
                      <p className="text-gray-400">Optimized specifically for M1 and M2 chips for unmatched performance.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Continuity Features</h4>
                      <p className="text-gray-400">Handoff support between your Mac, iPhone, and iPad for a seamless Web3 experience.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Keyboard Shortcuts</h4>
                      <p className="text-gray-400">Extensive keyboard shortcut support that follows MacOS conventions.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Web3 Capabilities */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
                Complete Web3 Suite
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Everything You Need, All In One Place</h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Whether you're trading, creating, or building, Plato W3 AI Browser empowers you with next-gen UI/UX,
                blazing-fast performance, and seamless integration across the decentralized web.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-nexus-card-dark border-nexus-blue/10 hover:border-nexus-blue/30 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                    <Wallet className="h-6 w-6 text-nexus-blue" />
                  </div>
                  <CardTitle>Multi-Wallet Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Monitor and manage all your wallets in one place with real-time portfolio tracking, gas optimization, and transaction history.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Advanced transaction analysis</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Cross-chain portfolio view</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Gas fee optimization</span>
                    </li>
                  </ul>
                </CardFooter>
              </Card>

              <Card className="bg-nexus-card-dark border-nexus-blue/10 hover:border-nexus-blue/30 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-nexus-blue" />
                  </div>
                  <CardTitle>dApp Connection Hub</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Discover and connect to thousands of dApps across various blockchains with our curated directory, featuring security ratings and community reviews.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>One-click dApp connections</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Security verification system</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Personalized recommendations</span>
                    </li>
                  </ul>
                </CardFooter>
              </Card>

              <Card className="bg-nexus-card-dark border-nexus-blue/10 hover:border-nexus-blue/30 transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-nexus-blue" />
                  </div>
                  <CardTitle>Security Guardian</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400">
                    Advanced protection against scams, phishing, and malicious smart contracts with real-time threat detection and risk assessment for all Web3 interactions.
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <ul className="space-y-1 text-xs text-gray-400">
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Smart contract analysis</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Phishing protection</span>
                    </li>
                    <li className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-nexus-blue/70" />
                      <span>Transaction simulation</span>
                    </li>
                  </ul>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* AI Integration */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
                  Real-Time Intelligence
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Web3 AI Assistant</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Plato W3 AI Browser comes with a built-in AI assistant that provides context, explanations, and insights
                  to help you navigate Web3 with confidence.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <Book className="h-6 w-6 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl mb-2">Blockchain Education</h4>
                      <p className="text-gray-400">Get instant explanations of complex crypto concepts and blockchain terminology as you browse.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-6 w-6 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl mb-2">Transaction Analysis</h4>
                      <p className="text-gray-400">AI-powered transaction analysis helps you understand the risks and implications before confirming.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <Maximize2 className="h-6 w-6 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-xl mb-2">Market Insights</h4>
                      <p className="text-gray-400">Get contextual information about tokens, protocols, and market trends as you browse.</p>
                    </div>
                  </div>
                </div>
                
                <Link to="/ai-features">
                  <Button size="lg" className="mt-8 bg-nexus-blue hover:bg-nexus-deep-blue text-white">
                    See AI Features in Action
                  </Button>
                </Link>
              </div>
              
              <div className="nexus-glass rounded-2xl p-6 shadow-lg animate-pulse-glow">
                <div className="bg-nexus-card-dark rounded-xl p-5 max-h-[500px] overflow-hidden">
                  <div className="flex flex-col space-y-4">
                    <div className="self-end max-w-[80%] bg-nexus-blue text-white p-3 rounded-lg">
                      What's the difference between ERC-20 and ERC-721 tokens?
                    </div>
                    
                    <div className="self-start max-w-[80%] bg-secondary border border-border p-3 rounded-lg">
                      <p>ERC-20 and ERC-721 are both token standards on the Ethereum blockchain, but they serve different purposes:</p>
                      <p className="mt-2"><strong>ERC-20:</strong> Fungible tokens where each token is identical to every other token. Used for cryptocurrencies, utility tokens, and governance tokens. Examples include USDC, DAI, and most DeFi tokens.</p>
                      <p className="mt-2"><strong>ERC-721:</strong> Non-fungible tokens (NFTs) where each token has unique properties and metadata. Used for digital art, collectibles, and representing unique assets. Examples include CryptoPunks and Bored Ape Yacht Club.</p>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs font-medium mb-1">Relevant projects in your browsing history:</p>
                        <ul className="space-y-1">
                          <li className="text-xs">
                            <a href="#" className="text-nexus-blue underline hover:text-nexus-deep-blue">
                              Uniswap (uses ERC-20)
                            </a>
                          </li>
                          <li className="text-xs">
                            <a href="#" className="text-nexus-blue underline hover:text-nexus-deep-blue">
                              OpenSea (uses ERC-721)
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="self-end max-w-[80%] bg-nexus-blue text-white p-3 rounded-lg">
                      Can you analyze this smart contract before I connect my wallet?
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Developer Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <div className="nexus-glass rounded-2xl p-6 shadow-lg">
                  <div className="bg-nexus-card-dark rounded-lg p-4 overflow-hidden font-mono text-sm">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span>smart-contract.sol</span>
                      </div>
                      
                      <div className="text-gray-300">
                        <span className="text-blue-400">contract</span> <span className="text-green-400">PlatoDemo</span> {"{"}
                      </div>
                      <div className="text-gray-300 pl-4">
                        <span className="text-blue-400">mapping</span>(<span className="text-blue-400">address</span> {"=>"} <span className="text-blue-400">uint256</span>) <span className="text-yellow-400">public</span> balances;
                      </div>
                      <div className="text-gray-300 pl-4">
                        <span className="text-blue-400">event</span> <span className="text-green-400">Deposit</span>(<span className="text-blue-400">address</span> indexed from, <span className="text-blue-400">uint256</span> amount);
                      </div>
                      <div className="text-gray-300 pl-4">
                        <span className="text-yellow-400">function</span> <span className="text-green-400">deposit</span>() <span className="text-yellow-400">public payable</span> {"{"}
                      </div>
                      <div className="text-gray-300 pl-8">
                        balances[msg.sender] += msg.value;
                      </div>
                      <div className="text-gray-300 pl-8">
                        <span className="text-yellow-400">emit</span> Deposit(msg.sender, msg.value);
                      </div>
                      <div className="text-gray-300 pl-4">{"}"}</div>
                      <div className="text-gray-300">{"}"}</div>
                      
                      <div className="mt-4 border-t border-gray-700 pt-3">
                        <div className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-green-500/20 flex items-center justify-center mr-2">
                            <Shield className="h-3 w-3 text-green-400" />
                          </div>
                          <span className="text-green-400 text-xs">No vulnerabilities detected</span>
                        </div>
                        
                        <div className="flex items-center mt-2">
                          <div className="h-5 w-5 rounded-full bg-blue-500/20 flex items-center justify-center mr-2">
                            <Database className="h-3 w-3 text-blue-400" />
                          </div>
                          <span className="text-gray-400 text-xs">Gas estimate: ~34,500</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
                  Developer Tools
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Built by Developers, for Developers</h2>
                <p className="text-lg text-gray-300 mb-8">
                  Plato W3 AI Browser provides an exceptional development experience with specialized tools for Web3 developers,
                  making it easier than ever to build, test, and deploy decentralized applications.
                </p>
                
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Smart Contract Inspector</h4>
                      <p className="text-gray-400">Analyze and debug smart contracts with our built-in security scanner and gas optimizer.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Web3 DevTools</h4>
                      <p className="text-gray-400">Exclusive developer tools for blockchain interactions, transaction simulation, and state inspection.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                      <ArrowRight className="h-3 w-3 text-nexus-blue" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Local Development Environment</h4>
                      <p className="text-gray-400">Test your dApps in a sandboxed environment with simulated blockchain conditions.</p>
                    </div>
                  </div>
                </div>
                
                <Button size="lg" variant="outline" className="mt-8 border-nexus-blue text-nexus-light-blue hover:bg-nexus-blue/10">
                  Developer Documentation
                </Button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
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
    <Card className="bg-nexus-card-dark border-nexus-blue/10 hover:border-nexus-blue/30 transition-all h-full">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
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
