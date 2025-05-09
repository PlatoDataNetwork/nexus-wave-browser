import React, { useState, useEffect, useRef } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Wallet, ExternalLink, Copy, Check, RefreshCw, AlertCircle, Clock, X } from "lucide-react";
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
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

// Define wallet types
type WalletProvider = 'metamask' | 'coinbase' | 'solflare' | 'walletconnect' | 'uniswap' | 'crypto.com' | 'zengo' | 'exodus' | 'trust' | 'phantom' | 'trezor' | 'ledger';

// Official WalletConnect logo URL
const walletConnectLogoUrl = "/lovable-uploads/52a30577-037b-46af-a085-bcd610e24ea5.png";

// Trezor logo URL from the uploaded image
const trezorLogoUrl = "/lovable-uploads/e931de13-c6d4-4048-b5c5-b591236df7ae.png";

// Trust Wallet logo URL from the newly uploaded image
const trustWalletLogoUrl = "/lovable-uploads/840d912c-ae1c-428a-8842-b9e74182176f.png";

// Exodus logo URL from the newly uploaded image
const exodusLogoUrl = "/lovable-uploads/ff280ee6-e289-4257-844d-f70c66f6b4cc.png";

// Crypto.com logo URL from the newly uploaded image
const cryptoComLogoUrl = "/lovable-uploads/adb0bf22-cda9-4603-92ba-21ce2b7fe3b8.png";

// Ledger logo URL from the newly uploaded image
const ledgerLogoUrl = "/lovable-uploads/ddec5898-47c3-4e44-9a00-6b9f4710dc0a.png";

// Phantom logo URL from the newly uploaded image
const phantomLogoUrl = "/lovable-uploads/2a5f5e84-3a4f-4171-8d8a-f4e2cd03b06c.png";

// Custom NB Logo component for Nexus Wave Bridge
const NBLogo = () => (
  <div className="w-10 h-10 rounded-full bg-[#e5007e] flex items-center justify-center text-white font-bold">
    NB
  </div>
);

// Wallet options - alphabetized
const walletOptions = [
  { id: 'coinbase', name: 'Coinbase Wallet', icon: '🔷', description: 'Connect to your Coinbase wallet', logoUrl: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0=w240-h480-rw', circular: true },
  { id: 'crypto.com', name: 'Crypto.com', icon: '🔵', description: 'Connect to your Crypto.com DeFi wallet', logoUrl: cryptoComLogoUrl },
  { id: 'exodus', name: 'Exodus', icon: '🧿', description: 'Connect to your Exodus wallet', logoUrl: exodusLogoUrl },
  { id: 'ledger', name: 'Ledger', icon: '🔐', description: 'Connect to your Ledger hardware wallet', logoUrl: ledgerLogoUrl },
  { id: 'metamask', name: 'MetaMask', icon: '🦊', description: 'Connect to your MetaMask wallet', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg' },
  { id: 'phantom', name: 'Phantom', icon: '👻', description: 'Connect to your Phantom Solana wallet', logoUrl: phantomLogoUrl },
  { id: 'solflare', name: 'Solflare', icon: '🌞', description: 'Connect to your Solflare wallet for Solana', logoUrl: 'https://cryptorank.io/public/wallet-logos/solflare.svg' },
  { id: 'trezor', name: 'Trezor', icon: '🛡️', description: 'Connect to your Trezor hardware wallet', logoUrl: trezorLogoUrl },
  { id: 'trust', name: 'Trust Wallet', icon: '🛡️', description: 'Connect to your Trust Wallet', logoUrl: trustWalletLogoUrl },
  { id: 'uniswap', name: 'Uniswap Wallet', icon: '🦄', description: 'Connect to your Uniswap wallet', logoUrl: 'https://cryptologos.cc/logos/uniswap-uni-logo.png' },
  { id: 'walletconnect', name: 'WalletConnect', icon: '🔗', description: 'Connect with WalletConnect protocol', logoUrl: walletConnectLogoUrl },
  { id: 'zengo', name: 'ZenGo', icon: '🔒', description: 'Connect to your keyless ZenGo wallet', logoUrl: 'https://play-lh.googleusercontent.com/Mf45WzShFQN7Ep3JVvHvZ_ZmDfPej_OoE-QwRn3urG8h3ZcAuRGLY9BZ-iUaGm6Q7g=w240-h480-rw' },
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
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(true);

  // Form setup
  const form = useForm({
    defaultValues: {
      walletProvider: 'metamask' as WalletProvider
    }
  });

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

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
        setConnectionError("Failed to retrieve user session");
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
      setConnectionError(null);
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
      setConnectionError("Failed to retrieve wallet connection");
      setIsConnected(false);
    }
  };

  const resetWalletState = () => {
    setIsConnected(false);
    setActiveWallet(null);
    setWalletAddress('');
    setConnectionError(null);
  };

  // Handle connect action
  const handleConnect = async (provider: WalletProvider) => {
    if (!user) {
      toast.error("Please sign in to connect your wallet");
      return;
    }

    try {
      setIsDialogOpen(false);
      setConnectionError(null);
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
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setConnectionError(errorMsg);
      toast.error(`Failed to connect: ${errorMsg}`);
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

  const handleRepairConnection = async () => {
    if (!user || !activeWallet) {
      toast.error("No active wallet to repair");
      return;
    }

    try {
      setIsRepairModalOpen(false);
      toast.loading("Attempting to repair connection...", { duration: 2000 });
      
      // Simulate repair process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Refresh the connection by updating the timestamp
      const { error } = await supabase
        .from('wallet_connections')
        .update({ 
          last_connected: new Date().toISOString(),
          is_connected: true 
        })
        .eq('user_id', user.id)
        .eq('wallet_provider', activeWallet);

      if (error) throw error;
      
      setConnectionError(null);
      toast.success("Connection successfully repaired");
      
      // Refresh wallet connection data
      fetchWalletConnection(user.id);
    } catch (error) {
      toast.error(`Repair failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const reportIssue = async () => {
    try {
      // In a real app, this would send diagnostics to a backend
      toast.loading("Sending diagnostic report...", { duration: 1500 });
      
      // Simulate sending report
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Report sent successfully. Our team will investigate.");
    } catch (error) {
      toast.error("Failed to send report. Please try again later.");
    }
  };

  const handleCloseCard = () => {
    setIsVisible(false);
    // Optional: Add any additional logic when closing the card (like animation, etc.)
    toast.info("Nexus Wave Bridge closed");
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

  if (!isVisible) {
    return null; // Don't render anything if the card is closed
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="relative">
        {/* X Close Button */}
        <button
          onClick={handleCloseCard}
          className="absolute -top-4 -right-4 bg-[#e5007e] hover:bg-[#e5007e]/80 text-white rounded-full p-1 z-10 shadow-md"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <Card className="nexus-glass animate-pulse-glow w-[400px] h-[400px] aspect-square">
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-2xl font-medium">
              Nexus Wave Bridge
            </CardTitle>
            <CardDescription className="text-center">
              Connect you wallet and transport yourself with Nexus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {connectionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                  {connectionError}
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mr-2"
                      onClick={() => setIsRepairModalOpen(true)}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Repair
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={reportIssue}
                    >
                      Report Issue
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 flex flex-col h-[220px]">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span className="text-sm font-medium flex items-center">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-destructive'} mr-2`}></span>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                
                {/* Add timestamp below status line */}
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">Timestamp</span>
                  <span className="text-sm font-medium flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {format(currentTime, "yyyy-MM-dd HH:mm:ss")}
                  </span>
                </div>
                
                {isConnected && activeWallet && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Wallet</span>
                      <span className="text-sm font-medium flex items-center">
                        <Avatar className="h-7 w-7 mr-2">
                          <AvatarImage src={getWalletLogo(activeWallet)} alt={getWalletName(activeWallet)} className="p-0" />
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
                          className="h-6 w-6 ml-1"
                          onClick={copyAddress}
                        >
                          {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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
                              <Avatar className="h-20 w-20">
                                <AvatarImage src={getWalletLogo(activeWallet!)} alt={getWalletName(activeWallet!)} className="p-0" />
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
                            
                            <Alert>
                              <AlertTitle>Troubleshooting</AlertTitle>
                              <AlertDescription>
                                If you're experiencing issues with your wallet connection, try repairing the connection or reconnecting.
                              </AlertDescription>
                            </Alert>
                            
                            <SheetFooter className="flex justify-between">
                              <Button 
                                variant="outline"
                                onClick={handleRepairConnection}
                                className="bg-secondary hover:bg-secondary/80"
                              >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Repair
                              </Button>
                              <Button 
                                onClick={handleDisconnect}
                                className="bg-destructive hover:bg-destructive/90 text-white"
                              >
                                Disconnect Wallet
                              </Button>
                            </SheetFooter>
                          </div>
                        </SheetContent>
                      </Sheet>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <Separator className="mb-4" />
                
                {/* Updated wallet support text to match Nexus Wave Bridge white color and made text size larger */}
                <div className="mb-4">
                  <p className="text-sm text-justify px-2">
                    <span className="block text-base text-white">Nexus Wave Supports the Following Wallets:</span>
                    <span className="text-left block">
                      Coinbase, Crypto.com, Exodus, Ledger, MetaMask, 
                      Phantom, Solflare, Trezo, Trust Wallet, Uniswap, Wallet Connect and ZenGo.
                    </span>
                  </p>
                </div>
                
                {/* Added mt-8 to increase spacing between text and button */}
                <div className="mt-8">
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
                          className="w-full py-6 text-lg bg-[#e5007e] hover:bg-[#e5007e]/90 text-white"
                        >
                          Nexus Wave Bridge
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[850px]">
                        <DialogHeader>
                          <DialogTitle className="flex items-center">
                            <NBLogo />
                            <span className="ml-2">Nexus Wave Bridge</span>
                          </DialogTitle>
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
                                    className="grid grid-cols-2 gap-3"
                                  >
                                    {walletOptions.map(wallet => (
                                      <div key={wallet.id} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-accent">
                                        <RadioGroupItem value={wallet.id} id={wallet.id} />
                                        <Label htmlFor={wallet.id} className="flex-1 cursor-pointer">
                                          <div className="flex items-center">
                                            <Avatar className="h-14 w-14 mr-3">
                                              <AvatarImage 
                                                src={wallet.logoUrl} 
                                                alt={wallet.name} 
                                                className={`${wallet.circular ? 'rounded-full' : ''}`} 
                                              />
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
                              <Button type="submit" className="bg-[#e5007e] hover:bg-[#e5007e]/90">
                                Connect
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Repair Connection Modal */}
      <Dialog open={isRepairModalOpen} onOpenChange={setIsRepairModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <NBLogo />
              <span className="ml-2">Repair Wallet Connection</span>
            </DialogTitle>
            <DialogDescription>
              This will attempt to fix issues with your current wallet connection.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Troubleshooting Steps</AlertTitle>
              <AlertDescription className="text-xs space-y-2">
                <p>1. Check your wallet application is running</p>
                <p>2. Make sure you're logged into your wallet</p>
                <p>3. Try refreshing the page if issues persist</p>
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleRepairConnection}
              className="bg-[#e5007e] hover:bg-[#e5007e]/90 flex items-center"
            >
              <NBLogo />
              <span className="ml-2">Repair Connection</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletConnect;
