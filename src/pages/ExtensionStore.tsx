import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { extensionsData } from "@/lib/extensionsData";
import { betaExtensionsData } from "@/lib/betaExtensionsData";
import ExtensionList from "@/components/Extensions/ExtensionList";
import ConceptualExtensions from "@/components/Extensions/ConceptualExtensions";
import SmileAnimation from "@/components/Extensions/SmileAnimation";
import ExtensionTabBar from "@/components/Extensions/ExtensionTabBar";
import ExtensionStats from "@/components/Extensions/ExtensionStats";
import { Button } from "@/components/ui/button";

const ExtensionStore: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Combine regular and beta extensions
  const [extensions, setExtensions] = useState([...extensionsData, ...betaExtensionsData]);
  
  // Parse tab from URL on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab && ['all', 'installed', 'favorites', 'featured', 'beta', 'admin', 'smile'].includes(tab)) {
      setActiveTab(tab);
    }
    
    // Get the category from URL if exists
    const category = params.get('category');
    if (category) {
      setActiveCategory(category);
    }
    
    // Reset extensions to ensure they're properly loaded
    setExtensions([...extensionsData, ...betaExtensionsData]);
  }, [location.search]);
  
  // Get unique categories from extensions, excluding "Communication"
  const categories = ["all", ...new Set([...extensionsData, ...betaExtensionsData]
    .map(ext => ext.category)
    .filter(category => category !== "Communication"))];
  
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
      (activeTab === "favorites" && extension.featured) || // Using featured as favorites for demo
      (activeTab === "beta" && extension.isBeta); // Use isBeta property for beta tab filtering
    
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
    
    // Update URL with the tab and category parameters
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);
    
    // Only include category if it's not "all"
    if (activeCategory !== "all") {
      searchParams.set('category', activeCategory);
    } else {
      searchParams.delete('category');
    }
    
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };
  
  // Handle category changes including URL updates
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    
    // Update URL with the category parameter
    const searchParams = new URLSearchParams(location.search);
    
    // Only include category if it's not "all"
    if (category !== "all") {
      searchParams.set('category', category);
    } else {
      searchParams.delete('category');
    }
    
    // Keep the existing tab parameter
    if (activeTab !== "all") {
      searchParams.set('tab', activeTab);
    }
    
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  return (
    <div className="w-full pb-16">
      {/* Header section */}
      <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-8">
        Nexus Wave Extension Library
      </h1>
      
      {/* Stats Cards - Use the ExtensionStats component with all extensions */}
      <ExtensionStats extensions={extensions} />
      
      {/* Tab & Category navigation */}
      <ExtensionTabBar 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mt-4 mb-6">
        {categories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={activeCategory === category ? "default" : "outline"}
            className={activeCategory === category ? "bg-nexus-purple text-white" : ""}
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
      
      {/* Extension Content based on active tab */}
      <div className="mt-6">
        {activeTab === "smile" ? (
          <SmileAnimation />
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
  );
};

export default ExtensionStore;
