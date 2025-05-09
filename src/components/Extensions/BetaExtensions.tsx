
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  AlertTriangle, 
  Brain, 
  Code, 
  Globe, 
  Lock,
  MessagesSquare, 
  Bot, 
  ShieldAlert, 
  Sparkles, 
  Tv,
  Bitcoin,
  DollarSign,
  BadgeDollarSign,
  BadgeBitcoin,
  Star
} from "lucide-react";

interface BetaExtensionProps {
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  category: string;
  estimatedRelease: string;
  rating?: number;
}

const betaExtensions: BetaExtensionProps[] = [
  {
    name: "AI Content Detector",
    description: "Advanced algorithm to detect AI-generated content across websites with high accuracy",
    icon: Brain,
    iconBg: "bg-indigo-600",
    category: "AI Tools",
    estimatedRelease: "June 2025",
  },
  {
    name: "Privacy Guardian Pro",
    description: "Next-generation privacy protection with advanced tracker blocking and fingerprint masking",
    icon: ShieldAlert,
    iconBg: "bg-red-600",
    category: "Security",
    estimatedRelease: "July 2025",
  },
  {
    name: "Multilingual Assistant",
    description: "Real-time webpage translation in 50+ languages with contextual understanding",
    icon: Globe,
    iconBg: "bg-green-600",
    category: "Productivity",
    estimatedRelease: "August 2025",
  },
  {
    name: "Code Inspector",
    description: "Analyze and optimize JavaScript, CSS, and HTML in real-time while browsing",
    icon: Code,
    iconBg: "bg-blue-600",
    category: "Developer",
    estimatedRelease: "June 2025",
  },
  {
    name: "Quantum VPN",
    description: "Built-in VPN service with quantum-resistant encryption protocols",
    icon: Lock,
    iconBg: "bg-purple-600",
    category: "Security",
    estimatedRelease: "September 2025",
  },
  {
    name: "Smart Screen Reader",
    description: "Advanced screen reader with natural language processing for better accessibility",
    icon: Tv,
    iconBg: "bg-yellow-600",
    category: "Accessibility",
    estimatedRelease: "July 2025",
  },
  {
    name: "Web3 Navigator",
    description: "Seamless integration with blockchain apps and decentralized services",
    icon: Sparkles,
    iconBg: "bg-orange-600",
    category: "Crypto",
    estimatedRelease: "August 2025",
  },
  {
    name: "AI Chat Companion",
    description: "Context-aware chatbot that helps with research and online tasks",
    icon: MessagesSquare,
    iconBg: "bg-pink-600",
    category: "AI Tools",
    estimatedRelease: "October 2025",
  },
  {
    name: "Automated Tester",
    description: "Run accessibility, performance, and security tests on any webpage instantly",
    icon: Bot,
    iconBg: "bg-teal-600",
    category: "Developer",
    estimatedRelease: "September 2025",
  },
  {
    name: "Vulnerability Scanner",
    description: "Real-time detection of security vulnerabilities, phishing attempts, and malicious code",
    icon: AlertTriangle,
    iconBg: "bg-amber-600",
    category: "Security",
    estimatedRelease: "November 2025",
  },
  // New Crypto Extensions
  {
    name: "CryptoTracker Pro",
    description: "Advanced real-time cryptocurrency tracking with price alerts, portfolio analytics and market predictions",
    icon: Bitcoin,
    iconBg: "bg-gradient-to-br from-amber-500 to-amber-700",
    category: "Crypto",
    estimatedRelease: "June 2025",
    rating: 4.9,
  },
  {
    name: "Blockchain Explorer",
    description: "Browse and analyze blockchain transactions, smart contracts, and token data with professional-grade tools",
    icon: BadgeBitcoin,
    iconBg: "bg-gradient-to-br from-purple-500 to-purple-700",
    category: "Crypto",
    estimatedRelease: "July 2025",
    rating: 4.8,
  },
  {
    name: "DeFi Dashboard",
    description: "All-in-one dashboard for DeFi protocols, yield farming analytics, and LP management across chains",
    icon: BadgeDollarSign,
    iconBg: "bg-gradient-to-br from-blue-500 to-blue-700",
    category: "Crypto",
    estimatedRelease: "August 2025",
    rating: 4.7,
  },
  {
    name: "NFT Marketplace Scanner",
    description: "Track NFT floor prices, rare item listings, and collection statistics with instant alerts for profitable opportunities",
    icon: DollarSign,
    iconBg: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    category: "Crypto",
    estimatedRelease: "September 2025",
    rating: 4.6,
  },
  {
    name: "Crypto Tax Assistant",
    description: "Automated cryptocurrency tax calculation, transaction history export, and tax form preparation for multiple jurisdictions",
    icon: BadgeDollarSign,
    iconBg: "bg-gradient-to-br from-sky-500 to-sky-700",
    category: "Crypto",
    estimatedRelease: "October 2025",
    rating: 4.5,
  },
];

const BetaCard: React.FC<{ extension: BetaExtensionProps }> = ({ extension }) => {
  const { toast } = useToast();
  const { name, description, icon: Icon, iconBg, category, estimatedRelease, rating } = extension;
  
  const handleRequestAccess = () => {
    toast({
      title: "Access Requested",
      description: `You've requested early access to ${name}. We'll notify you when it's available.`,
    });
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start space-x-3">
          <div className={`h-12 w-12 rounded-md flex items-center justify-center ${iconBg}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center">
              <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
              <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-500/50">
                Beta
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">Est. Release: {estimatedRelease}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5rem] mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-secondary/50 text-foreground">
            {category}
          </Badge>
          {rating && (
            <div className="flex items-center text-sm">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{rating}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleRequestAccess} 
          variant="outline"
          className="w-full border-purple-500/50 hover:bg-purple-500/20"
        >
          Request Early Access
        </Button>
      </CardFooter>
    </Card>
  );
};

const BetaExtensions: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-800/20 via-nexus-purple/20 to-nexus-light-purple/20 p-6 rounded-lg border border-purple-500/30">
        <h2 className="text-xl font-semibold mb-2">Nexus Wave Beta Program</h2>
        <p className="text-muted-foreground mb-4">
          Get early access to experimental extensions before they're released to the public.
          These extensions are still under development and may contain bugs or limited functionality.
        </p>
        <div className="flex items-center text-sm text-muted-foreground">
          <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
          <span>Extensions in beta are experimental and may be unstable</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {betaExtensions.map((extension, index) => (
          <BetaCard key={index} extension={extension} />
        ))}
      </div>
    </div>
  );
};

export default BetaExtensions;
