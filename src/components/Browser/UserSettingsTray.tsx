
import React from "react";
import {
  Settings,
  Shield,
  Lock,
  Bell,
  Moon,
  Sun,
  UserRound,
  Wallet,
  Globe,
  Download,
  History,
  Bookmark,
  Heart
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const UserSettingsTray: React.FC = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} clicked`,
      description: `You activated the ${action} feature.`
    });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>User Settings</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleAction("Profile")}>
              <UserRound className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAction("Wallet Management")}>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Wallet Management</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Shield className="mr-2 h-4 w-4" />
                <span>Privacy & Security</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleAction("Ad Blocker")}>
                    <span>Ad Blocker</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Script Blocker")}>
                    <span>Script Blocker</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Fingerprint Protection")}>
                    <span>Fingerprint Protection</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Wallet Privacy")}>
                    <span>Wallet Privacy</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Globe className="mr-2 h-4 w-4" />
                <span>Browser Features</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleAction("Downloads")}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Downloads</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("History")}>
                    <History className="mr-2 h-4 w-4" />
                    <span>History</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Bookmarks")}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span>Bookmarks</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Favorites")}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => handleAction("All Notifications")}>
                    <span>All Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("DApp Notifications")}>
                    <span>DApp Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Wallet Notifications")}>
                    <span>Wallet Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAction("Security Alerts")}>
                    <span>Security Alerts</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            
            <DropdownMenuItem onClick={() => handleAction("Appearance")}>
              <div className="flex items-center">
                <Sun className="mr-2 h-4 w-4" />
                <Moon className="mr-2 h-4 w-4" />
                <span>Appearance</span>
              </div>
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => handleAction("Settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserSettingsTray;
