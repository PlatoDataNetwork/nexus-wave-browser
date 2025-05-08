
import React from "react";
import WebviewFrame from "./WebviewFrame";
import ProtocolTicker from "./ProtocolTicker";
import { useTheme } from '@/contexts/ThemeContext';

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({
  currentUrl,
  onNavigate
}) => {
  const { theme } = useTheme();
  
  return (
    <div className={`flex-1 flex flex-col overflow-hidden ${theme}-content`}>
      <ProtocolTicker onNavigate={onNavigate} />
      <div className="flex-1 p-4 overflow-hidden">
        <WebviewFrame url={currentUrl} />
      </div>
    </div>
  );
};

export default BrowserContent;
