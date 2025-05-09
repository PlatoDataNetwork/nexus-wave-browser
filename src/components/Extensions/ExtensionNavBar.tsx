
import React from "react";
import { Search } from "lucide-react";

interface ExtensionNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ExtensionNavBar: React.FC<ExtensionNavBarProps> = ({ 
  activeTab, 
  setActiveTab 
}) => {
  const tabs = [
    { id: "all", label: "All Extensions" },
    { id: "installed", label: "Installed" },
    { id: "favorites", label: "Favorites" },
    { id: "featured", label: "Featured" },
    { id: "beta", label: "Beta" },
    { id: "smile", label: "Smile" },
  ];

  return (
    <div className="flex items-center justify-between w-full gap-4">
      {/* Left side tabs */}
      <div className="flex rounded-lg overflow-hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-6 py-3 ${
              activeTab === tab.id
                ? "bg-nexus-purple text-white"
                : "bg-[#1A1A1A] text-white"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Middle search box */}
      <div className="flex-1 relative max-w-xl">
        <div className="relative flex items-center">
          <div className="absolute left-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search extensions..."
            className="w-full bg-[#1A1A1A] text-white pl-10 pr-4 py-3 rounded-lg"
          />
        </div>
      </div>
      
      {/* Right side buttons */}
      <div className="flex items-center gap-2">
        {/* Filter button */}
        <button className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg flex items-center space-x-2">
          <span>Filter</span>
        </button>
        
        {/* View mode buttons */}
        <button className="bg-nexus-purple text-white p-3 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="3" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
            <rect x="3" y="11" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
            <rect x="11" y="3" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
            <rect x="11" y="11" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
          </svg>
        </button>
        <button className="bg-[#1A1A1A] text-white p-3 rounded-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5H17M3 10H17M3 15H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ExtensionNavBar;
