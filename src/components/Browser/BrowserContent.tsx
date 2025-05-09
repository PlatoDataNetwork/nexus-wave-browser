
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import SettingsDocumentation from "@/pages/SettingsDocumentation";
import ExtensionStore from "@/pages/ExtensionStore";
import HistoryPage from "@/pages/History";
import PageLayout from "@/components/Layout/PageLayout";
import WebviewFrame from "./WebviewFrame";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({ currentUrl, onNavigate }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    setIsLoading(true);
    console.log(`Loading content for URL: ${currentUrl}`);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [currentUrl]);

  // Render appropriate content based on URL path
  const renderContent = () => {
    // Log the current URL for debugging
    console.log(`[BrowserContent] Rendering content for: ${currentUrl}`);

    // First check for internal app routes (without protocol)
    if (currentUrl === '/history') {
      return <HistoryPage />;
    }
    
    if (currentUrl === '/extension-store' || currentUrl.includes('/extension-store')) {
      return <ExtensionStore />;
    }
    
    if (currentUrl === '/settings-docs' || currentUrl.includes('/settings-docs')) {
      return <SettingsDocumentation />;
    }
    
    // For external URLs (with protocol), use the WebviewFrame
    if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
      return <WebviewFrame url={currentUrl} />;
    }

    // Default content rendering for home or unknown pages
    return (
      <div className="flex flex-col items-center justify-center h-full pt-8">
        <h1 className="text-2xl font-bold text-center mb-4">
          Welcome to Nexus Wave Browser!
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Explore the decentralized web with confidence.
        </p>
        <Card className="w-4/5 max-w-md nexus-glass border-none shadow-none">
          <CardHeader>
            <CardTitle>Web3 Analytics Platform</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Analyze blockchain data, track NFT trends, and discover DeFi
              protocols.
            </p>
            <Button
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => {
                onNavigate("https://platodata.io/analytics");
              }}
            >
              Explore Analytics <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <PageLayout includeFooter={true} onNavigate={onNavigate}>
      <div className="flex-1 overflow-auto">
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
