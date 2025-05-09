import React from "react";

interface ExtensionNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ExtensionNavBar: React.FC<ExtensionNavBarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
      {/* Custom Tabs */}
      <div className="flex rounded-lg overflow-hidden bg-[#151515]">
        <button 
          className={`px-6 py-3 ${activeTab === 'all' ? 'bg-nexus-purple text-white' : 'text-white'}`}
          onClick={() => setActiveTab('all')}
        >
          All Extensions
        </button>
        <button 
          className={`px-6 py-3 ${activeTab === 'installed' ? 'bg-nexus-purple text-white' : 'text-white'}`}
          onClick={() => setActiveTab('installed')}
        >
          Installed
        </button>
        <button 
          className={`px-6 py-3 ${activeTab === 'favorites' ? 'bg-nexus-purple text-white' : 'text-white'}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites
        </button>
        <button 
          className={`px-6 py-3 ${activeTab === 'featured' ? 'bg-nexus-purple text-white' : 'text-white'}`}
          onClick={() => setActiveTab('featured')}
        >
          Featured
        </button>
        <button 
          className={`px-6 py-3 ${activeTab === 'beta' ? 'bg-nexus-purple text-white' : 'text-white'}`}
          onClick={() => setActiveTab('beta')}
        >
          Beta
        </button>
        <button 
          className={`px-6 py-3 ${activeTab === 'smile' ? 'bg-nexus-purple text-white' : 'text-white'}`}
          onClick={() => setActiveTab('smile')}
        >
          Smile
        </button>
      </div>
    </div>
  );
};

export default ExtensionNavBar;
