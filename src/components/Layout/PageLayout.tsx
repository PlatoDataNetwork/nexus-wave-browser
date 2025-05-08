
import React from "react";
import BrowserFooter from "../Browser/BrowserFooter";

interface PageLayoutProps {
  children: React.ReactNode;
  includeFooter?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, includeFooter = true }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {children}
      </div>
      {includeFooter && <BrowserFooter />}
    </div>
  );
};

export default PageLayout;
