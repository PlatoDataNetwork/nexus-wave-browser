
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, Search, Settings as SettingsIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SettingsAppearance from "@/components/Settings/SettingsAppearance";
import SettingsPrivacySecurity from "@/components/Settings/SettingsPrivacySecurity";
import SettingsAutofill from "@/components/Settings/SettingsAutofill";
import SettingsSearch from "@/components/Settings/SettingsSearch";

const Settings: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-8 bg-card border-b border-border">
        <h1 className="text-xs font-medium">Nexus Wave Browser - Settings</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <SettingsIcon className="h-5 w-5 mr-2 text-muted-foreground" />
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

            <Tabs defaultValue="appearance" orientation="vertical" className="w-full">
              <TabsList className="flex flex-col items-start justify-start h-auto gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="appearance"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Appearance</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Privacy and security</span>
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
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsContent value="appearance" className="p-6 space-y-6 mt-0">
                <SettingsAppearance />
              </TabsContent>
              <TabsContent value="privacy" className="p-6 space-y-6 mt-0">
                <SettingsPrivacySecurity />
              </TabsContent>
              <TabsContent value="autofill" className="p-6 space-y-6 mt-0">
                <SettingsAutofill />
              </TabsContent>
              <TabsContent value="search" className="p-6 space-y-6 mt-0">
                <SettingsSearch />
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>

      <div className="flex justify-end p-4 border-t border-border bg-card">
        <Button asChild variant="outline">
          <Link to="/">Return to Browser</Link>
        </Button>
      </div>
    </div>
  );
};

export default Settings;
