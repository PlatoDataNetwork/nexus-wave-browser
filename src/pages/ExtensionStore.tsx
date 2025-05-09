
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
import BrowserFooter from "@/components/Browser/BrowserFooter";
import { Search } from "lucide-react";

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
    <PageLayout includeFooter={false}>
      <div className="p-6 max-w-7xl mx-auto w-full bg-black text-white">
        {/* Header section - restyled to match image */}
        <h1 className="text-3xl md:text-4xl font-bold text-nexus-purple mb-8">
          Nexus Wave Extension Library
        </h1>
        
        {/* Tabs and search controls - restyled to match image */}
        <div className="mt-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Tabs */}
            <div className="flex space-x-2 bg-[#151515] rounded-lg overflow-hidden">
              <button 
                className={`px-4 py-3 ${activeTab === 'all' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => setActiveTab('all')}
              >
                All Extensions
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'installed' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => setActiveTab('installed')}
              >
                Installed
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'favorites' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => setActiveTab('favorites')}
              >
                Favorites
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'featured' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => setActiveTab('featured')}
              >
                Featured
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'beta' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => setActiveTab('beta')}
              >
                Beta
              </button>
              <button 
                className={`px-4 py-3 ${activeTab === 'admin' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => setActiveTab('admin')}
              >
                Admin
              </button>
            </div>
            
            {/* Search Box */}
            {activeTab !== "beta" && activeTab !== "admin" && (
              <div className="flex-1 relative">
                <div className="relative flex items-center">
                  <div className="absolute left-3">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search extensions..."
                    className="w-full bg-[#151515] text-white pl-10 pr-4 py-3 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            )}
            
            {/* Filter Button */}
            <button className="bg-[#151515] text-white px-4 py-3 rounded-lg flex items-center space-x-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21M7 12H17M11 18H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Filter</span>
            </button>
            
            {/* View Mode Buttons */}
            <div className="flex bg-[#151515] rounded-lg overflow-hidden">
              <button
                className={`p-3 ${viewMode === 'grid' ? 'bg-nexus-purple' : 'bg-transparent'}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="3" y="3" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                  <rect x="3" y="11" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                  <rect x="11" y="3" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                  <rect x="11" y="11" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                </svg>
              </button>
              <button
                className={`p-3 ${viewMode === 'list' ? 'bg-nexus-purple' : 'bg-transparent'}`}
                onClick={() => setViewMode('list')}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 5H17M3 10H17M3 15H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          
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
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Adding a single footer here if we need one for this page */}
      <BrowserFooter />
    </PageLayout>
  );
};

export default ExtensionStore;
