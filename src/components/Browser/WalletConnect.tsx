
import React from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";

const WalletConnect: React.FC = () => {
  const handleConnectClick = () => {
    toast.info("This would connect to a Web3 wallet in a real application");
  };

  return (
    <Card className="nexus-glass animate-pulse-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className="w-2 h-2 rounded-full bg-nexus-purple mr-2 animate-pulse"></div>
          Web3 Wallet
        </CardTitle>
        <CardDescription>
          Connect your wallet to interact with DApps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status</span>
            <span className="text-sm font-medium flex items-center">
              <span className="w-2 h-2 rounded-full bg-destructive mr-2"></span>
              Disconnected
            </span>
          </div>
          
          <Separator className="my-2" />
          
          <Button 
            onClick={handleConnectClick}
            className="w-full bg-nexus-purple hover:bg-nexus-light-purple text-white"
          >
            Connect Wallet
          </Button>
          
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Supports MetaMask, Coinbase Wallet, WalletConnect and more
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
