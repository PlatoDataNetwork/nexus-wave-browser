
import React, { useState } from "react";
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
import { Wallet } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";

// Define wallet types
type WalletProvider = 'metamask' | 'coinbase' | 'solflare' | 'walletconnect';

// Wallet options
const walletOptions = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Connect to your MetaMask wallet' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔷', description: 'Connect to your Coinbase wallet' },
  { id: 'solflare', name: 'Solflare', icon: '🌞', description: 'Connect to your Solflare wallet for Solana' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect with WalletConnect protocol' }
];

const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletProvider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form setup
  const form = useForm({
    defaultValues: {
      walletProvider: 'metamask' as WalletProvider
    }
  });

  // Handle connect action
  const handleConnect = async (provider: WalletProvider) => {
    try {
      // Simulate wallet connection - in a real app, this would use actual wallet APIs
      // For example, with MetaMask: window.ethereum.request({ method: 'eth_requestAccounts' })
      
      toast.loading(`Connecting to ${getWalletName(provider)}...`, { duration: 1500 });
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set as connected
      setIsConnected(true);
      setActiveWallet(provider);
      setIsDialogOpen(false);
      
      toast.success(`Successfully connected to ${getWalletName(provider)}`);
    } catch (error) {
      toast.error(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setActiveWallet(null);
    toast.info("Wallet disconnected");
  };

  const getWalletName = (provider: WalletProvider): string => {
    return walletOptions.find(wallet => wallet.id === provider)?.name || provider;
  };

  const onSubmit = (data: { walletProvider: WalletProvider }) => {
    handleConnect(data.walletProvider);
  };

  return (
    <Card className="nexus-glass animate-pulse-glow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-nexus-purple'} mr-2 ${isConnected ? '' : 'animate-pulse'}`}></div>
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
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-destructive'} mr-2`}></span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          {isConnected && activeWallet && (
            <div className="pt-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Wallet</span>
                <span className="text-sm font-medium">
                  {getWalletName(activeWallet)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="text-sm font-medium">
                  {/* Simulate wallet address */}
                  0x71C...3E1f
                </span>
              </div>
            </div>
          )}
          
          <Separator className="my-2" />
          
          {isConnected ? (
            <Button 
              onClick={handleDisconnect}
              className="w-full bg-destructive hover:bg-destructive/90 text-white"
            >
              Disconnect Wallet
            </Button>
          ) : (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-nexus-purple hover:bg-nexus-light-purple text-white"
                >
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Connect Wallet</DialogTitle>
                  <DialogDescription>
                    Choose a wallet provider to connect with Nexus.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="walletProvider"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>Wallet Provider</FormLabel>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="grid gap-3"
                          >
                            {walletOptions.map(wallet => (
                              <div key={wallet.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent">
                                <RadioGroupItem value={wallet.id} id={wallet.id} />
                                <Label htmlFor={wallet.id} className="flex-1 cursor-pointer">
                                  <div className="flex items-center">
                                    <span className="mr-2 text-xl">{wallet.icon}</span>
                                    <div>
                                      <p className="font-medium">{wallet.name}</p>
                                      <p className="text-xs text-muted-foreground">{wallet.description}</p>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-3 pt-2">
                      <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                      </DialogClose>
                      <Button type="submit" className="bg-nexus-purple hover:bg-nexus-light-purple">
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          
          <div className="pt-2">
            <p className="text-xs text-muted-foreground">
              Supports MetaMask, Coinbase Wallet, Solflare, WalletConnect and more
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletConnect;
