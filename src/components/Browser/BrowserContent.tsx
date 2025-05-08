
import React from "react";
import WebviewFrame from "./WebviewFrame";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({
  currentUrl,
  onNavigate
}) => {
  return (
    <div className="flex-1 p-4 overflow-hidden">
      <WebviewFrame url={currentUrl} />
    </div>
  );
};

export default BrowserContent;
