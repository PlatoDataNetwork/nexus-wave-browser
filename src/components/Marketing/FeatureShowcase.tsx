
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, Shield, Globe, Wallet, Layers, Lock, Zap } from "lucide-react";

export interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const DEFAULT_FEATURES: FeatureProps[] = [
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

const FeatureShowcase: React.FC<{
  features?: FeatureProps[];
  title?: string;
  subtitle?: string;
}> = ({ features = DEFAULT_FEATURES, title, subtitle }) => {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
          {subtitle && <p className="text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <Card key={index} className="bg-nexus-card-dark border-nexus-purple/10 hover:border-nexus-purple/30 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-nexus-purple" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureShowcase;
