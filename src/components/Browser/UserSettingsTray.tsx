
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

// Empty container component now that Settings button is moved to the footer
const UserSettingsTray: React.FC = () => {
  return <div className="flex items-center gap-2"></div>;
};

export default UserSettingsTray;
