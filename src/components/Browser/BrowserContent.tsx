
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import SettingsDocumentation from "@/pages/SettingsDocumentation";
import ExtensionStore from "@/pages/ExtensionStore";
import HistoryPage from "@/pages/History";
import Search from "@/pages/Search";
import PageLayout from "@/components/Layout/PageLayout";
import WebviewFrame from "./WebviewFrame";
import { toast } from "@/components/ui/sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({ currentUrl, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    console.log(`BrowserContent: Loading content for URL: ${currentUrl}`);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [currentUrl]);

  // Helper function to determine if a URL is external
  const isExternalUrl = (url: string) => {
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Render appropriate content based on URL path
  const renderContent = () => {
    // Log the current URL for debugging
    console.log(`[BrowserContent] Rendering content for: ${currentUrl}`);

    // First check for internal routes (without protocol)
    if (currentUrl === '/history' || currentUrl.includes('history')) {
      return (
        <ScrollArea className="h-full w-full">
          <HistoryPage />
        </ScrollArea>
      );
    }
    
    if (currentUrl === '/extension-store' || currentUrl.includes('/extension-store')) {
      return (
        <ScrollArea className="h-full w-full">
          <ExtensionStore />
        </ScrollArea>
      );
    }
    
    if (currentUrl === '/settings-docs' || currentUrl.includes('/settings-docs')) {
      return (
        <ScrollArea className="h-full w-full">
          <SettingsDocumentation />
        </ScrollArea>
      );
    }

    if (currentUrl === '/search' || currentUrl.includes('/search')) {
      return (
        <ScrollArea className="h-full w-full">
          <Search />
        </ScrollArea>
      );
    }
    
    // For external URLs (with protocol) or any other URL, use the WebviewFrame
    return (
      <div className="h-full w-full flex-1 overflow-hidden">
        <WebviewFrame url={currentUrl} />
      </div>
    );
  };

  return (
    <PageLayout includeFooter={true} onNavigate={onNavigate}>
      <div className="flex-1 h-full w-full overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </PageLayout>
  );
};

export default BrowserContent;
