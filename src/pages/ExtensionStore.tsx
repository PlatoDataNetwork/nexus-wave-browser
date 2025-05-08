
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { UserCog } from "lucide-react";
import { extensionsData } from "@/lib/extensionsData";
import ExtensionStats from "@/components/Extensions/ExtensionStats";
import ExtensionSearchBar from "@/components/Extensions/ExtensionSearchBar";
import ExtensionList from "@/components/Extensions/ExtensionList";

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
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
          Nexus Wave Extension Library
        </h1>
      </div>

      {/* Stats Cards */}
      <ExtensionStats extensions={extensions} />
      
      {/* Unified control bar */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-4 bg-muted/30 p-4 rounded-lg">
        <Tabs 
          defaultValue="all" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full lg:w-auto"
        >
          <TabsList className="w-full lg:w-auto p-1 h-12 bg-background/30">
            <TabsTrigger 
              value="all" 
              className="text-base px-6 py-2.5 data-[state=active]:bg-background"
            >
              All Extensions
            </TabsTrigger>
            <TabsTrigger 
              value="installed" 
              className="text-base px-6 py-2.5 data-[state=active]:bg-background"
            >
              Installed
            </TabsTrigger>
            <TabsTrigger 
              value="featured" 
              className="text-base px-6 py-2.5 data-[state=active]:bg-background"
            >
              Featured
            </TabsTrigger>
            <TabsTrigger 
              value="admin" 
              onClick={handleAdminNavigation} 
              className="text-base px-6 py-2.5 bg-nexus-purple/10 hover:bg-nexus-purple/20 data-[state=active]:bg-background"
            >
              <UserCog className="h-5 w-5 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <ExtensionSearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          viewMode={viewMode}
          setViewMode={setViewMode}
          onAdminNavigation={handleAdminNavigation}
        />
      </div>

      {/* Extensions grid/list */}
      <ExtensionList 
        extensions={filteredExtensions} 
        viewMode={viewMode} 
        onInstall={handleInstall} 
      />
    </div>
  );
};

export default ExtensionStore;
