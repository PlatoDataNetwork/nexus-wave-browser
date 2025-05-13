
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { extensionsData } from "@/lib/extensionsData";
import { betaExtensionsData } from "@/lib/betaExtensionsData";
import ExtensionList from "@/components/Extensions/ExtensionList";
import ConceptualExtensions from "@/components/Extensions/ConceptualExtensions";
import SmileAnimation from "@/components/Extensions/SmileAnimation";
import ExtensionTabBar from "@/components/Extensions/ExtensionTabBar";
import ExtensionStats from "@/components/Extensions/ExtensionStats";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface ExtensionStoreProps {
  onNavigate?: (url: string) => void;
}

const ExtensionStore: React.FC<ExtensionStoreProps> = ({ onNavigate }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Combine regular and beta extensions
  const [extensions, setExtensions] = useState([...extensionsData, ...betaExtensionsData]);
  
  // Memoize the combined extensions to avoid unnecessary re-renders
  const allExtensions = useMemo(() => {
    return [...extensionsData, ...betaExtensionsData];
  }, []);
  
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
  const categories = useMemo(() => {
    return [...new Set([...allExtensions]
      .map(ext => ext.category)
      .filter(category => category !== "Communication"))]
      .sort(); // Sort categories alphabetically
  }, [allExtensions]);
  
  // Filter extensions based on search query, active category, and tab
  const filteredExtensions = useMemo(() => {
    return extensions.filter(extension => {
      const matchesSearch = 
        extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        extension.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = activeCategory === "" || extension.category === activeCategory;
      
      const matchesTab = 
        activeTab === "all" || 
        (activeTab === "installed" && extension.installed) ||
        (activeTab === "featured" && extension.featured) ||
        (activeTab === "favorites" && extension.featured) || // Using featured as favorites for demo
        (activeTab === "beta" && extension.isBeta); // Use isBeta property for beta tab filtering
      
      return matchesSearch && matchesCategory && matchesTab;
    });
  }, [extensions, searchQuery, activeCategory, activeTab]);

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

  // Handle navigation for extension links
  const handleExtensionNavigation = (url: string) => {
    if (onNavigate) {
      // Use the provided navigation function if available
      onNavigate(url);
    } else {
      // Fallback to navigating to /app with URL parameter
      navigate(`/app?url=${encodeURIComponent(url)}`);
    }
  };

  // Handle tab changes including URL updates
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Update URL with the tab and category parameters
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('tab', tab);
    
    // Only include category if it's not empty
    if (activeCategory !== "") {
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
    
    // Only include category if it's not empty
    if (category !== "") {
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
    <div className="w-full pb-16 px-4">
      {/* Header section */}
      <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-8">
        Nexus Wave Extension Library
      </h1>
      
      {/* Stats Cards - Ensure we pass ALL extensions to the stats component */}
      <ExtensionStats extensions={allExtensions} />
      
      {/* Tab & Category navigation */}
      <ExtensionTabBar 
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Category filter dropdown */}
      <div className="flex items-center mt-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter by Category{activeCategory ? `: ${activeCategory}` : ''}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 max-h-[300px] overflow-y-auto">
            {activeCategory && (
              <DropdownMenuItem onClick={() => handleCategoryChange("")}>
                Clear Filter
              </DropdownMenuItem>
            )}
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category} 
                onClick={() => handleCategoryChange(category)}
                className={activeCategory === category ? "bg-accent" : ""}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
            onNavigate={handleExtensionNavigation}
          />
        )}
      </div>
    </div>
  );
};

export default ExtensionStore;
