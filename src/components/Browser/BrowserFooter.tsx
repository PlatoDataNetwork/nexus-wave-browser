
import React, { useState } from "react";
import { Chrome, Settings, Bookmark, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import WalletConnect from "./WalletConnect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BrowserFooter: React.FC<{ onNavigate?: (url: string) => void }> = ({ onNavigate }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  
  const handleActionClick = (action: string) => {
    toast({
      title: `${action} clicked`,
      description: `This would open the ${action.toLowerCase()} in a real browser`,
    });
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };
  
  const handleHomeClick = () => {
    navigate('/');
  };
  
  const handleDocumentationClick = () => {
    navigate('/documentation');
  };
  
  const handleExtensionStoreClick = () => {
    console.log("Extension store clicked, navigating");
    
    // Use onNavigate for within-browser navigation if available
    if (onNavigate) {
      onNavigate("/extension-store");
    } else {
      // Fall back to router navigation
      navigate('/extension-store');
    }
    
    // Show a toast to confirm the action
    toast({
      title: "Opening Extension Store",
      description: "Loading the Nexus Wave Extension Store"
    });
  };

  // Improved check for extension store page
  const isExtensionStoreActive = 
    location.pathname === '/extension-store' || 
    (location.pathname === '/' && onNavigate && 
     (window.location.href.includes('extension-store') || 
      window.location.search.includes('extension-store')));
  
  console.log("Current path:", location.pathname);
  console.log("Is extension store active?", isExtensionStoreActive);

  return (
    <div className="flex items-center justify-between px-4 py-2 nexus-gradient-bg border-t border-border text-xs text-muted-foreground">
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-7 ${isExtensionStoreActive ? 'bg-muted' : ''}`}
              onClick={handleExtensionStoreClick}
            >
              <Chrome className="h-3 w-3 mr-1" />
              <span>Extensions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Browse extension store</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7"
              onClick={() => handleActionClick("History")}
            >
              <History className="h-3 w-3 mr-1" />
              <span>History</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View browsing history</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7"
              onClick={() => handleActionClick("Bookmarks")}
            >
              <Bookmark className="h-3 w-3 mr-1" />
              <span>Bookmarks</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View saved bookmarks</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-7 ${location.pathname === '/documentation' ? 'bg-muted' : ''}`}
              onClick={handleDocumentationClick}
            >
              <FileText className="h-3 w-3 mr-1" />
              <span>Documentation</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View browser documentation</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-7 ${location.pathname === '/settings' ? 'bg-muted' : ''}`}
              onClick={handleSettingsClick}
            >
              <Settings className="h-3 w-3 mr-1" />
              <span>Settings</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Browser settings</TooltipContent>
        </Tooltip>
      </div>
      
      <div className="flex items-center gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              size="sm" 
              className="bg-[#3949AB] hover:bg-[#3949AB]/80 text-white font-medium px-3 py-1 rounded-md"
              onClick={handleHomeClick}
            >
              Nexus Wave V2.1
            </Button>
          </TooltipTrigger>
          <TooltipContent>Go to home page</TooltipContent>
        </Tooltip>
        
        <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-[#e5007e] hover:bg-[#e5007e]/80 text-white font-medium px-3 py-1 rounded-md"
              onClick={() => setIsWalletDialogOpen(true)}
            >
              Nexus Bridge V2.1
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none max-w-4xl">
            <div className="flex items-center justify-center p-6">
              <WalletConnect />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BrowserFooter;
