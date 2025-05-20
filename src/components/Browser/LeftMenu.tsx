
import React from "react";
import { Search, BarChart3, Globe, Layers, LineChart, Briefcase, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { useSidebarToggle } from "@/hooks/useSidebarToggle";

interface LeftMenuProps {
  onNavigate?: (url: string) => void;
}

// Menu items configuration
const menuItems = [
  { icon: Search, label: "Discovery", url: "/discovery" },
  { icon: BarChart3, label: "Analytics", url: "/analytics" },
  { icon: Globe, label: "Web3 Browser", url: "/web3-browser" },
  { icon: Layers, label: "DeFi Gateway", url: "/defi-gateway" },
  { icon: LineChart, label: "Market Data", url: "/market-data" },
  { icon: Briefcase, label: "Trading & Staking", url: "/trading-staking" },
  { icon: Settings, label: "Account Settings", url: "/account-settings" },
];

const LeftMenu: React.FC<LeftMenuProps> = ({ onNavigate }) => {
  const { showSidebar, toggleSidebar } = useSidebarToggle(true);
  
  const handleNavigate = (url: string) => {
    if (onNavigate) {
      onNavigate(url);
    }
  };

  if (!showSidebar) {
    return (
      <button 
        onClick={toggleSidebar}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-nexus-header-blue hover:bg-nexus-purple/90 text-white p-2 rounded-r-md"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    );
  }

  return (
    <div className="h-full bg-nexus-space-black border-r border-nexus-header-blue/20">
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-nexus-header-blue/20">
          <div className="text-white font-bold text-xl">PLATO AI</div>
          <button 
            onClick={toggleSidebar} 
            className="text-white hover:bg-nexus-purple/20 p-1 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <ul className="py-2">
            {menuItems.map((item, index) => (
              <li key={index} className="px-2 py-1">
                <button
                  className="w-full flex items-center gap-3 px-3 py-3 text-white hover:bg-nexus-header-blue rounded-md transition-colors"
                  onClick={() => handleNavigate(item.url)}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg">{item.label}</span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-auto w-5 h-5" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftMenu;
