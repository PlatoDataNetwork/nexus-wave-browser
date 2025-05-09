import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ExternalLink } from "lucide-react";
import Settings from "@/pages/Settings";
import Documentation from "@/pages/Documentation";
import ExtensionStore from "@/pages/ExtensionStore";
import HistoryPage from "@/pages/History";

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
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Simulate loading delay

    return () => clearTimeout(timer);
  }, [currentUrl]);

  // Render appropriate content based on URL path
  const renderContent = () => {
    const url = new URL(window.location.href);
    console.log("Rendering content for URL:", url.toString());

    // Log the current URL for debugging
    console.log(`[BrowserContent] Rendering content for: ${currentUrl}`);

    // Parse the URL
    try {
      new URL(currentUrl);
    } catch (error) {
      console.error("Invalid URL:", currentUrl);
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-lg font-semibold mb-2">Invalid URL</h2>
          <p className="text-muted-foreground">Please enter a valid URL.</p>
        </div>
      );
    }

    // Check for special internal URLs
    if (url.pathname === '/documentation') {
      return <Documentation />;
    } else if (url.pathname === '/settings') {
      return <Settings />;
    } else if (url.pathname === '/extension-store') {
      return <ExtensionStore />;
    } else if (url.pathname === '/history') {
      return <HistoryPage />;
    }

    // Default content rendering
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold text-center mb-4">
          Welcome to Nexus Wave Browser!
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Explore the decentralized web with confidence.
        </p>
        <Card className="w-4/5 max-w-md nexus-glass animate-pulse-glow border-none shadow-none">
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
    <div className="flex-1 overflow-auto p-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        renderContent()
      )}
    </div>
  );
};

export default BrowserContent;
