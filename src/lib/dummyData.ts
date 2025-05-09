import { Settings, Search, Chrome, Globe, Link } from "lucide-react";

export type Tab = {
  id: string;
  title: string;
  url: string;
  icon?: React.ElementType;
  isActive: boolean;
};

export type Bookmark = {
  id: string;
  title: string;
  url: string;
  icon?: React.ElementType;
  color: string; // Changed from optional to required
};

export type DApp = {
  id: string;
  name: string;
  description: string;
  url: string;
  icon?: React.ElementType;
  category: string;
};

export const initialTabs: Tab[] = [
  {
    id: "1",
    title: "Nexus Dashboard",
    url: "https://nexus.wave/dashboard",
    icon: Chrome,
    isActive: true,
  },
  {
    id: "2",
    title: "Uniswap",
    url: "https://uniswap.org",
    icon: Globe,
    isActive: false,
  },
  {
    id: "3",
    title: "MetaMask",
    url: "https://metamask.io",
    icon: Globe,
    isActive: false,
  },
];

export const bookmarks: Bookmark[] = [
  {
    id: "1",
    title: "Uniswap",
    url: "https://app.uniswap.org",
    icon: Chrome,
    color: "#FF007A", // Added color property
  },
  {
    id: "2",
    title: "OpenSea",
    url: "https://opensea.io",
    icon: Globe,
    color: "#2081E2", // Added color property
  },
  {
    id: "5",
    title: "Aave",
    url: "https://aave.com",
    icon: Link,
    color: "#B6509E", // Added color property
  },
  {
    id: "6",
    title: "Magic Eden",
    url: "https://magiceden.io",
    icon: Globe,
    color: "#E42575", // Added color property
  },
  {
    id: "7",
    title: "Lumia",
    url: "https://lumia.org",
    icon: Globe,
    color: "#6B46C1", // Added color property
  },
  {
    id: "8",
    title: "gTrade",
    url: "https://sol.gains.trade/",
    icon: Globe,
    color: "#5A67D8", // Added color property
  },
  {
    id: "9",
    title: "Raydium",
    url: "https://raydium.io",
    icon: Globe,
    color: "#2172E5", // Added color property
  },
  {
    id: "10",
    title: "MarginFi",
    url: "https://www.marginfi.com",
    icon: Globe,
    color: "#3182CE", // Added color property
  },
  {
    id: "11",
    title: "PlatoAi",
    url: "https://web3-vercel-nexus.vercel.app/",
    icon: Globe,
    color: "#8B5CF6", // Added color property
  },
  {
    id: "12",
    title: "FYNN",
    url: "https://fyntechnical.com/",
    icon: Globe,
    color: "#4F46E5", // Added color property
  },
  {
    id: "13",
    title: "Atlas DEX",
    url: "https://atlasdex.finance",
    icon: Globe,
    color: "#FF7A00", // Added color property
  },
  {
    id: "14",
    title: "Erratic",
    url: "https://erratic.finance",
    icon: Globe,
    color: "#EC4899", // Added color property
  },
  {
    id: "15",
    title: "Gate",
    url: "https://gate.io",
    icon: Globe,
    color: "#10B981", // Added color property
  },
  {
    id: "16",
    title: "Honeyland",
    url: "https://honey.land",
    icon: Globe,
    color: "#F59E0B", // Added color property
  },
  {
    id: "17",
    title: "Layer3",
    url: "https://layer3.xyz",
    icon: Globe,
    color: "#7C3AED", // Added color property
  },
  {
    id: "18",
    title: "Galxe",
    url: "https://glaxe.com",
    icon: Globe,
    color: "#6366F1", // Added color property
  },
  {
    id: "19",
    title: "Saber",
    url: "https://saberdao.so",
    icon: Globe,
    color: "#1A1F2C", // Added color property
  },
  {
    id: "20",
    title: "Gamblex",
    url: "https://Gamblex.casino",
    icon: Globe,
    color: "#DC2626", // Added color property
  },
  {
    id: "21",
    title: "UPFI",
    url: "https://upfi.network",
    icon: Globe,
    color: "#0891B2", // Added color property
  },
  {
    id: "22",
    title: "Vogon Cloud",
    url: "https://www.spectralcapital.com/vogon",
    icon: Globe,
    color: "#0369A1", // Added color property
  },
];

export const popularDApps: DApp[] = [
  {
    id: "1",
    name: "Uniswap",
    description: "Swap tokens and provide liquidity",
    url: "https://app.uniswap.org",
    icon: Chrome,
    category: "DeFi",
  },
  {
    id: "2",
    name: "OpenSea",
    description: "NFT marketplace",
    url: "https://opensea.io",
    icon: Globe,
    category: "NFT",
  },
  {
    id: "3",
    name: "Aave",
    description: "Lending and borrowing protocol",
    url: "https://aave.com",
    icon: Link,
    category: "DeFi",
  },
  {
    id: "4",
    name: "Compound",
    description: "Algorithmic money markets",
    url: "https://compound.finance",
    icon: Link,
    category: "DeFi",
  },
];
