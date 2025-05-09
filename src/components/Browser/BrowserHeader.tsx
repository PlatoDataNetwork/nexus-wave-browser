
import React from "react";
import TabBar from "./TabBar";
import AddressBar from "./AddressBar";
import Bookmarks from "./Bookmarks";
// Removed BrowserFooter import since it might contain the shield icon
import { Tab } from "@/lib/dummyData";

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
      <Bookmarks onNavigate={onNavigate} />
      {/* Removed BrowserFooter component which might contain the shield icon */}
    </div>
  );
};

export default BrowserHeader;
