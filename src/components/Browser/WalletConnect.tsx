
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Wallet, ArrowRight, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface WalletConnectProps {
  onClose: () => void;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onClose }) => {
  const isMobile = useIsMobile();

  const wallets = [
    {
      name: "MetaMask",
      description: "Popular Ethereum wallet",
      icon: "🦊",
      status: "Available"
    },
    {
      name: "WalletConnect",
      description: "Connect to mobile wallets",
      icon: "📱",
      status: "Available"
    },
    {
      name: "Coinbase Wallet",
      description: "Self-custody wallet",
      icon: "🔵",
      status: "Available"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <Card className={cn(
        "w-full max-w-md mx-auto bg-gradient-to-br from-nexus-card-dark to-nexus-card-navy border-nexus-purple/20 shadow-2xl",
        isMobile ? "h-full max-h-screen" : "max-h-[90vh]"
      )}>
        <CardHeader className="relative pb-4">
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 p-0 transition-all duration-200"
          >
            <X className="h-4 w-4 stroke-[2.5]" />
          </Button>
          
          <div className="flex items-center gap-3 mt-2">
            <div className="p-3 rounded-full bg-nexus-purple/20">
              <Wallet className="h-6 w-6 text-nexus-purple" />
            </div>
            <div>
              <CardTitle className="text-xl text-white">Connect Wallet</CardTitle>
              <CardDescription className="text-gray-300">
                Choose your preferred wallet to connect to Nexus Wave
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className={cn(
          "space-y-4",
          isMobile ? "pb-6" : "pb-4"
        )}>
          {/* Security Notice - Mobile Optimized */}
          <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-nexus-purple/10 border border-nexus-purple/20">
            <Shield className="h-5 w-5 text-nexus-purple mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-white mb-1">Secure Connection</h4>
              <p className="text-xs text-gray-300 leading-relaxed">
                Your wallet connection is encrypted and secure. We never store your private keys.
              </p>
            </div>
          </div>

          {/* Wallet Options - Mobile Optimized */}
          <div className="space-y-2 sm:space-y-3">
            {wallets.map((wallet, index) => (
              <Button
                key={index}
                variant="outline"
                className={cn(
                  "w-full justify-between p-3 sm:p-4 h-auto border-gray-600 hover:border-nexus-purple hover:bg-nexus-purple/10 transition-all group",
                  isMobile ? "text-sm" : "text-base"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg sm:text-xl">{wallet.icon}</span>
                  <div className="text-left">
                    <div className="text-white font-medium">{wallet.name}</div>
                    <div className="text-xs sm:text-sm text-gray-400">{wallet.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                    {wallet.status}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-nexus-purple transition-colors" />
                </div>
              </Button>
            ))}
          </div>

          {/* Benefits Section - Mobile Optimized */}
          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-nexus-purple" />
              Why Connect Your Wallet?
            </h4>
            <div className="grid gap-2 text-xs sm:text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-purple"></div>
                <span>Access DeFi protocols and dApps</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-purple"></div>
                <span>Secure transaction signing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-nexus-purple"></div>
                <span>Web3 identity and NFT support</span>
              </div>
            </div>
          </div>

          {/* Mobile-specific CTA */}
          {isMobile && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <p className="text-xs text-center text-gray-400 leading-relaxed">
                Tap any wallet above to get started with Web3 browsing on mobile
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletConnect;
