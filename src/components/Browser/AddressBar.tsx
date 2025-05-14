
import React, { useState, useEffect } from "react";
import { Search, Lock, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WalletConnect from "./WalletConnect";
import UserSettingsTray from "./UserSettingsTray";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

interface AddressBarProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const AddressBar: React.FC<AddressBarProps> = ({ 
  currentUrl, 
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  canGoBack,
  canGoForward
}) => {
  const [inputValue, setInputValue] = useState(currentUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Process URL to ensure it has a protocol if needed
    let processedUrl = inputValue.trim();
    
    // Check if this is an internal route
    if (processedUrl === 'search' || processedUrl === '/search') {
      navigate('/search');
      return;
    }
    
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://') && !processedUrl.startsWith('/')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    console.log(`Address bar submitting URL: ${processedUrl}`);
    toast.info(`Navigating to: ${processedUrl.replace(/^https?:\/\//, '')}`);
    
    // Give a small delay for React state updates to process correctly
    setTimeout(() => onNavigate(processedUrl), 50);
    simulateLoading();
  };

  const handleRefresh = () => {
    onRefresh();
    simulateLoading();
  };
  
  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  return (
    <div className="flex items-center space-x-2 px-2 py-2 bg-nexus-header-blue">
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.preventDefault();
                  onGoBack();
                }}
                disabled={!canGoBack}
                aria-label="Go back"
              >
                <ArrowLeft className={`h-4 w-4 text-white ${!canGoBack ? 'opacity-50' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.preventDefault();
                  onGoForward();
                }}
                disabled={!canGoForward}
                aria-label="Go forward"
              >
                <ArrowRight className={`h-4 w-4 text-white ${!canGoForward ? 'opacity-50' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Forward</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={(e) => {
                  e.preventDefault();
                  handleRefresh();
                }}
                aria-label="Refresh page"
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex-1 mx-2">
        <form onSubmit={handleSubmit} className="w-full">
          <div className="address-bar">
            <Lock className="h-4 w-4 mr-2 text-nexus-purple" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="bg-transparent flex-1 outline-none text-sm text-white"
              placeholder="Search or enter address"
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-white/70 hover:text-white"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-white border-none h-9 px-4"
        >
          Buy $NWF3
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="bg-[#4c5fd7] hover:bg-[#4c5fd7]/80 text-white border-none h-9 px-4"
        >
          NWF3 Staking
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-[#006f4e] hover:bg-[#006f4e]/80 text-white border-none h-9 px-4"
        >
          NWF3 Rewards
        </Button>
      
        <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-[#e5007e] hover:bg-[#e5007e]/80 text-white h-9 px-4"
            >
              Nexus Bridge
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-nexus-purple flex items-center justify-center text-white font-bold">
                  NB
                </div>
                <span className="ml-2">Nexus Bridge</span>
              </DialogTitle>
              <DialogDescription>
                Connect your wallet to interact with Web3 applications.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <WalletConnect />
            </div>
          </DialogContent>
        </Dialog>

        {/* User Settings Tray */}
        <div className="ml-2">
          <UserSettingsTray />
        </div>
      </div>
    </div>
  );
};

export default AddressBar;
