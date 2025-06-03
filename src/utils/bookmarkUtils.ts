
import { bookmarks } from "@/lib/dummyData";
import { topProtocols } from "@/lib/protocolData";

export interface EnhancedBookmark {
  id: string;
  title: string;
  url: string;
  color: string;
  icon?: React.ElementType;
}

export const getColorFromName = (name: string): string => {
  const colors = [
    "#9b87f5", "#7E69AB", "#6E59A5", "#8B5CF6", "#D946EF", "#F97316", 
    "#0EA5E9", "#1EAEDB", "#33C3F0", "#E84142", "#00D395", "#2A5ADA", 
    "#FF007A", "#F7931A", "#0033AD", "#6747ED", "#E42575", "#1AAB9B", 
    "#0657F9", "#00FFA3"
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

export const getAlphabetizedBookmarks = (): EnhancedBookmark[] => {
  const excludedItems = [
    "Alek Bot", "Algorand", "Avalanche", "Cardano", "Chainlink", "Curve",
    "Decentraland", "dYdX", "Ethereum", "MakerDAO", "MarginFI", "Metamask",
    "Nexus Browser", "OpenSea", "Optimism", "Polkadot", "Polygon", "Solana",
    "Tezos", "Uniswap"
  ];
  
  const combinedBookmarks: EnhancedBookmark[] = [
    // Include the original bookmarks with added color property
    ...bookmarks.map(bookmark => ({
      ...bookmark,
      color: getColorFromName(bookmark.title)
    })),
    // Add Alpaca to favorites
    {
      id: "alpaca",
      title: "Alpaca",
      url: "https://alpacanetwork.ai",
      color: getColorFromName("Alpaca")
    },
    // Add ARK to favorites
    {
      id: "ark",
      title: "ARK",
      url: "https://ark.platodata.xyz",
      color: getColorFromName("ARK")
    },
    // Add Plato DefIX to favorites
    {
      id: "plato-defix",
      title: "Plato DefIX",
      url: "https://web3-vercel-nexus.vercel.app/",
      color: getColorFromName("Plato DefIX")
    },
    // Add Plato Data Network to favorites
    {
      id: "plato-data-network",
      title: "Plato Data Network",
      url: "https://platodata.ai",
      color: getColorFromName("Plato Data Network")
    },
    // Add Circle Nexus to favorites
    {
      id: "circle-nexus",
      title: "Circle Nexus",
      url: "https://nexus-carbon-tour.vercel.app",
      color: getColorFromName("Circle Nexus")
    },
    // Include top protocols, excluding the specified ones
    ...topProtocols
      .filter(protocol => !excludedItems.includes(protocol.name))
      .map(protocol => ({
        id: protocol.id,
        title: protocol.name,
        url: protocol.url,
        color: protocol.color || getColorFromName(protocol.name)
      }))
  ];

  return combinedBookmarks
    .filter(bookmark => !excludedItems.includes(bookmark.title))
    .sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );
};
