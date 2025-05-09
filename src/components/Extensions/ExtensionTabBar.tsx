
import React from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

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
            className={`px-4 py-3 ${activeTab === 'admin' ? 'bg-nexus-purple text-white' : 'text-white'}`}
            onClick={() => handleTabChange('admin')}
          >
            Admin
          </button>
        </div>
        
        {/* Search Box - Only shown when not in Admin tab */}
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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6H21M7 12H17M11 18H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Filter</span>
        </button>
        
        {/* View Mode Buttons - Only shown when viewMode and setViewMode are provided */}
        {viewMode && setViewMode && (
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
        )}
      </div>
    </div>
  );
};

export default ExtensionTabBar;
