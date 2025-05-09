import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { extensionsData } from "@/lib/extensionsData";
import ExtensionList from "@/components/Extensions/ExtensionList";
import BetaExtensions from "@/components/Extensions/BetaExtensions";
import PageLayout from "@/components/Layout/PageLayout";
import ExtensionAdmin from "@/pages/ExtensionAdmin";
import BrowserFooter from "@/components/Browser/BrowserFooter";
import ExtensionNavBar from "@/components/Extensions/ExtensionNavBar";
import ExtensionStats from "@/components/Extensions/ExtensionStats";

const ExtensionStore: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [extensions, setExtensions] = useState(extensionsData);
  
  // Parse tab from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['all', 'installed', 'favorites', 'featured', 'beta', 'admin'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);
  
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
  
  const handleToggleFavorite = (id: number) => {
    setExtensions(
      extensions.map(ext => 
        ext.id === id ? { ...ext, featured: !ext.featured } : ext
      )
    );
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: extension.featured ? "Removed from favorites" : "Added to favorites",
        description: extension.featured 
          ? `${extension.name} has been removed from your favorites` 
          : `${extension.name} has been added to your favorites`,
      });
    }
  };

  // Handle tab changes including URL updates
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // Update URL with the tab parameter
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <PageLayout includeFooter={false}>
      <div className="p-6 max-w-7xl mx-auto w-full bg-black text-white">
        {/* Header section */}
        <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-8">
          Nexus Wave Extension Library
        </h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#2a1e48] rounded-lg p-6">
            <div className="text-sm font-medium mb-2">Available</div>
            <div className="text-4xl font-bold">40</div>
          </div>
          <div className="bg-[#1e2a48] rounded-lg p-6">
            <div className="text-sm font-medium mb-2">Installed</div>
            <div className="text-4xl font-bold">16</div>
          </div>
          <div className="bg-[#3a1e38] rounded-lg p-6">
            <div className="text-sm font-medium mb-2">Featured</div>
            <div className="text-4xl font-bold">16</div>
          </div>
          <div className="bg-[#1e3a38] rounded-lg p-6">
            <div className="text-sm font-medium mb-2">Security</div>
            <div className="text-4xl font-bold">0</div>
          </div>
        </div>
        
        {/* New navigation bar */}
        <ExtensionNavBar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
        />
        
        {/* Extension Content based on active tab */}
        <div className="mt-6">
          {activeTab === "admin" ? (
            <div className="inline-block w-full">
              <ExtensionAdmin />
            </div>
          ) : activeTab === "beta" ? (
            <BetaExtensions />
          ) : (
            <ExtensionList 
              extensions={filteredExtensions} 
              viewMode={viewMode} 
              onInstall={handleInstall}
              onToggleFavorite={handleToggleFavorite}
            />
          )}
        </div>
      </div>
      
      {/* Footer */}
      <BrowserFooter />
    </PageLayout>
  );
};

export default ExtensionStore;
