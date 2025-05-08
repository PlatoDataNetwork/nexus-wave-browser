
import { Globe } from "lucide-react";

export type Protocol = {
  id: string;
  name: string;
  url: string;
  color: string;
};

export const topProtocols: Protocol[] = [
  { id: "1", name: "Aave", url: "https://aave.com", color: "#B6509E" },
  { id: "2", name: "Algorand", url: "https://algorand.com", color: "#000000" },
  { id: "3", name: "Arbitrum", url: "https://arbitrum.io", color: "#2D374B" },
  { id: "4", name: "Arweave", url: "https://arweave.org", color: "#222326" },
  { id: "5", name: "Atlas DEX", url: "https://atlasdex.finance", color: "#FF7A00" },
  { id: "6", name: "Avalanche", url: "https://avax.network", color: "#E84142" },
  { id: "7", name: "Balancer", url: "https://balancer.fi", color: "#1E1E1E" },
  { id: "8", name: "Bitcoin", url: "https://bitcoin.org", color: "#F7931A" },
  { id: "9", name: "Cardano", url: "https://cardano.org", color: "#0033AD" },
  { id: "10", name: "Chainlink", url: "https://chain.link", color: "#2A5ADA" },
  { id: "11", name: "Compound", url: "https://compound.finance", color: "#00D395" },
  { id: "12", name: "Cosmos", url: "https://cosmos.network", color: "#2E3148" },
  { id: "13", name: "Curve", url: "https://curve.fi", color: "#0D0D0D" },
  { id: "14", name: "Decentraland", url: "https://decentraland.org", color: "#FF2D55" },
  { id: "15", name: "dYdX", url: "https://dydx.exchange", color: "#7E69AB" },
  { id: "16", name: "Ethereum", url: "https://ethereum.org", color: "#8B5CF6" },
  { id: "17", name: "Fantom", url: "https://fantom.foundation", color: "#1969FF" },
  { id: "18", name: "Filecoin", url: "https://filecoin.io", color: "#0090FF" },
  { id: "19", name: "Gtrade", url: "https://gtrade.exchange", color: "#5A67D8" },
  { id: "20", name: "Lumia", url: "https://lumia.xyz", color: "#6B46C1" },
  { id: "21", name: "Magic Eden", url: "https://magiceden.io", color: "#E42575" },
  { id: "22", name: "MakerDAO", url: "https://makerdao.com", color: "#1AAB9B" },
  { id: "23", name: "MarginFI", url: "https://marginfi.com", color: "#3182CE" },
  { id: "24", name: "Near", url: "https://near.org", color: "#000000" },
  { id: "25", name: "Optimism", url: "https://optimism.io", color: "#FF0420" },
  { id: "26", name: "Polkadot", url: "https://polkadot.network", color: "#E6007A" },
  { id: "27", name: "Polygon", url: "https://polygon.technology", color: "#8247E5" },
  { id: "28", name: "Solana", url: "https://solana.com", color: "#00FFA3" },
  { id: "29", name: "Stellar", url: "https://stellar.org", color: "#000000" },
  { id: "30", name: "SushiSwap", url: "https://sushi.com", color: "#F25A91" },
  { id: "31", name: "Synthetix", url: "https://synthetix.io", color: "#00D1FF" },
  { id: "32", name: "Tezos", url: "https://tezos.com", color: "#2C7DF7" },
  { id: "33", name: "The Graph", url: "https://thegraph.com", color: "#6747ED" },
  { id: "34", name: "Uniswap", url: "https://uniswap.org", color: "#FF007A" },
  { id: "35", name: "Yearn", url: "https://yearn.finance", color: "#0657F9" }
];
