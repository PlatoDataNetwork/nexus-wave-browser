
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import SettingsDocumentation from "@/pages/SettingsDocumentation";
import Documentation from "@/pages/Documentation";
import ExtensionStore from "@/pages/ExtensionStore";
import HistoryPage from "@/pages/History";
import Search from "@/pages/Search";
import PageLayout from "@/components/Layout/PageLayout";
import WebviewFrame from "./WebviewFrame";
import { toast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({ currentUrl, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsLoading(true);
    console.log(`BrowserContent: Loading content for URL: ${currentUrl}`);
    
    // Check for URL parameter in searchParams
    const urlParam = searchParams.get('url');
    if (urlParam) {
      console.log(`BrowserContent: Found URL parameter: ${urlParam}`);
      onNavigate(urlParam);
    }
    
    // Check for time-sensitive searches and force cache refresh for them
    const queryParam = searchParams.get('q');
    if (queryParam) {
      const isTimeSensitiveQuery = /weather|forecast|news|today|current|latest|alert|warning/i.test(queryParam);
      if (isTimeSensitiveQuery) {
        // Log that we detected a time-sensitive query
        console.log(`BrowserContent: Detected time-sensitive query: ${queryParam}`);
        
        // Force cache refresh for time-sensitive queries by adding timestamp
        const timestamp = Date.now();
        const refreshedUrl = new URL(window.location.href);
        refreshedUrl.searchParams.set('_t', timestamp.toString());
        
        // Don't navigate to the new URL directly, as that would cause a page reload
        // Just log that we're forcing a cache refresh
        console.log(`BrowserContent: Forcing cache refresh for time-sensitive query`);
      }
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [searchParams, onNavigate]);

  // Helper function to determine if a URL is external
  const isExternalUrl = (url: string) => {
    if (!url) return false; // Guard against undefined URLs
    return url.startsWith('http://') || url.startsWith('https://');
  };

  // Render appropriate content based on URL path
  const renderContent = () => {
    // Guard against undefined URLs
    if (!currentUrl) {
      console.error("BrowserContent: Current URL is undefined");
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Invalid URL. Please navigate to a valid page.</p>
        </div>
      );
    }
    
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
          <ExtensionStore onNavigate={onNavigate} />
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

    if (currentUrl === '/documentation' || currentUrl.includes('/documentation')) {
      return (
        <ScrollArea className="h-full w-full">
          <Documentation />
        </ScrollArea>
      );
    }

    if (currentUrl === '/search' || currentUrl.includes('/search')) {
      // Extract query parameter for analytics
      const url = new URL(window.location.href);
      const query = url.searchParams.get('q');
      
      // Check if it's a time-sensitive query
      if (query) {
        const isTimeSensitiveQuery = /weather|forecast|news|today|current|latest|alert|warning/i.test(query);
        if (isTimeSensitiveQuery) {
          console.log(`[BrowserContent] Time-sensitive search detected: "${query}"`);
        }
      }
      
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
