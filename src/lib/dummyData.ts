import { LucideIcon } from "lucide-react";
import { Book, GraduationCap, Home, Rocket } from "lucide-react";

// Tab interface used for browser tabs
export interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
  icon?: LucideIcon;
}

// Default browser tabs shown on application load
export const initialTabs: Tab[] = [
  {
    id: "tab-1",
    title: "Platodata.io",
    url: "https://Platodata.io",
    isActive: true,
    icon: undefined
  },
  {
    id: "tab-2",
    title: "Google",
    url: "https://google.com",
    isActive: false,
    icon: undefined
  },
  {
    id: "tab-3",
    title: "Uniswap",
    url: "https://uniswap.org",
    isActive: false,
    icon: undefined
  },
  {
    id: "tab-4",
    title: "Lens Protocol",
    url: "https://lens.xyz",
    isActive: false,
    icon: undefined
  }
];

export const shortcuts = [
  {
    name: "Home",
    description: "Go to the home page",
    icon: Home,
    url: "https://platodata.io",
  },
  {
    name: "Learn",
    description: "Learn about web3",
    icon: Book,
    url: "https://platodata.io/learn",
  },
  {
    name: "Academy",
    description: "Take web3 courses",
    icon: GraduationCap,
    url: "https://platodata.io/academy",
  },
  {
    name: "Launchpad",
    description: "Discover new web3 projects",
    icon: Rocket,
    url: "https://platodata.io/launchpad",
  },
];
