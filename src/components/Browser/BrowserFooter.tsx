
import React, { useState } from "react";
import { Chrome, Settings, Bookmark, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import WalletConnect from "./WalletConnect";
import ExtensionStore from "../Extensions/ExtensionStore";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BrowserFooter: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isWalletDialogOpen, setIsWalletDialogOpen] = useState(false);
  const [isExtensionsDialogOpen, setIsExtensionsDialogOpen] = useState(false);
  
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

  return (
    <div className="flex items-center justify-between px-4 py-2 nexus-gradient-bg border-t border-border text-xs text-muted-foreground">
      <div className="flex items-center space-x-2">
        <Dialog open={isExtensionsDialogOpen} onOpenChange={setIsExtensionsDialogOpen}>
          <DialogTrigger asChild>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7"
                  onClick={() => setIsExtensionsDialogOpen(true)}
                >
                  <Chrome className="h-3 w-3 mr-1" />
                  <span>Extensions</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Manage browser extensions</TooltipContent>
            </Tooltip>
          </DialogTrigger>
          <DialogContent className="p-0 border-none max-w-6xl h-[80vh]">
            <div className="flex items-center justify-center p-0 h-full overflow-auto">
              <ExtensionStore />
            </div>
          </DialogContent>
        </Dialog>

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
              size="icon" 
              className="bg-[#e5007e] hover:bg-[#e5007e]/80 text-white font-bold h-10 w-10 rounded-md flex items-center justify-center"
              onClick={() => setIsWalletDialogOpen(true)}
            >
              <span className="text-sm">NB</span>
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
