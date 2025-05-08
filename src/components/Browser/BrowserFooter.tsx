
import React, { useState } from "react";
import { Chrome, Settings, Wallet, Shield, History, Bookmark, Download, Globe, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import WalletConnect from "./WalletConnect";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const BrowserFooter: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
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

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-t border-border text-xs text-muted-foreground">
      <div className="flex items-center space-x-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7"
              onClick={() => handleActionClick("Extensions")}
            >
              <Chrome className="h-3 w-3 mr-1" />
              <span>Extensions</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Manage browser extensions</TooltipContent>
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
              className="h-7"
              onClick={() => handleActionClick("Downloads")}
            >
              <Download className="h-3 w-3 mr-1" />
              <span>Downloads</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>View downloaded files</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7"
              onClick={() => handleActionClick("Shields")}
            >
              <Shield className="h-3 w-3 mr-1" />
              <span>Shields</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Manage privacy shields</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7"
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
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full"
              onClick={() => handleActionClick("Notifications")}
            >
              <Bell className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Notifications</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full"
              onClick={() => handleActionClick("Language")}
            >
              <Globe className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Change language</TooltipContent>
        </Tooltip>
        
        <span>Nexus Wave Browser Web3 V2.1</span>
        
        <Dialog open={isWalletDialogOpen} onOpenChange={setIsWalletDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              size="sm" 
              className="bg-[#e5007e] hover:bg-[#e5007e]/80 text-white font-medium px-3 py-1 rounded-md"
              onClick={() => setIsWalletDialogOpen(true)}
            >
              <Wallet className="h-3 w-3 mr-1" />
              Nexus Bridge
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
