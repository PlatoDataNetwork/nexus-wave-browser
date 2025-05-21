
import { 
  Airplay, Ban, Database, FlaskRound, Hash, Cannabis, 
  Leaf, FileText, Code, HandCoins, Bitcoin, Shield, ShoppingBag, 
  School, Bolt, Gamepad, TrendingUp, Atom, Cpu, Music, 
  Image, CreditCard, Briefcase, Building, Truck,
  Sun, Rocket
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
  // Add more categories similarly
  // I'll add a few more but in practice you'd add all of them
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
    id: "solar", 
    name: "Solar", 
    icon: Sun, // Changed from SolarPanel to Sun
    color: "bg-yellow-500", 
    prompts: Array.from({ length: 30 }, (_, i) => ({ 
      id: `solar-${i+1}`, 
      text: `What are innovations in solar energy technology?` 
    }))
  },
  // Add remaining categories following the same pattern
];
