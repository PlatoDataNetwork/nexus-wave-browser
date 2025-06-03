
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
    "Decentraland", "dYdX", "Ethereum", "MakerDAO", "MarginFI", "Metamask", "MetaMask",
    "Nexus Browser", "OpenSea", "Optimism", "Polkadot", "Polygon", "Solana",
    "Tezos", "Uniswap"
  ];
  
  console.log("Excluded items:", excludedItems);
  
  // Process bookmarks without any special handling
  const processedBookmarks = bookmarks
    .filter(bookmark => {
      const isExcluded = excludedItems.includes(bookmark.title);
      console.log(`Bookmark ${bookmark.title}: excluded = ${isExcluded}`);
      return !isExcluded;
    })
    .map(bookmark => {
      console.log(`Processing original bookmark: ${bookmark.title} with URL: ${bookmark.url}`);
      
      const updatedBookmark = {
        ...bookmark,
        color: getColorFromName(bookmark.title),
        url: bookmark.url
      };
      
      console.log(`Final processed bookmark: ${updatedBookmark.title} with URL: ${updatedBookmark.url}`);
      return updatedBookmark;
    });
  
  const combinedBookmarks: EnhancedBookmark[] = [
    // Include the processed bookmarks
    ...processedBookmarks,
    // Add ArcMolten to favorites
    {
      id: "arc-molten",
      title: "ArcMolten",
      url: "https://moltenarcsc1.vercel.app",
      color: getColorFromName("ArcMolten")
    },
    // Add MoltenArc to favorites
    {
      id: "molten-arc",
      title: "MoltenArc",
      url: "https://moltenarcsc2.vercel.app/",
      color: getColorFromName("MoltenArc")
    },
    // Add Gtrade to favorites with correct URL
    {
      id: "gtrade",
      title: "Gtrade",
      url: "https://sol.gains.trade",
      color: getColorFromName("Gtrade")
    },
    {
      id: "alpaca",
      title: "Alpaca",
      url: "https://alpacanetwork.ai",
      color: getColorFromName("Alpaca")
    },
    {
      id: "ark",
      title: "ARK",
      url: "https://ark.platodata.xyz",
      color: getColorFromName("ARK")
    },
    {
      id: "plato-defix",
      title: "Plato DefIX",
      url: "https://web3-vercel-nexus.vercel.app/",
      color: getColorFromName("Plato DefIX")
    },
    {
      id: "plato-data-network",
      title: "Plato Data Network",
      url: "https://platodata.ai",
      color: getColorFromName("Plato Data Network")
    },
    {
      id: "circle-nexus",
      title: "Circle Nexus",
      url: "https://nexus-carbon-tour.vercel.app",
      color: getColorFromName("Circle Nexus")
    },
    {
      id: "platoai-code-nexus",
      title: "PlatoAI Code Nexus",
      url: "https://platoai-code-forge.vercel.app/",
      color: getColorFromName("PlatoAI Code Nexus")
    },
    {
      id: "cut",
      title: "CUT",
      url: "https://cut.platodata.xyz",
      color: getColorFromName("CUT")
    },
    // Include top protocols, excluding the specified ones
    ...topProtocols
      .filter(protocol => {
        const isExcluded = excludedItems.includes(protocol.name);
        console.log(`Protocol ${protocol.name}: excluded = ${isExcluded}`);
        return !isExcluded;
      })
      .map(protocol => ({
        id: protocol.id,
        title: protocol.name,
        url: protocol.url,
        color: protocol.color || getColorFromName(protocol.name)
      }))
  ];

  const finalBookmarks = combinedBookmarks
    .sort((a, b) => 
      a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    );

  console.log("🔍 Final bookmarks array:", finalBookmarks);
  console.log("🔍 Checking for Metamask in final array:", finalBookmarks.find(b => b.title.toLowerCase().includes('metamask')));
  
  return finalBookmarks;
};
