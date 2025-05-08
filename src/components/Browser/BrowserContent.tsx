
import React, { useState, useEffect, useRef } from "react";
import { initialTabs, bookmarks, popularDApps, DApp } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Globe } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import WalletConnect from "./WalletConnect";
import ExtensionStore from "@/pages/ExtensionStore";

interface BrowserContentProps {
  currentUrl: string;
  onNavigate: (url: string) => void;
}

const WebviewFrame: React.FC<{ url: string }> = ({ url }) => {
  const webviewRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (webviewRef.current) {
      webviewRef.current.src = url;
    }
  }, [url]);

  return (
    <iframe
      ref={webviewRef}
      src={url}
      width="100%"
      height="100%"
      style={{ border: 'none' }}
      title="Web Content"
    />
  );
};

const DAppSection: React.FC<{ onNavigate: (url: string) => void }> = ({ onNavigate }) => {
  return (
    <Card className="nexus-glass animate-pulse-glow">
      <CardHeader>
        <CardTitle>Popular DApps</CardTitle>
        <CardDescription>Explore decentralized applications</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[240px] w-full rounded-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {popularDApps.map((dapp: DApp) => (
              <Button
                key={dapp.id}
                variant="ghost"
                className="justify-start hover:bg-secondary/50"
                onClick={() => onNavigate(dapp.url)}
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" alt={dapp.name} />
                  <AvatarFallback><Globe /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">{dapp.name}</span>
                  <span className="text-xs text-muted-foreground">{dapp.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const ProtocolTicker: React.FC = () => {
  return (
    <Card className="nexus-glass animate-pulse-glow">
      <CardHeader>
        <CardTitle>Protocol Ticker</CardTitle>
        <CardDescription>Real-time updates from leading protocols</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">DeFi</Badge>
          <Badge variant="secondary">NFT</Badge>
          <Badge variant="secondary">DAO</Badge>
        </div>
        <Separator className="my-4" />
        <p className="text-sm text-muted-foreground">
          Stay informed about the latest trends and developments in the Web3 space.
        </p>
      </CardContent>
    </Card>
  );
};

const BrowserContent: React.FC<BrowserContentProps> = ({ currentUrl, onNavigate }) => {
  const isHomepage = currentUrl === initialTabs[0].url;
  const isExtensionStore = currentUrl === "/extension-store";

  // Debug console logs to help identify what's happening
  console.log("Current URL:", currentUrl);
  console.log("Is Extension Store?", isExtensionStore);

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Only show WebviewFrame if not showing extension store */}
      {!isExtensionStore && (
        <div className="absolute inset-0 overflow-y-auto">
          <WebviewFrame url={currentUrl} />
        </div>
      )}
      
      {/* Homepage content - only shown for the default URL */}
      {isHomepage && (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <DAppSection onNavigate={onNavigate} />
            <ProtocolTicker />
          </div>
          <div className="col-span-1">
            <WalletConnect />
          </div>
        </div>
      )}
      
      {/* Extension Store - shown when URL is /extension-store */}
      {isExtensionStore && (
        <div className="absolute inset-0 overflow-y-auto">
          <ExtensionStore />
        </div>
      )}
    </div>
  );
};

export default BrowserContent;
