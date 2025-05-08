import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Download, Shield, Star, Tag, Bookmark, Check, Search } from "lucide-react";

// Extension data interface
interface Extension {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  developer: string;
  rating: number;
  users: string;
  isInstalled: boolean;
  isPremium: boolean;
}

const ExtensionStore: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [extensions, setExtensions] = useState<Extension[]>([
    // Security & Privacy
    {
      id: 1,
      name: "Nexus Shield",
      description: "Advanced tracker blocking and privacy protection",
      icon: "🛡️",
      category: "security",
      developer: "Nexus Wave",
      rating: 4.9,
      users: "2.5M+",
      isInstalled: true,
      isPremium: false
    },
    {
      id: 2,
      name: "CryptoSafe",
      description: "Protect your crypto assets from malicious websites and phishing attempts",
      icon: "🔒",
      category: "security",
      developer: "BlockSecure",
      rating: 4.7,
      users: "780K+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 3,
      name: "PrivacyGuard Pro",
      description: "Comprehensive privacy suite with built-in VPN and fingerprint masking",
      icon: "👁️‍🗨️",
      category: "security",
      developer: "Digital Fortress",
      rating: 4.8,
      users: "1.2M+",
      isInstalled: false,
      isPremium: true
    },
    {
      id: 4,
      name: "Password Vault",
      description: "Secure password manager with auto-fill and breach monitoring",
      icon: "🔑",
      category: "security",
      developer: "SecurePass Inc.",
      rating: 4.6,
      users: "3.1M+",
      isInstalled: false,
      isPremium: false
    },
    // Web3 & Crypto
    {
      id: 5,
      name: "Chain Inspector",
      description: "Real-time blockchain transaction viewer and analyzer",
      icon: "⛓️",
      category: "web3",
      developer: "MetaTools",
      rating: 4.5,
      users: "950K+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 6,
      name: "DeFi Dashboard",
      description: "Track your DeFi investments, yields, and liquidity pools across protocols",
      icon: "📊",
      category: "web3",
      developer: "DeFi Labs",
      rating: 4.7,
      users: "620K+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 7,
      name: "NFT Explorer",
      description: "Browse, discover and track NFT collections with price alerts",
      icon: "🖼️",
      category: "web3",
      developer: "NFT Nexus",
      rating: 4.4,
      users: "1.8M+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 8,
      name: "Gas Optimizer",
      description: "Smart transaction timing with gas fee predictions and alerts",
      icon: "⛽",
      category: "web3",
      developer: "BlockEfficiency",
      rating: 4.8,
      users: "1.3M+",
      isInstalled: false,
      isPremium: true
    },
    // Productivity
    {
      id: 9,
      name: "Focus Mode",
      description: "Block distractions and set focus timers for improved productivity",
      icon: "🎯",
      category: "productivity",
      developer: "ZenTech",
      rating: 4.6,
      users: "2.2M+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 10,
      name: "Tab Manager Pro",
      description: "Organize, group and save tabs with AI-powered suggestions",
      icon: "📑",
      category: "productivity",
      developer: "BrowserBoost",
      rating: 4.7,
      users: "1.5M+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 11,
      name: "ReadWise",
      description: "Speed reading tools with dyslexia support and translation features",
      icon: "📚",
      category: "productivity",
      developer: "CogniLearn",
      rating: 4.5,
      users: "890K+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 12,
      name: "SnapSave",
      description: "Save and organize web content with AI tagging and search",
      icon: "💾",
      category: "productivity",
      developer: "DataVault",
      rating: 4.4,
      users: "1.1M+",
      isInstalled: false,
      isPremium: false
    },
    // Media & Content
    {
      id: 13,
      name: "StreamBoost",
      description: "Enhanced video player with picture-in-picture and playback speed controls",
      icon: "🎞️",
      category: "media",
      developer: "MediaPrime",
      rating: 4.8,
      users: "3.3M+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 14,
      name: "AudioEnhancer",
      description: "Equalizer, volume booster and audio capture tools for web media",
      icon: "🎵",
      category: "media",
      developer: "SoundLab",
      rating: 4.6,
      users: "1.7M+",
      isInstalled: false,
      isPremium: true
    },
    {
      id: 15,
      name: "ColorPicker Pro",
      description: "Advanced color picker with palette generation and accessibility checks",
      icon: "🎨",
      category: "media",
      developer: "DesignTools",
      rating: 4.5,
      users: "750K+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 16,
      name: "ScreenCapture Studio",
      description: "Capture, edit and annotate screenshots and screen recordings",
      icon: "📷",
      category: "media",
      developer: "VisualCraft",
      rating: 4.7,
      users: "2.1M+",
      isInstalled: false,
      isPremium: false
    },
    // Developer Tools
    {
      id: 17,
      name: "DevToolkit",
      description: "All-in-one web development suite with debugging and testing tools",
      icon: "🧰",
      category: "developer",
      developer: "CodeCraft",
      rating: 4.9,
      users: "1.4M+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 18,
      name: "API Tester",
      description: "Test and debug API requests with advanced formatting and validation",
      icon: "🌐",
      category: "developer",
      developer: "APIWizard",
      rating: 4.8,
      users: "980K+",
      isInstalled: false,
      isPremium: false
    },
    {
      id: 19,
      name: "GitHelper",
      description: "GitHub integration with PR reviews, issue tracking and notifications",
      icon: "💻",
      category: "developer",
      developer: "DevOps Tools",
      rating: 4.7,
      users: "1.2M+",
      isInstalled: false,
      isPremium: true
    },
    {
      id: 20,
      name: "CodeSnippets",
      description: "Save, organize and share code snippets with syntax highlighting",
      icon: "📝",
      category: "developer",
      developer: "CodeVault",
      rating: 4.6,
      users: "870K+",
      isInstalled: false,
      isPremium: false
    }
  ]);

  const handleInstall = (id: number) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, isInstalled: true } : ext
    ));
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: extension.isPremium ? "Premium Extension Installing" : "Extension Installing",
        description: `${extension.name} is being installed. It will be ready in a few seconds.`,
      });
      
      // Simulate installation delay
      setTimeout(() => {
        toast({
          title: "Installation Complete",
          description: `${extension?.name} has been successfully installed.`,
        });
      }, 2000);
    }
  };
  
  const handleUninstall = (id: number) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, isInstalled: false } : ext
    ));
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: "Extension Removed",
        description: `${extension.name} has been uninstalled.`,
      });
    }
  };

  const filteredExtensions = extensions.filter(ext => {
    const matchesSearch = ext.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || ext.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Nexus Wave Extension Store</h1>
          <p className="text-muted-foreground">Enhance your browser with powerful extensions</p>
        </div>
        <div className="relative w-1/3">
          <Input
            placeholder="Search extensions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Extensions</TabsTrigger>
          <TabsTrigger value="security">Security & Privacy</TabsTrigger>
          <TabsTrigger value="web3">Web3 & Crypto</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="media">Media & Content</TabsTrigger>
          <TabsTrigger value="developer">Developer Tools</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredExtensions.map(extension => (
              <ExtensionCard 
                key={extension.id}
                extension={extension}
                onInstall={() => handleInstall(extension.id)}
                onUninstall={() => handleUninstall(extension.id)}
              />
            ))}
          </div>
        </TabsContent>
        
        {["security", "web3", "productivity", "media", "developer"].map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredExtensions
                .filter(ext => ext.category === category)
                .map(extension => (
                  <ExtensionCard 
                    key={extension.id}
                    extension={extension}
                    onInstall={() => handleInstall(extension.id)}
                    onUninstall={() => handleUninstall(extension.id)}
                  />
                ))
              }
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface ExtensionCardProps {
  extension: Extension;
  onInstall: () => void;
  onUninstall: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, onInstall, onUninstall }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{extension.icon}</div>
            <div>
              <CardTitle className="text-lg">{extension.name}</CardTitle>
              <CardDescription className="text-xs">by {extension.developer}</CardDescription>
            </div>
          </div>
          {extension.isPremium && (
            <Badge variant="secondary" className="bg-[#e5007e] text-white">
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground mb-2">{extension.description}</p>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center text-sm">
            <div className="flex items-center mr-3">
              <Star className="h-3 w-3 fill-current text-yellow-500 mr-1" />
              <span>{extension.rating}</span>
            </div>
            <div className="text-xs text-muted-foreground">{extension.users} users</div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        {extension.isInstalled ? (
          <Button variant="outline" size="sm" className="w-full" onClick={onUninstall}>
            <Check className="h-4 w-4 mr-2" /> Installed
          </Button>
        ) : (
          <Button variant="default" size="sm" className="w-full bg-nexus-purple hover:bg-nexus-purple/90" onClick={onInstall}>
            <Download className="h-4 w-4 mr-2" /> {extension.isPremium ? "Get Premium" : "Install"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ExtensionStore;
