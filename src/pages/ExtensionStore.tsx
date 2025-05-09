
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
import ExtensionAdmin from "@/pages/ExtensionAdmin";

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
  
  // Add favorites filter
  const favoriteExtensions = extensions.filter(ext => ext.featured);

  // Filter extensions based on search query, active category, and tab
  const filteredExtensions = extensions.filter(extension => {
    const matchesSearch = 
      extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extension.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || extension.category === activeCategory;
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "installed" && extension.installed) ||
      (activeTab === "featured" && extension.featured) ||
      (activeTab === "favorites" && extension.featured); // Using featured as favorites for demo
    
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

  return (
    <PageLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        {/* Header with Admin Console - No Shield */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
            Nexus Wave Extension Library
          </h1>
          {activeTab !== "admin" && (
            <h1 
              className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent cursor-pointer"
              onClick={() => setActiveTab("admin")}
            >
              Admin Console
            </h1>
          )}
        </div>

        {/* Stats Cards - Only show when not in admin tab */}
        {activeTab !== "admin" && <ExtensionStats extensions={extensions} />}
        
        {/* Tabs and search controls */}
        <div className="mt-6">
          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center">
                <TabsList className="h-10 bg-muted/30 rounded-lg border border-muted p-0.5 mr-3">
                  <TabsTrigger 
                    value="all" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    All Extensions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="installed" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Installed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="favorites" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger 
                    value="featured" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Featured
                  </TabsTrigger>
                  <TabsTrigger 
                    value="beta" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Beta
                  </TabsTrigger>
                  <TabsTrigger 
                    value="admin" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Admin
                  </TabsTrigger>
                </TabsList>

                {/* Move search to be in same row with tabs for consistency */}
                {activeTab !== "beta" && activeTab !== "admin" && (
                  <div className="flex-1">
                    <ExtensionSearchBar
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      categories={categories}
                      activeCategory={activeCategory}
                      setActiveCategory={setActiveCategory}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                    />
                  </div>
                )}
              </div>
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
            
            <TabsContent value="favorites" className="mt-6 p-0">
              <ExtensionList 
                extensions={favoriteExtensions} 
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

            {/* Admin content included directly in the ExtensionStore page */}
            <TabsContent value="admin" className="mt-6 p-0">
              <div className="inline-block w-full">
                <ExtensionAdmin />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtensionStore;
