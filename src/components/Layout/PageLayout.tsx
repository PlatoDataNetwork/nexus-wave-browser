
import React from "react";
import BrowserFooter from "../Browser/BrowserFooter";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        {children}
      </div>
      <BrowserFooter />
    </div>
  );
};

export default PageLayout;
