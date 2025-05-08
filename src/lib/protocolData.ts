
import { Globe } from "lucide-react";

export type Protocol = {
  id: string;
  name: string;
  url: string;
  color: string;
};

export const topProtocols: Protocol[] = [
  { id: "1", name: "Ethereum", url: "https://ethereum.org", color: "#8B5CF6" },
  { id: "2", name: "Bitcoin", url: "https://bitcoin.org", color: "#F7931A" },
  { id: "3", name: "Uniswap", url: "https://uniswap.org", color: "#FF007A" },
  { id: "4", name: "Aave", url: "https://aave.com", color: "#B6509E" },
  { id: "5", name: "Chainlink", url: "https://chain.link", color: "#2A5ADA" },
  { id: "6", name: "Polkadot", url: "https://polkadot.network", color: "#E6007A" },
  { id: "7", name: "Polygon", url: "https://polygon.technology", color: "#8247E5" },
  { id: "8", name: "Solana", url: "https://solana.com", color: "#00FFA3" },
  { id: "9", name: "Cardano", url: "https://cardano.org", color: "#0033AD" },
  { id: "10", name: "Avalanche", url: "https://avax.network", color: "#E84142" },
  { id: "11", name: "Cosmos", url: "https://cosmos.network", color: "#2E3148" },
  { id: "12", name: "Algorand", url: "https://algorand.com", color: "#000000" },
  { id: "13", name: "Tezos", url: "https://tezos.com", color: "#2C7DF7" },
  { id: "14", name: "Stellar", url: "https://stellar.org", color: "#000000" },
  { id: "15", name: "Near", url: "https://near.org", color: "#000000" },
  { id: "16", name: "Fantom", url: "https://fantom.foundation", color: "#1969FF" },
  { id: "17", name: "The Graph", url: "https://thegraph.com", color: "#6747ED" },
  { id: "18", name: "Compound", url: "https://compound.finance", color: "#00D395" },
  { id: "19", name: "Curve", url: "https://curve.fi", color: "#0D0D0D" },
  { id: "20", name: "MakerDAO", url: "https://makerdao.com", color: "#1AAB9B" },
  { id: "21", name: "Yearn", url: "https://yearn.finance", color: "#0657F9" },
  { id: "22", name: "Synthetix", url: "https://synthetix.io", color: "#00D1FF" },
  { id: "23", name: "SushiSwap", url: "https://sushi.com", color: "#F25A91" },
  { id: "24", name: "dYdX", url: "https://dydx.exchange", color: "#7E69AB" },
  { id: "25", name: "Balancer", url: "https://balancer.fi", color: "#1E1E1E" },
  { id: "26", name: "Optimism", url: "https://optimism.io", color: "#FF0420" },
  { id: "27", name: "Arbitrum", url: "https://arbitrum.io", color: "#2D374B" },
  { id: "28", name: "Filecoin", url: "https://filecoin.io", color: "#0090FF" },
  { id: "29", name: "Arweave", url: "https://arweave.org", color: "#222326" },
  { id: "30", name: "Decentraland", url: "https://decentraland.org", color: "#FF2D55" }
];
