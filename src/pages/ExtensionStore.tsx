
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { extensionsData } from "@/lib/extensionsData";
import ExtensionStats from "@/components/Extensions/ExtensionStats";
import ExtensionSearchBar from "@/components/Extensions/ExtensionSearchBar";
import ExtensionList from "@/components/Extensions/ExtensionList";
import BetaExtensions from "@/components/Extensions/BetaExtensions";
import PageLayout from "@/components/Layout/PageLayout";

const ExtensionStore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [extensions, setExtensions] = useState(extensionsData);
  
  // Get unique categories from extensions
  const categories = ["all", ...new Set(extensionsData.map(ext => ext.category))];

  // Filter extensions based on search query, active category, and tab
  const filteredExtensions = extensions.filter(extension => {
    const matchesSearch = 
      extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extension.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || extension.category === activeCategory;
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "installed" && extension.installed) ||
      (activeTab === "featured" && extension.featured);
    
    return matchesSearch && matchesCategory && matchesTab;
  });

  const handleInstall = (id: number) => {
    setExtensions(
      extensions.map(ext => 
        ext.id === id ? { ...ext, installed: !ext.installed } : ext
      )
    );
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: extension.installed ? "Extension uninstalled" : "Extension installed",
        description: extension.installed 
          ? `${extension.name} has been removed from your browser` 
          : `${extension.name} has been added to your browser`,
      });
    }
  };

  // Handle Admin Navigation
  const handleAdminNavigation = () => {
    toast({
      title: "Navigating to Admin",
      description: "Opening Extension Admin Console"
    });
    navigate("/extension-admin");
  };

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <h1 className="text-xl md:text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
          Nexus Wave Extension Library
        </h1>

        {/* Stats Cards */}
        <ExtensionStats extensions={extensions} />
        
        {/* Tabs and search controls */}
        <div className="mt-8">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <TabsList className="h-12 bg-gray-800/80 rounded-lg border border-gray-700">
                <TabsTrigger 
                  value="all" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  All Extensions
                </TabsTrigger>
                <TabsTrigger 
                  value="installed" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  Installed
                </TabsTrigger>
                <TabsTrigger 
                  value="featured" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger 
                  value="beta" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  Beta
                </TabsTrigger>
                <TabsTrigger 
                  value="admin" 
                  onClick={handleAdminNavigation} 
                  className="text-base px-6 py-2.5 bg-nexus-purple/10 hover:bg-nexus-purple/20 transition-colors rounded-md"
                >
                  Admin
                </TabsTrigger>
              </TabsList>
              
              {/* Search bar moved to the same line as tabs */}
              {activeTab !== "beta" && (
                <ExtensionSearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categories={categories}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  viewMode={viewMode}
                  setViewMode={setViewMode}
                />
              )}
            </div>

            {/* Content based on active tab */}
            <TabsContent value="all" className="mt-6 p-0">
              <ExtensionList 
                extensions={filteredExtensions} 
                viewMode={viewMode} 
                onInstall={handleInstall} 
              />
            </TabsContent>

            <TabsContent value="installed" className="mt-6 p-0">
              <ExtensionList 
                extensions={extensions.filter(ext => ext.installed)} 
                viewMode={viewMode} 
                onInstall={handleInstall} 
              />
            </TabsContent>

            <TabsContent value="featured" className="mt-6 p-0">
              <ExtensionList 
                extensions={extensions.filter(ext => ext.featured)} 
                viewMode={viewMode} 
                onInstall={handleInstall} 
              />
            </TabsContent>

            <TabsContent value="beta" className="mt-6 p-0">
              <BetaExtensions />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtensionStore;
