
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import SettingsAppearance from "@/components/Settings/SettingsAppearance";
import SettingsPrivacySecurity from "@/components/Settings/SettingsPrivacySecurity";
import SettingsAutofill from "@/components/Settings/SettingsAutofill";
import SettingsSearch from "@/components/Settings/SettingsSearch";
import SettingsAdvanced from "@/components/Settings/SettingsAdvanced";
import SettingsWeb3 from "@/components/Settings/SettingsWeb3";
import SettingsExtensions from "@/components/Settings/SettingsExtensions";
import SettingsShields from "@/components/Settings/SettingsShields";
import PageLayout from "@/components/Layout/PageLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Settings: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extract active tab from URL or use default
  const getTabFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || "appearance";
  };

  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState(getTabFromUrl);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/settings?tab=${value}`, { replace: true });
  };

  return (
    <PageLayout>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <SettingsIcon className="h-5 w-5 mr-2 text-nexus-blue" />
              <h2 className="font-medium">Settings</h2>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search settings"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

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
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Appearance</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="shields"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Shields & Privacy</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Privacy and Security</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="extensions"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Extensions</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="autofill"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Autofill</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="search"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Search Engine</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="web3"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Web3</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-nexus-blue/20 data-[state=active]:text-nexus-blue data-[state=active]:font-medium"
                >
                  <span>Advanced</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="appearance" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Appearance</h2>
                <SettingsAppearance />
              </TabsContent>
              <TabsContent value="shields" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Shields & Privacy</h2>
                <SettingsShields />
              </TabsContent>
              <TabsContent value="privacy" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Privacy and Security</h2>
                <SettingsPrivacySecurity />
              </TabsContent>
              <TabsContent value="extensions" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Extensions</h2>
                <SettingsExtensions />
              </TabsContent>
              <TabsContent value="autofill" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Autofill</h2>
                <SettingsAutofill />
              </TabsContent>
              <TabsContent value="search" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Search Engine</h2>
                <SettingsSearch />
              </TabsContent>
              <TabsContent value="web3" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Web3 Settings</h2>
                <SettingsWeb3 />
              </TabsContent>
              <TabsContent value="advanced" className="p-6 space-y-6 mt-0">
                <h2 className="text-2xl font-bold mb-6">Advanced Settings</h2>
                <SettingsAdvanced />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
