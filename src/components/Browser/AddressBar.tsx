
import React, { useState, useEffect } from "react";
import { Search, Lock, RefreshCw, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UserSettingsTray from "./UserSettingsTray";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Process URL to ensure it has a protocol if needed
    let processedUrl = inputValue.trim();
    
    // Check if this is an internal route
    if (processedUrl === 'search' || processedUrl === '/search') {
      navigate('/search', { replace: false });
      return;
    }
    
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://') && !processedUrl.startsWith('/')) {
      processedUrl = `https://${processedUrl}`;
    }
    
    console.log(`Address bar submitting URL: ${processedUrl}`);
    toast({ 
      title: "Navigating",
      description: `Navigating to: ${processedUrl.replace(/^https?:\/\//, '')}`
    });
    
    // Use a callback to ensure the navigation happens correctly
    onNavigate(processedUrl);
    simulateLoading();
  };

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="flex items-center space-x-1.5 px-2 py-1 bg-nexus-header-blue">
      <div className="flex items-center space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onGoBack();
                }}
                disabled={!canGoBack}
                aria-label="Go back"
                type="button"
              >
                <ArrowLeft className={`h-3.5 w-3.5 text-white ${!canGoBack ? 'opacity-50' : ''}`} />
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
                size="sm" 
                className="h-6 w-6" 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onGoForward();
                }}
                disabled={!canGoForward}
                aria-label="Go forward"
                type="button"
              >
                <ArrowRight className={`h-3.5 w-3.5 text-white ${!canGoForward ? 'opacity-50' : ''}`} />
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
                size="sm" 
                className="h-6 w-6" 
                onClick={handleRefresh}
                aria-label="Refresh page"
                disabled={isLoading}
                type="button"
              >
                <RefreshCw className={`h-3.5 w-3.5 text-white ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex-1 mx-1.5">
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
                e.stopPropagation();
                handleSubmit(e);
              }}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
      
      {/* User Settings Tray */}
      <div className="flex items-center">
        <UserSettingsTray />
      </div>
    </div>
  );
};

export default AddressBar;
