
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import SettingsDocumentation from "@/pages/SettingsDocumentation";
import ExtensionStore from "@/pages/ExtensionStore";
import HistoryPage from "@/pages/History";
import PageLayout from "@/components/Layout/PageLayout";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const BrowserContent: React.FC<BrowserContentProps> = ({ currentUrl, onNavigate }) => {
  const { toast } = useToast();
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
    
    // Check for external URLs or other URLs with protocol
    try {
      // For URLs with protocol (external sites)
      if (currentUrl.startsWith('http://') || currentUrl.startsWith('https://')) {
        // Render a simulated external website view
        return (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="w-full max-w-4xl px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  External Website: {new URL(currentUrl).hostname}
                </h2>
                <Button variant="outline" size="sm" onClick={() => window.open(currentUrl, '_blank')}>
                  Open Actual Website <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </div>
              
              <Card className="w-full nexus-glass border-none shadow-lg">
                <CardHeader>
                  <CardTitle>Simulated Content for {new URL(currentUrl).hostname}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    This is a simulated view of {currentUrl}. The Nexus Wave Browser prototype doesn't actually load external websites.
                  </p>
                  <p>
                    In a real implementation, this would display the actual content from {new URL(currentUrl).hostname}.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      }
    } catch (error) {
      console.error("Invalid URL:", currentUrl, error);
      // Continue with default rendering for invalid URLs
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
                toast({
                  title: "Navigating to Platodata Analytics",
                  description: "Loading Web3 analytics platform...",
                });
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
