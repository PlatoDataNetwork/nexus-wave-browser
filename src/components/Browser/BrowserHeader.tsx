import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  ArrowRight, 
  RefreshCw, 
  Plus, 
  X, 
  Star, 
  Shield, 
  Lock,
  Menu,
  MoreHorizontal,
  Globe,
  Bookmark,
  ChevronDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface DateTime {
  compact?: boolean;
}

export const DateTime: React.FC<DateTime> = ({ compact = false }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (compact) {
    return (
      <span className="text-xs text-white/80">
        {format(currentTime, 'HH:mm')}
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end text-white text-xs">
      <div className="font-medium">
        {format(currentTime, 'HH:mm')}
      </div>
      <div className="text-white/60">
        {format(currentTime, 'MMM d')}
      </div>
    </div>
  );
};

export const UserMenu: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isMobile ? "sm" : "sm"}
          className="text-white hover:bg-white/10 p-1.5 sm:p-2"
        >
          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-nexus-purple flex items-center justify-center">
            <span className="text-xs font-medium">U</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border-border">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SettingsButton: React.FC = () => {
  const { toast } = useToast();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white hover:bg-white/10 p-2"
      onClick={() => toast({ title: "Settings opened" })}
    >
      <Menu className="h-4 w-4" />
    </Button>
  );
};

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white hover:bg-white/10 p-1.5 sm:p-2"
      onClick={toggleTheme}
    >
      <div className={cn(
        "w-4 h-4 sm:w-5 sm:h-5 rounded-full transition-colors",
        theme === 'dark' ? 'bg-yellow-400' : 'bg-gray-700'
      )} />
    </Button>
  );
};

export const HomeButton: React.FC = () => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-white hover:bg-white/10 p-1.5 sm:p-2"
    >
      <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
    </Button>
  );
};

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  favicon?: string;
}

interface BrowserHeaderProps {
  tabs: Tab[];
  currentUrl: string;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onActivateTab: (id: string) => void;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  bookmarksBarState: "visible" | "minimized" | "hidden";
  onToggleBookmarksBar: () => void;
}

const BrowserHeader: React.FC<BrowserHeaderProps> = ({
  tabs,
  currentUrl,
  onAddTab,
  onCloseTab,
  onActivateTab,
  onNavigate,
  onGoBack,
  onGoForward,
  onRefresh,
  canGoBack,
  canGoForward,
  bookmarksBarState,
  onToggleBookmarksBar,
}) => {
  const [addressValue, setAddressValue] = useState(currentUrl);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    setAddressValue(currentUrl);
  }, [currentUrl]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(addressValue);
  };

  const getSecurityIcon = (url: string) => {
    if (url.startsWith('https://')) {
      return <Lock className="h-3 w-3 text-green-500" />;
    }
    return <Shield className="h-3 w-3 text-amber-500" />;
  };

  // Mobile tab management
  const MobileTabsMenu = () => (
    <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm" 
          className="text-white hover:bg-white/10 p-1.5"
        >
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">{tabs.length}</span>
            <ChevronDown className="h-3 w-3" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="h-auto max-h-96">
        <div className="space-y-2 pt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Tabs</h3>
            <Button onClick={onAddTab} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New Tab
            </Button>
          </div>
          <div className="grid gap-2 max-h-64 overflow-y-auto">
            {tabs.map(tab => (
              <div
                key={tab.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg border cursor-pointer hover:bg-accent",
                  tab.isActive ? "bg-accent" : ""
                )}
                onClick={() => {
                  onActivateTab(tab.id);
                  setShowMobileMenu(false);
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{tab.title}</div>
                  <div className="text-xs text-muted-foreground truncate">{tab.url}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="flex flex-col bg-nexus-header-blue">
      {/* Desktop Tabs */}
      {!isMobile && (
        <div className="flex items-center px-2 sm:px-4 py-1 border-b border-border/40 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 min-w-max">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={cn(
                  "browser-tab group min-w-32 max-w-48",
                  tab.isActive && "active"
                )}
                onClick={() => onActivateTab(tab.id)}
              >
                <span className="flex-1 truncate text-sm">{tab.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 h-5 w-5 p-0 hover:bg-white/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={onAddTab}
              className="text-white hover:bg-white/10 h-8 w-8 p-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile/Desktop Navigation Bar */}
      <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2">
        {/* Mobile Tabs Menu */}
        {isMobile && <MobileTabsMenu />}
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={onGoBack}
            disabled={!canGoBack}
            className="text-white hover:bg-white/10 disabled:text-white/30 p-1.5"
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={onGoForward}
            disabled={!canGoForward}
            className="text-white hover:bg-white/10 disabled:text-white/30 p-1.5"
          >
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "sm"}
            onClick={handleRefresh}
            className="text-white hover:bg-white/10 p-1.5"
          >
            <RefreshCw className={cn(
              "h-3 w-3 sm:h-4 sm:w-4", 
              isRefreshing && "animate-spin"
            )} />
          </Button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleAddressSubmit} className="flex-1 mx-2">
          <div className="address-bar">
            {getSecurityIcon(currentUrl)}
            <Input
              value={addressValue}
              onChange={(e) => setAddressValue(e.target.value)}
              className="flex-1 bg-transparent border-none text-white text-sm placeholder:text-white/50 focus:ring-0 h-auto p-0"
              placeholder="Search or enter address"
            />
          </div>
        </form>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10 p-1.5"
                onClick={() => toast({ title: "Bookmark added" })}
              >
                <Star className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleBookmarksBar}
                className="text-white hover:bg-white/10 p-1.5"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Mobile Menu */}
          {isMobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 p-1.5"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onAddTab}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Tab
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => toast({ title: "Bookmark added" })}>
                  <Star className="h-4 w-4 mr-2" />
                  Bookmark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onToggleBookmarksBar}>
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmarks
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Bookmarks Bar - Hidden on mobile by default */}
      {!isMobile && bookmarksBarState !== "hidden" && (
        <div className={cn(
          "bookmarks-bar px-4 py-1.5 border-b border-border/40",
          bookmarksBarState === "minimized" && "py-1"
        )}>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <Badge variant="outline" className="text-white border-white/20 whitespace-nowrap">
              Nexus Search
            </Badge>
            <Badge variant="outline" className="text-white border-white/20 whitespace-nowrap">
              PlatoData
            </Badge>
            <Badge variant="outline" className="text-white border-white/20 whitespace-nowrap">
              Documentation
            </Badge>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowserHeader;
