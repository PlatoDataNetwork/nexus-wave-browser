
import React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tab } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TabBarProps {
  tabs: Tab[];
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
  onActivateTab: (id: string) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  tabs,
  onAddTab,
  onCloseTab,
  onActivateTab
}) => {
  return (
    <div className="flex items-center bg-nexus-space-black border-b border-border">
      <div className="flex-1 flex items-center overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={cn(
              "browser-tab group",
              tab.isActive && "active"
            )}
            onClick={() => onActivateTab(tab.id)}
          >
            <div className="flex items-center space-x-2 max-w-[200px]">
              {tab.icon ? (
                <tab.icon className="w-4 h-4 text-muted-foreground" />
              ) : (
                <div className="w-4 h-4 rounded-full bg-nexus-purple/50" />
              )}
              <span className="truncate text-foreground">{tab.title}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-5 h-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(tab.id);
              }}
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="min-w-[40px] h-8 mx-2 text-foreground"
              onClick={onAddTab}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>New Tab</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default TabBar;
