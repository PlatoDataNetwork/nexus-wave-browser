
import React from "react";
import { useNavigate } from "react-router-dom";
import { Search, LayoutGrid, List, Filter } from "lucide-react";

interface ExtensionTabBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  viewMode?: "grid" | "list";
  setViewMode?: (mode: "grid" | "list") => void;
}

const ExtensionTabBar: React.FC<ExtensionTabBarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode
}) => {
  const navigate = useNavigate();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Tabs */}
        <div className="flex space-x-2 bg-[#151515] rounded-lg overflow-hidden">
          <button 
            className={`px-4 py-3 ${activeTab === 'all' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('all')}
          >
            All Extensions
          </button>
          <button 
            className={`px-4 py-3 ${activeTab === 'installed' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('installed')}
          >
            Installed
          </button>
          <button 
            className={`px-4 py-3 ${activeTab === 'favorites' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('favorites')}
          >
            Favorites
          </button>
          <button 
            className={`px-4 py-3 ${activeTab === 'featured' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('featured')}
          >
            Featured
          </button>
          <button 
            className={`px-4 py-3 ${activeTab === 'beta' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('beta')}
          >
            Beta
          </button>
          <button 
            className={`px-4 py-3 ${activeTab === 'admin' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin
          </button>
        </div>
        
        {/* Search Box - Only shown when not in Beta or Admin tabs */}
        {activeTab !== "admin" && setSearchQuery && (
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
          <Filter className="h-5 w-5" />
          <span>Filter</span>
        </button>
        
        {/* View Mode Buttons - Only shown when viewMode and setViewMode are provided */}
        {viewMode && setViewMode && (
          <div className="flex bg-[#151515] rounded-lg overflow-hidden">
            <button
              className={`p-3 ${viewMode === 'grid' ? 'bg-nexus-purple' : 'bg-transparent'}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-5 w-5 text-white" />
            </button>
            <button
              className={`p-3 ${viewMode === 'list' ? 'bg-nexus-purple' : 'bg-transparent'}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="h-5 w-5 text-white" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtensionTabBar;
