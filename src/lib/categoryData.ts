
import { 
  Airplay, Ban, Database, FlaskRound, Hash, Cannabis, 
  Leaf, FileText, Code, HandCoins, Bitcoin, Shield, ShoppingBag, 
  School, Bolt, Gamepad, TrendingUp, Atom, Cpu, Music, 
  Image, CreditCard, Briefcase, Building, Truck,
  Sun, Rocket, 
  // New icons for missing categories
  Globe, Zap, BarChart3, Lightbulb, Microscope, 
  DollarSign, Percent, MonitorSmartphone, Network, PiggyBank,
  ChartBar, CircuitBoard, Dna, Radar, BookOpen,
  Recycle, TestTube, Factory, Laptop, 
  Scale, WifiOff, Package, CloudRain, Shuffle,
  Award, LineChart, PenTool, HeartPulse
} from "lucide-react";
import Brain from '@/components/Search/Icons/Brain';
import Wheelchair from '@/components/Search/Icons/Wheelchair';
import Stem from '@/components/Search/Icons/Stem';

export interface CategoryPrompt {
  id: string;
  text: string;
}

export interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  prompts: CategoryPrompt[];
}

export const categories: Category[] = [
  { 
    id: "aerospace", 
    name: "Aerospace", 
    icon: Rocket,
    color: "bg-purple-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `aerospace-${i+1}`, 
      text: `Describe the latest advancements in aerospace technology` 
    }))
  },
  { 
    id: "ai", 
    name: "AI", 
    icon: Brain,
    color: "bg-blue-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `ai-${i+1}`, 
      text: `Explain key concepts in artificial intelligence research` 
    }))
  },
  { 
    id: "ar-vr", 
    name: "AR/VR", 
    icon: Airplay,
    color: "bg-green-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `ar-vr-${i+1}`, 
      text: `What are the most innovative AR/VR applications in industries?` 
    }))
  },
  { 
    id: "autism", 
    name: "Autism", 
    icon: Wheelchair,
    color: "bg-blue-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `autism-${i+1}`, 
      text: `Describe strategies for supporting individuals with autism` 
    }))
  },
  { 
    id: "automotive", 
    name: "Automotive", 
    icon: Truck,
    color: "bg-red-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `automotive-${i+1}`, 
      text: `What are the latest developments in automotive technology?` 
    }))
  },
  { 
    id: "aviation", 
    name: "Aviation", 
    icon: Airplay, // Changed from Airplane to Airplay
    color: "bg-sky-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `aviation-${i+1}`, 
      text: `Explain key innovations in modern aviation` 
    }))
  },
  { 
    id: "banking", 
    name: "Banking", 
    icon: Ban, // Changed from Bank to Ban
    color: "bg-emerald-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `banking-${i+1}`, 
      text: `What are trends shaping the future of banking?` 
    }))
  },
  { 
    id: "big-data", 
    name: "Big Data", 
    icon: Database,
    color: "bg-orange-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `big-data-${i+1}`, 
      text: `Explain ways big data is transforming business analytics` 
    }))
  },
  { 
    id: "biotech", 
    name: "Biotech", 
    icon: FlaskRound,
    color: "bg-teal-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `biotech-${i+1}`, 
      text: `What are breakthrough innovations in biotechnology?` 
    }))
  },
  { 
    id: "blockchain", 
    name: "Blockchain", 
    icon: Hash,
    color: "bg-blue-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `blockchain-${i+1}`, 
      text: `Explain practical applications of blockchain technology` 
    }))
  },
  { 
    id: "cannabis", 
    name: "Cannabis", 
    icon: Cannabis,
    color: "bg-green-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `cannabis-${i+1}`, 
      text: `Describe medical applications of cannabis` 
    }))
  },
  { 
    id: "carbon", 
    name: "Carbon", 
    icon: Leaf,
    color: "bg-lime-700", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `carbon-${i+1}`, 
      text: `What are carbon capture technologies in development?` 
    }))
  },
  // New categories
  { 
    id: "cleantech", 
    name: "Cleantech", 
    icon: Recycle,
    color: "bg-green-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `cleantech-${i+1}`, 
      text: `What are the latest innovations in clean technology?` 
    }))
  },
  { 
    id: "clinical-trials", 
    name: "Clinical Trials", 
    icon: TestTube,
    color: "bg-indigo-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `clinical-trials-${i+1}`, 
      text: `Explain recent breakthroughs in clinical trials` 
    }))
  },
  { 
    id: "code", 
    name: "Code", 
    icon: Code,
    color: "bg-gray-700", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `code-${i+1}`, 
      text: `What are the most in-demand programming languages?` 
    }))
  },
  { 
    id: "crowdfunding", 
    name: "Crowdfunding", 
    icon: HandCoins,
    color: "bg-yellow-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `crowdfunding-${i+1}`, 
      text: `How is crowdfunding transforming entrepreneurship?` 
    }))
  },
  { 
    id: "crypto", 
    name: "Crypto", 
    icon: Bitcoin,
    color: "bg-amber-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `crypto-${i+1}`, 
      text: `Explain concepts in cryptocurrency technology` 
    }))
  },
  { 
    id: "cyber-security", 
    name: "Cyber Security", 
    icon: Shield,
    color: "bg-red-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `cyber-security-${i+1}`, 
      text: `What are emerging threats in cybersecurity?` 
    }))
  },
  { 
    id: "defense", 
    name: "Defense", 
    icon: Shield,
    color: "bg-slate-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `defense-${i+1}`, 
      text: `Describe advancements in defense technology` 
    }))
  },
  { 
    id: "ecommerce", 
    name: "Ecommerce", 
    icon: ShoppingBag,
    color: "bg-pink-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `ecommerce-${i+1}`, 
      text: `Describe innovations changing ecommerce` 
    }))
  },
  { 
    id: "edtech", 
    name: "EdTech", 
    icon: School,
    color: "bg-indigo-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `edtech-${i+1}`, 
      text: `What are ways technology is transforming education?` 
    }))
  },
  { 
    id: "energy", 
    name: "Energy", 
    icon: Bolt,
    color: "bg-yellow-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `energy-${i+1}`, 
      text: `Explain innovations in renewable energy technology` 
    }))
  },
  { 
    id: "esg", 
    name: "ESG", 
    icon: Leaf,
    color: "bg-emerald-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `esg-${i+1}`, 
      text: `How are companies implementing ESG initiatives?` 
    }))
  },
  { 
    id: "esports", 
    name: "Esports", 
    icon: Gamepad,
    color: "bg-purple-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `esports-${i+1}`, 
      text: `What's driving the growth of the esports industry?` 
    }))
  },
  { 
    id: "finance", 
    name: "Finance", 
    icon: DollarSign,
    color: "bg-green-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `finance-${i+1}`, 
      text: `Explain modern financial technology trends` 
    }))
  },
  { 
    id: "financefeeds", 
    name: "FinanceFeeds", 
    icon: ChartBar,
    color: "bg-blue-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `financefeeds-${i+1}`, 
      text: `What are key financial news sources for investors?` 
    }))
  },
  { 
    id: "fintech", 
    name: "Fintech", 
    icon: CreditCard,
    color: "bg-indigo-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `fintech-${i+1}`, 
      text: `How is fintech disrupting traditional banking?` 
    }))
  },
  { 
    id: "forex", 
    name: "Forex", 
    icon: BarChart3,
    color: "bg-blue-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `forex-${i+1}`, 
      text: `Explain key concepts in forex trading` 
    }))
  },
  { 
    id: "gaming", 
    name: "Gaming", 
    icon: Gamepad,
    color: "bg-violet-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `gaming-${i+1}`, 
      text: `What are trends shaping the future of gaming?` 
    }))
  },
  { 
    id: "hydrogen", 
    name: "Hydrogen", 
    icon: Atom,
    color: "bg-sky-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `hydrogen-${i+1}`, 
      text: `Explain advancements in hydrogen fuel technology` 
    }))
  },
  { 
    id: "iot", 
    name: "IOT", 
    icon: Network,
    color: "bg-cyan-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `iot-${i+1}`, 
      text: `How is the Internet of Things transforming industries?` 
    }))
  },
  { 
    id: "medical-devices", 
    name: "Medical Devices", 
    icon: HeartPulse,
    color: "bg-red-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `medical-devices-${i+1}`, 
      text: `What are breakthrough medical device innovations?` 
    }))
  },
  { 
    id: "music", 
    name: "Music", 
    icon: Music,
    color: "bg-pink-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `music-${i+1}`, 
      text: `How is technology changing music creation and distribution?` 
    }))
  },
  { 
    id: "nano-technology", 
    name: "Nano Technology", 
    icon: Microscope,
    color: "bg-blue-700", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `nano-technology-${i+1}`, 
      text: `Explain recent advances in nanotechnology` 
    }))
  },
  { 
    id: "nfts", 
    name: "NFTs", 
    icon: Image,
    color: "bg-purple-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `nfts-${i+1}`, 
      text: `What's the future of NFTs in digital ownership?` 
    }))
  },
  { 
    id: "patents", 
    name: "Patents", 
    icon: FileText,
    color: "bg-amber-700", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `patents-${i+1}`, 
      text: `How does the patent system impact innovation?` 
    }))
  },
  { 
    id: "payments", 
    name: "Payments", 
    icon: CreditCard,
    color: "bg-green-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `payments-${i+1}`, 
      text: `What are emerging payment technologies?` 
    }))
  },
  { 
    id: "private-equity", 
    name: "Private Equity", 
    icon: Briefcase,
    color: "bg-blue-800", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `private-equity-${i+1}`, 
      text: `Explain how private equity firms operate` 
    }))
  },
  { 
    id: "psychedelics", 
    name: "Psychedelics", 
    icon: FlaskRound,
    color: "bg-purple-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `psychedelics-${i+1}`, 
      text: `What research is being done on psychedelics in medicine?` 
    }))
  },
  { 
    id: "quantum", 
    name: "Quantum", 
    icon: Atom,
    color: "bg-blue-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `quantum-${i+1}`, 
      text: `Explain advancements in quantum computing` 
    }))
  },
  { 
    id: "real-estate", 
    name: "Real Estate", 
    icon: Building,
    color: "bg-amber-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `real-estate-${i+1}`, 
      text: `How is technology transforming the real estate industry?` 
    }))
  },
  { 
    id: "saas", 
    name: "SaaS", 
    icon: Laptop,
    color: "bg-sky-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `saas-${i+1}`, 
      text: `What are trends in the SaaS industry?` 
    }))
  },
  { 
    id: "semiconductor", 
    name: "Semiconductor", 
    icon: CircuitBoard,
    color: "bg-cyan-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `semiconductor-${i+1}`, 
      text: `Explain innovations in semiconductor technology` 
    }))
  },
  { 
    id: "seo", 
    name: "SEO", 
    icon: Globe,
    color: "bg-indigo-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `seo-${i+1}`, 
      text: `What are current best practices in search engine optimization?` 
    }))
  },
  { 
    id: "solar", 
    name: "Solar", 
    icon: Sun, 
    color: "bg-yellow-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `solar-${i+1}`, 
      text: `What are innovations in solar energy technology?` 
    }))
  },
  { 
    id: "spacs", 
    name: "SPACS", 
    icon: TrendingUp,
    color: "bg-blue-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `spacs-${i+1}`, 
      text: `Explain how SPACs work in the financial market` 
    }))
  },
  { 
    id: "startups", 
    name: "Startups", 
    icon: Lightbulb,
    color: "bg-yellow-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `startups-${i+1}`, 
      text: `What makes startups successful in today's market?` 
    }))
  },
  { 
    id: "stem-cell", 
    name: "Stem Cell", 
    icon: Stem,
    color: "bg-green-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `stem-cell-${i+1}`, 
      text: `Explain advances in stem cell research and therapy` 
    }))
  },
  { 
    id: "supply-chain", 
    name: "Supply Chain", 
    icon: Package,
    color: "bg-blue-400", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `supply-chain-${i+1}`, 
      text: `How is technology improving supply chain management?` 
    }))
  },
  { 
    id: "trading", 
    name: "Trading", 
    icon: LineChart,
    color: "bg-green-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `trading-${i+1}`, 
      text: `What are emerging trends in algorithmic trading?` 
    }))
  },
  { 
    id: "venture-capital", 
    name: "Venture Capital", 
    icon: PiggyBank,
    color: "bg-purple-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `venture-capital-${i+1}`, 
      text: `How do venture capital firms evaluate startups?` 
    }))
  },
  { 
    id: "waste-management", 
    name: "Waste Management", 
    icon: Recycle,
    color: "bg-green-700", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `waste-management-${i+1}`, 
      text: `What are innovative approaches to waste management?` 
    }))
  },
  { 
    id: "web3", 
    name: "Web3", 
    icon: Globe,
    color: "bg-indigo-600", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `web3-${i+1}`, 
      text: `Explain the core concepts of Web3 and decentralization` 
    }))
  },
];
