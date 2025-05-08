
import React from "react";
import TabBar from "./TabBar";
import AddressBar from "./AddressBar";
import Bookmarks from "./Bookmarks";
import { Tab } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";

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
  canGoForward
}) => {
  return (
    <div className="flex flex-col">
      <TabBar
        tabs={tabs}
        onAddTab={onAddTab}
        onCloseTab={onCloseTab}
        onActivateTab={onActivateTab}
      />
      <div className="flex-none">
        <AddressBar
          currentUrl={currentUrl}
          onNavigate={onNavigate}
          onGoBack={onGoBack}
          onGoForward={onGoForward}
          onRefresh={onRefresh}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
        />
      </div>
      <div className="flex justify-between items-center p-2 bg-card border-b border-border">
        <Bookmarks onNavigate={onNavigate} />
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white font-medium"
          >
            Hot Pink
          </Button>
          <Button 
            size="sm" 
            className="bg-[#F2FCE2] hover:bg-[#F2FCE2]/80 text-black font-medium"
          >
            Neon Green
          </Button>
          <Button 
            size="sm" 
            className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white font-medium"
          >
            Nexus Bridge
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BrowserHeader;
