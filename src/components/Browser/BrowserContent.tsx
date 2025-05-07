
import React from "react";
import WebviewFrame from "./WebviewFrame";
import WalletConnect from "./WalletConnect";
import DAppSection from "./DAppSection";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({
  currentUrl,
  onNavigate
}) => {
  return (
    <div className="flex-1 grid grid-cols-5 gap-4 p-4 overflow-hidden">
      <div className="col-span-4 h-full">
        <WebviewFrame url={currentUrl} />
      </div>
      <div className="col-span-1 space-y-4">
        <WalletConnect />
        <DAppSection onNavigate={onNavigate} />
      </div>
    </div>
  );
};

export default BrowserContent;
