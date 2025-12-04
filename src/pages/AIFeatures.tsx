import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, Brain, Sparkles, MessageSquare, 
  Search, Shield, Zap, Globe, Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

const AIFeatures: React.FC = () => {
  return (
    <div className="bg-nexus-space-black min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-nexus-dark-blue opacity-50" />
        <div className="absolute inset-0 z-0">
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-nexus-blue/20 via-transparent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 px-6 py-3 text-base font-semibold border-nexus-blue text-nexus-light-blue bg-nexus-blue/20 backdrop-blur-sm shadow-lg shadow-nexus-blue/30">
              W3 AI Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              <span className="block">AI-Powered Web3</span>
              <span className="block">Intelligence</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Experience the future of browsing with integrated AI that understands Web3, 
              assists your transactions, and enhances your decentralized experience.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/app">
                <Button size="lg" className="bg-nexus-blue hover:bg-nexus-deep-blue text-white">
                  Try W3 AI Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Intelligent Features</h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Our AI assistant is designed specifically for Web3, helping you navigate the decentralized web safely and efficiently.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="h-8 w-8 text-nexus-blue" />}
              title="Smart Contract Analysis"
              description="AI-powered analysis of smart contracts before you interact, identifying potential risks and explaining functionality in plain language."
            />
            <FeatureCard 
              icon={<Search className="h-8 w-8 text-nexus-blue" />}
              title="Intelligent Search"
              description="Natural language search across dApps, tokens, NFTs, and blockchain data with AI-enhanced results and recommendations."
            />
            <FeatureCard 
              icon={<MessageSquare className="h-8 w-8 text-nexus-blue" />}
              title="AI Chat Assistant"
              description="Get instant answers about blockchain technology, transaction help, and Web3 guidance from your personal AI assistant."
            />
            <FeatureCard 
              icon={<Shield className="h-8 w-8 text-nexus-blue" />}
              title="Threat Detection"
              description="Real-time AI monitoring for phishing attempts, malicious contracts, and suspicious transaction patterns."
            />
            <FeatureCard 
              icon={<Zap className="h-8 w-8 text-nexus-blue" />}
              title="Transaction Optimization"
              description="AI suggests optimal gas prices, timing, and routes for your transactions to minimize costs and maximize efficiency."
            />
            <FeatureCard 
              icon={<Globe className="h-8 w-8 text-nexus-blue" />}
              title="Multi-Chain Intelligence"
              description="Seamlessly switch between blockchains with AI recommendations for the best networks for your needs."
            />
          </div>
        </div>
      </section>

      {/* AI Assistant Demo */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-nexus-card-navy">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
                Always Ready to Help
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Your Personal Web3 Assistant</h2>
              <p className="text-lg text-gray-300 mb-8">
                W3 AI understands context, remembers your preferences, and provides personalized assistance 
                for all your Web3 activities—from simple queries to complex DeFi strategies.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="h-3 w-3 text-nexus-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Context-Aware Responses</h4>
                    <p className="text-gray-400">AI understands your current page and wallet state for relevant assistance.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-6 w-6 rounded-full bg-nexus-blue/20 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3 w-3 text-nexus-blue" />
                  </div>
                  <div>
                    <h4 className="font-medium text-lg">Personalized Learning</h4>
                    <p className="text-gray-400">The more you use it, the better it understands your preferences and needs.</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="nexus-glass rounded-2xl p-6"
            >
              <div className="space-y-4">
                <div className="bg-nexus-card-dark p-4 rounded-lg">
                  <p className="text-sm text-gray-400 mb-2">You</p>
                  <p className="text-white">What's the safest way to swap ETH for USDC?</p>
                </div>
                <div className="bg-nexus-blue/10 p-4 rounded-lg border border-nexus-blue/20">
                  <p className="text-sm text-nexus-light-blue mb-2">W3 AI</p>
                  <p className="text-white">For the safest ETH to USDC swap, I recommend using Uniswap or 1inch through Plato's integrated DEX aggregator. Current gas fees are moderate (35 gwei). Would you like me to find the best rate across all supported DEXs?</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// Feature Card Component
const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card className="bg-nexus-card-dark border-nexus-blue/10 hover:border-nexus-blue/30 transition-all">
      <CardHeader>
        <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default AIFeatures;
