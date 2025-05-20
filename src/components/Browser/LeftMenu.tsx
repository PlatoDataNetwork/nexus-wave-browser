
import React from "react";
import { Search, LayoutList, Compass, Globe, ChartBar, Briefcase, Settings } from "lucide-react";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
} from "@/components/ui/sidebar";

interface LeftMenuProps {
  isVisible: boolean;
  onClose: () => void;
}

const menuItems = [
  {
    title: "Discovery",
    icon: Search,
    path: "/discovery"
  },
  {
    title: "Analytics",
    icon: LayoutList,
    path: "/analytics"
  },
  {
    title: "Web3 Browser",
    icon: Compass,
    path: "/app"
  },
  {
    title: "DefiX Gateway",
    icon: Globe,
    path: "/defix-gateway"
  },
  {
    title: "Market Data",
    icon: ChartBar,
    path: "/market-data"
  },
  {
    title: "Trading & Staking",
    icon: Briefcase,
    path: "/trading-staking"
  },
  {
    title: "Account Settings",
    icon: Settings,
    path: "/settings"
  }
];

const LeftMenu: React.FC<LeftMenuProps> = ({ isVisible, onClose }) => {
  return (
    <Sidebar
      variant="floating"
      collapsible={isVisible ? "none" : "offcanvas"}
      className={`transition-all duration-300 ${isVisible ? "translate-x-0" : "-translate-x-full"}`}
    >
      <SidebarContent className="py-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title} 
                asChild
                className="h-14 hover:bg-nexus-purple/10 gap-3"
              >
                <a href={item.path} className="flex items-center">
                  <item.icon size={22} />
                  <span className="text-lg font-medium">{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default LeftMenu;
