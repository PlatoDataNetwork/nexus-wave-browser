
import React, { useState } from "react";
import {
  Plus,
  AppWindow,
  EyeOff,
  Torus,
  Star,
  Wallet,
  Shield,
  LayoutPanelLeft,
  Key,
  History,
  Bookmark,
  Download,
  Puzzle,
  Trash,
  ZoomIn,
  ZoomOut,
  Printer,
  Pen,
  Share,
  MoreHorizontal,
  HelpCircle,
  Settings,
  X,
  MinusIcon,
  PlusIcon,
  Maximize2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  onClick: () => void;
  hasSubmenu?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, shortcut, onClick, hasSubmenu = false }) => (
  <DropdownMenuItem className="py-2 px-3 cursor-default" onClick={onClick}>
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {shortcut && <span className="text-xs text-muted-foreground">{shortcut}</span>}
        {hasSubmenu && <span className="text-muted-foreground">›</span>}
      </div>
    </div>
  </DropdownMenuItem>
);

const ZoomControls: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const { toast } = useToast();
  
  const handleZoomOut = () => {
    const newZoom = Math.max(25, zoomLevel - 25);
    setZoomLevel(newZoom);
    toast({ title: `Zoom: ${newZoom}%` });
  };
  
  const handleZoomIn = () => {
    const newZoom = Math.min(200, zoomLevel + 25);
    setZoomLevel(newZoom);
    toast({ title: `Zoom: ${newZoom}%` });
  };
  
  const handleZoomReset = () => {
    setZoomLevel(100);
    toast({ title: "Zoom reset to 100%" });
  };
  
  return (
    <div className="px-3 py-2">
      <div className="flex items-center justify-between">
        <span className="text-sm">Zoom</span>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={handleZoomOut}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            className="px-2" 
            onClick={handleZoomReset}
          >
            {zoomLevel}%
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full" 
            onClick={handleZoomIn}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => toast({ title: "Fullscreen toggled" })}
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const UserSettingsTray: React.FC = () => {
  const { toast } = useToast();

  const handleAction = (action: string, shortcut?: string) => {
    const message = shortcut 
      ? `${action} activated (${shortcut})`
      : `${action} activated`;
      
    toast({
      title: message,
      description: `You activated the ${action} feature.`
    });
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
            <Settings className="h-6 w-6 text-nexus-purple" />
            <span className="sr-only">Settings</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={6} className="w-72 py-2 bg-card border-border">
          <MenuItem 
            icon={Plus} 
            label="New tab" 
            shortcut="Ctrl+T" 
            onClick={() => handleAction("New tab", "Ctrl+T")} 
          />
          <MenuItem 
            icon={AppWindow} 
            label="New window" 
            shortcut="Ctrl+N" 
            onClick={() => handleAction("New window", "Ctrl+N")} 
          />
          <MenuItem 
            icon={EyeOff} 
            label="New private window" 
            shortcut="Shift+Ctrl+N" 
            onClick={() => handleAction("New private window", "Shift+Ctrl+N")} 
          />
          <MenuItem 
            icon={Torus} 
            label="New private window with Tor" 
            shortcut="Alt+Shift+N" 
            onClick={() => handleAction("New private window with Tor", "Alt+Shift+N")} 
          />
          
          <DropdownMenuSeparator />
          
          <MenuItem 
            icon={Star} 
            label="Apollo" 
            onClick={() => handleAction("Apollo")} 
          />
          <MenuItem 
            icon={Wallet} 
            label="Wallet" 
            onClick={() => handleAction("Wallet")} 
          />
          <MenuItem 
            icon={Shield} 
            label="Nexus VPN" 
            onClick={() => handleAction("Nexus VPN")} 
          />
          
          <DropdownMenuSeparator />
          
          <MenuItem 
            icon={LayoutPanelLeft} 
            label="Sidebar" 
            onClick={() => handleAction("Sidebar toggle")} 
          />
          
          <DropdownMenuSeparator />
          
          <MenuItem 
            icon={Key} 
            label="Passwords and autofill" 
            onClick={() => handleAction("Passwords and autofill")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={History} 
            label="History" 
            onClick={() => handleAction("History")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={Bookmark} 
            label="Bookmarks and lists" 
            onClick={() => handleAction("Bookmarks and lists")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={Download} 
            label="Downloads" 
            shortcut="Ctrl+J" 
            onClick={() => handleAction("Downloads", "Ctrl+J")} 
          />
          <MenuItem 
            icon={Puzzle} 
            label="Extensions" 
            onClick={() => handleAction("Extensions")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={Trash} 
            label="Delete browsing data..." 
            shortcut="Shift+Ctrl+Del" 
            onClick={() => handleAction("Delete browsing data", "Shift+Ctrl+Del")} 
          />
          
          <DropdownMenuSeparator />
          
          <ZoomControls />
          
          <DropdownMenuSeparator />
          
          <MenuItem 
            icon={Printer} 
            label="Print..." 
            shortcut="Ctrl+P" 
            onClick={() => handleAction("Print", "Ctrl+P")} 
          />
          <MenuItem 
            icon={Pen} 
            label="Find and edit" 
            onClick={() => handleAction("Find and edit")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={Share} 
            label="Save and share" 
            onClick={() => handleAction("Save and share")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={MoreHorizontal} 
            label="More tools" 
            onClick={() => handleAction("More tools")} 
            hasSubmenu={true}
          />
          
          <DropdownMenuSeparator />
          
          <MenuItem 
            icon={HelpCircle} 
            label="Help" 
            onClick={() => handleAction("Help")} 
            hasSubmenu={true}
          />
          <MenuItem 
            icon={Settings} 
            label="Settings" 
            onClick={() => handleAction("Settings")} 
          />
          <MenuItem 
            icon={X} 
            label="Exit" 
            onClick={() => handleAction("Exit")} 
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserSettingsTray;
