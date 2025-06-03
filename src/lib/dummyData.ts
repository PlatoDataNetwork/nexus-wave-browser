
import { LucideIcon } from "lucide-react";
import { Book, GraduationCap, Home, Rocket, Wallet, Database, FileSearch, ArrowRightLeft, Landmark } from "lucide-react";

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

// Add the missing bookmarks export
export const bookmarks = [
  {
    id: "bookmark-1",
    title: "Ethereum",
    url: "https://ethereum.org",
    color: "#627EEA"
  },
  {
    id: "bookmark-2",
    title: "Nexus Browser",
    url: "https://nexusbrowser.io",
    color: "#9b87f5"
  },
  {
    id: "bookmark-3",
    title: "Uniswap",
    url: "https://uniswap.org",
    color: "#FF007A"
  },
  {
    id: "bookmark-4",
    title: "OpenSea",
    url: "https://opensea.io",
    color: "#2081E2"
  },
  {
    id: "bookmark-5",
    title: "MetaMask",
    url: "https://metamask.io",
    color: "#F6851B"
  },
  {
    id: "bookmark-6",
    title: "PlatoAI Creator",
    url: "https://dashboard.platodata.io",
    color: "#7B63DD"
  },
  {
    id: "bookmark-7",
    title: "PlatoAI Analyst",
    url: "https://analyst.platodata.io",
    color: "#6366F1"
  }
];

// Add the missing popularDApps export
export const popularDApps = [
  {
    id: 1,
    name: "Uniswap",
    description: "Decentralized token exchange",
    url: "https://app.uniswap.org",
    category: "DeFi",
    icon: ArrowRightLeft
  },
  {
    id: 2,
    name: "Aave",
    description: "Lending and borrowing protocol",
    url: "https://app.aave.com",
    category: "DeFi",
    icon: Landmark
  },
  {
    id: 3,
    name: "The Graph",
    description: "Blockchain data indexing",
    url: "https://thegraph.com",
    category: "Infrastructure",
    icon: Database
  },
  {
    id: 4,
    name: "Lens Protocol",
    description: "Decentralized social media",
    url: "https://lens.xyz",
    category: "Social",
    icon: FileSearch
  }
];
