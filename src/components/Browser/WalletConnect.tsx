
import React, { useState, useEffect } from "react";
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
import { Wallet, ExternalLink, Copy, Check } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger
} from "@/components/ui/sheet";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

// Define wallet types
type WalletProvider = 'metamask' | 'coinbase' | 'solflare' | 'walletconnect';

interface WalletConnection {
  id?: string;
  wallet_provider: WalletProvider;
  wallet_address: string;
  is_connected: boolean;
  last_connected?: string;
}

// Wallet options
const walletOptions = [
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Connect to your MetaMask wallet', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' },
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔷', description: 'Connect to your Coinbase wallet', logoUrl: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0=w240-h480-rw' },
  { id: 'solflare', name: 'Solflare', icon: '🌞', description: 'Connect to your Solflare wallet for Solana', logoUrl: 'https://cryptorank.io/public/wallet-logos/solflare.svg' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect with WalletConnect protocol', logoUrl: 'https://1000logos.net/wp-content/uploads/2023/02/WalletConnect-logo.png' }
];

// Shortened address helper
const shortenAddress = (address: string): string => {
  if (!address) return '';
  return address.length > 10 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : address;
};

const WalletConnect: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletProvider | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsSheetOpen, setIsDetailsSheetOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Form setup
  const form = useForm({
    defaultValues: {
      walletProvider: 'metamask' as WalletProvider
    }
  });

  // Check for user session and wallet connections on component mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          fetchWalletConnection(session.user.id);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchWalletConnection(session.user.id);
        } else {
          setUser(null);
          resetWalletState();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchWalletConnection = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', userId)
        .eq('is_connected', true)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setIsConnected(true);
        setActiveWallet(data.wallet_provider as WalletProvider);
        setWalletAddress(data.wallet_address);
      }
    } catch (error) {
      console.error("Error fetching wallet connection:", error);
    }
  };

  const resetWalletState = () => {
    setIsConnected(false);
    setActiveWallet(null);
    setWalletAddress('');
  };

  // Handle connect action
  const handleConnect = async (provider: WalletProvider) => {
    if (!user) {
      toast.error("Please sign in to connect your wallet");
      return;
    }

    try {
      setIsDialogOpen(false);
      toast.loading(`Connecting to ${getWalletName(provider)}...`, { duration: 1500 });
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock wallet address based on the provider
      let mockAddress = '';
      switch (provider) {
        case 'metamask':
        case 'coinbase':
          mockAddress = `0x${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
          break;
        case 'solflare':
          mockAddress = `sol${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
          break;
        case 'walletconnect':
          mockAddress = `0x${Math.random().toString(36).substring(2, 12)}${Math.random().toString(36).substring(2, 12)}`;
          break;
      }

      // Store wallet connection in Supabase
      const { error } = await supabase
        .from('wallet_connections')
        .upsert({
          user_id: user.id,
          wallet_provider: provider,
          wallet_address: mockAddress,
          is_connected: true,
          last_connected: new Date().toISOString()
        }, {
          onConflict: 'user_id, wallet_provider'
        });

      if (error) throw error;
      
      // Set as connected
      setIsConnected(true);
      setActiveWallet(provider);
      setWalletAddress(mockAddress);
      
      toast.success(`Successfully connected to ${getWalletName(provider)}`);
    } catch (error) {
      toast.error(`Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDisconnect = async () => {
    if (!user || !activeWallet) return;

    try {
      // Update wallet connection status in Supabase
      const { error } = await supabase
        .from('wallet_connections')
        .update({ is_connected: false })
        .eq('user_id', user.id)
        .eq('wallet_provider', activeWallet);

      if (error) throw error;

      resetWalletState();
      toast.info("Wallet disconnected");
    } catch (error) {
      toast.error(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const copyAddress = () => {
    if (!walletAddress) return;
    
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Wallet address copied to clipboard");
  };

  const getWalletName = (provider: WalletProvider): string => {
    return walletOptions.find(wallet => wallet.id === provider)?.name || provider;
  };

  const getWalletLogo = (provider: WalletProvider): string => {
    return walletOptions.find(wallet => wallet.id === provider)?.logoUrl || '';
  };

  const onSubmit = (data: { walletProvider: WalletProvider }) => {
    handleConnect(data.walletProvider);
  };

  if (loading) {
    return (
      <Card className="nexus-glass animate-pulse-glow">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-40">
            <span className="text-muted-foreground">Loading wallet...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                <span className="text-sm font-medium flex items-center">
                  <Avatar className="h-5 w-5 mr-1">
                    <AvatarImage src={getWalletLogo(activeWallet)} alt={getWalletName(activeWallet)} />
                    <AvatarFallback>{activeWallet.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {getWalletName(activeWallet)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-muted-foreground">Address</span>
                <span className="text-sm font-medium flex items-center">
                  {shortenAddress(walletAddress)}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 ml-1"
                    onClick={copyAddress}
                  >
                    {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </Button>
                </span>
              </div>

              <div className="mt-2 flex justify-end">
                <Sheet open={isDetailsSheetOpen} onOpenChange={setIsDetailsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      Details
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Wallet Details</SheetTitle>
                      <SheetDescription>
                        View and manage your connected wallet.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                      <div className="flex justify-center mb-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={getWalletLogo(activeWallet!)} alt={getWalletName(activeWallet!)} />
                          <AvatarFallback>{activeWallet!.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Provider:</span>
                          <span>{getWalletName(activeWallet!)}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Full Address:</span>
                          <div className="flex items-center gap-1">
                            <span className="text-sm break-all max-w-[180px]">
                              {walletAddress}
                            </span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                              onClick={copyAddress}
                            >
                              {isCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Connection Status:</span>
                          <span className="flex items-center">
                            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                            Active
                          </span>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleDisconnect}
                          className="bg-destructive hover:bg-destructive/90 text-white"
                        >
                          Disconnect Wallet
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
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
                                    <Avatar className="h-8 w-8 mr-2">
                                      <AvatarImage src={wallet.logoUrl} alt={wallet.name} />
                                      <AvatarFallback>{wallet.icon}</AvatarFallback>
                                    </Avatar>
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
