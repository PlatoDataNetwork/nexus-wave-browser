
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
  },
  {
    id: "2",
    title: "OpenSea",
    url: "https://opensea.io",
    icon: Globe,
  },
  {
    id: "5",
    title: "Aave",
    url: "https://aave.com",
    icon: Link,
  },
  {
    id: "6",
    title: "Magic Eden",
    url: "https://magiceden.io",
    icon: Globe,
  },
  {
    id: "7",
    title: "Lumia",
    url: "https://lumia.org",
    icon: Globe,
  },
  {
    id: "8",
    title: "gTrade",
    url: "https://sol.gains.trade/",
    icon: Globe,
  },
  {
    id: "9",
    title: "Raydium",
    url: "https://raydium.io",
    icon: Globe,
  },
  {
    id: "10",
    title: "MarginFi",
    url: "https://www.marginfi.com",
    icon: Globe,
  },
  {
    id: "11",
    title: "PlatoAi",
    url: "https://web3-vercel-nexus.vercel.app/",
    icon: Globe,
  },
  {
    id: "12",
    title: "FYNN",
    url: "https://fynn.fyntechnical.com/",
    icon: Globe,
  },
  {
    id: "13",
    title: "Atlas DEX",
    url: "https://atlasdex.finance",
    icon: Globe,
  },
  {
    id: "14",
    title: "Erratic",
    url: "https://erratic.finance",
    icon: Globe,
  },
  {
    id: "15",
    title: "Gate",
    url: "https://gate.io",
    icon: Globe,
  },
  {
    id: "16",
    title: "Honeyland",
    url: "https://honey.land",
    icon: Globe,
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
