
import React from "react";
import BrowserFooter from "../Browser/BrowserFooter";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PageLayoutProps {
  children: React.ReactNode;
  includeFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, includeFooter = true }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {children}
        </ScrollArea>
      </div>
      {includeFooter && <BrowserFooter />}
    </div>
  );
};

export default PageLayout;
