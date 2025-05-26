
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search, Settings as SettingsIcon, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "@/components/LanguageSwitcher";
import SettingsAppearance from "@/components/Settings/SettingsAppearance";
import SettingsPrivacySecurity from "@/components/Settings/SettingsPrivacySecurity";
import SettingsAutofill from "@/components/Settings/SettingsAutofill";
import SettingsSearch from "@/components/Settings/SettingsSearch";
import SettingsAdvanced from "@/components/Settings/SettingsAdvanced";
import SettingsWeb3 from "@/components/Settings/SettingsWeb3";
import SettingsExtensions from "@/components/Settings/SettingsExtensions";
import SettingsShields from "@/components/Settings/SettingsShields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const SettingsDocumentation: React.FC = () => {
  const { t } = useTranslation('settings');
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeSection, setActiveSection] = React.useState("settings");
  const [activeTab, setActiveTab] = React.useState("appearance");
  const [searchParams, setSearchParams] = useSearchParams();

  // Set initial active section based on URL search params
  useEffect(() => {
    if (searchParams.has("tab") && searchParams.get("tab") === "documentation") {
      setActiveSection("documentation");
    } else {
      setActiveSection("settings");
    }
  }, []);

  // Change tab without triggering a full page reload
  const handleSectionChange = (value: string) => {
    setActiveSection(value);
    setSearchParams({ tab: value === "documentation" ? "documentation" : "" }, { replace: true });
  };

  // Change settings tab without triggering a full page reload
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Documentation section content
  const renderDocumentationContent = () => (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <FileText className="h-5 w-5" />
        <h1 className="text-2xl font-bold">Nexus Wave Browser Documentation</h1>
      </div>
      
      <Separator />

      <Card className="nexus-glass border-none shadow-md">
        <CardHeader>
          <CardTitle>Getting Started with Nexus Wave</CardTitle>
          <CardDescription>Basic overview of browser features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Nexus Wave is a next-generation Web3 browser designed to seamlessly integrate 
            blockchain technology with traditional web browsing. This documentation will help
            you get started with the key features.
          </p>
          <h3 className="text-lg font-semibold">Key Features:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Built-in cryptocurrency wallet</li>
            <li>Decentralized application (dApp) support</li>
            <li>Enhanced privacy with Shield protection</li>
            <li>Web3 extensions ecosystem</li>
            <li>Cross-chain compatibility</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="nexus-glass border-none shadow-md">
        <CardHeader>
          <CardTitle>Wallet Connection</CardTitle>
          <CardDescription>Managing your crypto assets</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Nexus Wave allows you to connect multiple wallets or create a new one directly
            in the browser. Click on the "Nexus Bridge" button in the footer to access
            wallet functions.
          </p>
          <h3 className="text-lg font-semibold">Supported Networks:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Ethereum (ETH)</li>
            <li>Binance Smart Chain (BSC)</li>
            <li>Polygon (MATIC)</li>
            <li>Solana (SOL)</li>
            <li>Polkadot (DOT)</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="nexus-glass border-none shadow-md">
        <CardHeader>
          <CardTitle>Extension System</CardTitle>
          <CardDescription>Enhancing your browsing experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Browse and install extensions from our curated Extension Store. All extensions
            are carefully reviewed for security before being made available.
          </p>
          <p>
            To manage or install extensions, click on the "Extensions" button in the footer
            to open the Extension Store.
          </p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between h-8 bg-card border-b border-border px-4">
        <h1 className="text-xs font-medium">
          Nexus Wave Browser - {activeSection === "settings" ? t('title') : "Documentation"}
        </h1>
        <div className="flex items-center">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4">
            {/* Main section tabs */}
            <Tabs 
              defaultValue={activeSection} 
              value={activeSection}
              onValueChange={handleSectionChange} 
              className="w-full mb-4"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="settings">{t('title')}</TabsTrigger>
                <TabsTrigger value="documentation">Docs</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeSection}...`}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {activeSection === "settings" ? (
              <Tabs 
                defaultValue={activeTab} 
                value={activeTab}
                onValueChange={handleTabChange}
                orientation="vertical" 
                className="w-full"
              >
                <TabsList className="flex flex-col items-start justify-start h-auto gap-1 bg-transparent p-0">
                  <TabsTrigger
                    value="appearance"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>{t('appearance.title')}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="shields"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>Shields & Privacy</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="privacy"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>{t('privacy.title')}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="extensions"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>Extensions</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="autofill"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>Autofill</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="search"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>Search engine</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="web3"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>Web3</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                  <TabsTrigger
                    value="advanced"
                    className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                  >
                    <span>{t('advanced.title')}</span>
                    <ChevronRight className="h-4 w-4 opacity-50" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            ) : (
              <div className="flex flex-col space-y-1">
                <button 
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent"
                  onClick={() => {}}
                >
                  <span className="text-sm">Getting Started</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
                <button className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent">
                  <span className="text-sm">Wallet Connection</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
                <button className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent">
                  <span className="text-sm">Extension System</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
                <button className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent">
                  <span className="text-sm">Security Features</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
                <button className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-accent">
                  <span className="text-sm">Troubleshooting</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            {activeSection === "settings" ? (
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="appearance" className="p-6 space-y-6 mt-0">
                  <SettingsAppearance />
                </TabsContent>
                <TabsContent value="shields" className="p-6 space-y-6 mt-0">
                  <SettingsShields />
                </TabsContent>
                <TabsContent value="privacy" className="p-6 space-y-6 mt-0">
                  <SettingsPrivacySecurity />
                </TabsContent>
                <TabsContent value="extensions" className="p-6 space-y-6 mt-0">
                  <SettingsExtensions />
                </TabsContent>
                <TabsContent value="autofill" className="p-6 space-y-6 mt-0">
                  <SettingsAutofill />
                </TabsContent>
                <TabsContent value="search" className="p-6 space-y-6 mt-0">
                  <SettingsSearch />
                </TabsContent>
                <TabsContent value="web3" className="p-6 space-y-6 mt-0">
                  <SettingsWeb3 />
                </TabsContent>
                <TabsContent value="advanced" className="p-6 space-y-6 mt-0">
                  <SettingsAdvanced />
                </TabsContent>
              </Tabs>
            ) : (
              renderDocumentationContent()
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default SettingsDocumentation;
