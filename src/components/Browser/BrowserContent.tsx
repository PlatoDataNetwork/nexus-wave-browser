
import React from "react";
import WebviewFrame from "./WebviewFrame";
import ProtocolTicker from "./ProtocolTicker";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({
  currentUrl,
  onNavigate
}) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 p-4 overflow-hidden">
        <WebviewFrame url={currentUrl} />
      </div>
    </div>
  );
};

export default BrowserContent;
