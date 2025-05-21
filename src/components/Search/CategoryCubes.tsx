
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

// Define the category data structure with name and corresponding icon
export interface CategoryItem {
  name: string;
  icon: string;
  slug: string;
  color: string;
}

// Create an array of categories with their respective icons
export const categories: CategoryItem[] = [
  { name: "Aerospace", icon: "Rocket", slug: "aerospace", color: "bg-nexus-purple" },
  { name: "AI", icon: "Brain", slug: "ai", color: "bg-nexus-purple" },
  { name: "AR/VR", icon: "Cube", slug: "ar-vr", color: "bg-nexus-purple" },
  { name: "Autism", icon: "Smile", slug: "autism", color: "bg-nexus-purple" },
  { name: "Automotive", icon: "Car", slug: "automotive", color: "bg-nexus-purple" },
  { name: "Aviation", icon: "Plane", slug: "aviation", color: "bg-nexus-purple" },
  { name: "Banking", icon: "Banknote", slug: "banking", color: "bg-nexus-purple" },
  { name: "Big Data", icon: "Database", slug: "big-data", color: "bg-nexus-purple" },
  { name: "Biotech", icon: "Dna", slug: "biotech", color: "bg-nexus-purple" },
  { name: "Blockchain", icon: "Box", slug: "blockchain", color: "bg-nexus-purple" },
  { name: "Cannabis", icon: "Leaf", slug: "cannabis", color: "bg-nexus-purple" },
  { name: "Carbon", icon: "LeafyGreen", slug: "carbon", color: "bg-nexus-purple" },
  { name: "Cleantech", icon: "Leaf", slug: "cleantech", color: "bg-nexus-purple" },
  { name: "Clinical Trials", icon: "FlaskConical", slug: "clinical-trials", color: "bg-nexus-purple" },
  { name: "Code", icon: "Code", slug: "code", color: "bg-nexus-purple" },
  { name: "Crowdfunding", icon: "HandCoins", slug: "crowdfunding", color: "bg-nexus-purple" },
  { name: "Crypto", icon: "Bitcoin", slug: "crypto", color: "bg-nexus-purple" },
  { name: "Cyber Security", icon: "Shield", slug: "cyber-security", color: "bg-nexus-purple" },
  { name: "Defense", icon: "Shield", slug: "defense", color: "bg-nexus-purple" },
  { name: "Ecommerce", icon: "ShoppingBag", slug: "ecommerce", color: "bg-nexus-purple" },
  { name: "EdTech", icon: "BookOpen", slug: "edtech", color: "bg-nexus-purple" },
  { name: "Energy", icon: "Bolt", slug: "energy", color: "bg-nexus-purple" },
  { name: "ESG", icon: "Award", slug: "esg", color: "bg-nexus-purple" },
  { name: "Esports", icon: "Gamepad2", slug: "esports", color: "bg-nexus-purple" },
  { name: "Finance", icon: "DollarSign", slug: "finance", color: "bg-nexus-purple" },
  { name: "FinanceFeeds", icon: "TrendingUp", slug: "finance-feeds", color: "bg-nexus-purple" },
  { name: "Fintech", icon: "CreditCard", slug: "fintech", color: "bg-nexus-purple" },
  { name: "Forex", icon: "DollarSign", slug: "forex", color: "bg-nexus-purple" },
  { name: "Gaming", icon: "Gamepad2", slug: "gaming", color: "bg-nexus-purple" },
  { name: "Hydrogen", icon: "Droplet", slug: "hydrogen", color: "bg-nexus-purple" },
  { name: "IOT", icon: "Cpu", slug: "iot", color: "bg-nexus-purple" },
  { name: "Medical Devices", icon: "Microscope", slug: "medical-devices", color: "bg-nexus-purple" },
  { name: "Music", icon: "Music", slug: "music", color: "bg-nexus-purple" },
  { name: "Nano Technology", icon: "Atom", slug: "nano-technology", color: "bg-nexus-purple" },
  { name: "NFTs", icon: "Image", slug: "nfts", color: "bg-nexus-purple" },
  { name: "Patents", icon: "FileText", slug: "patents", color: "bg-nexus-purple" },
  { name: "Payments", icon: "CreditCard", slug: "payments", color: "bg-nexus-purple" },
  { name: "Private Equity", icon: "Briefcase", slug: "private-equity", color: "bg-nexus-purple" },
  { name: "Psychedelics", icon: "Flask", slug: "psychedelics", color: "bg-nexus-purple" },
  { name: "Quantum", icon: "Atom", slug: "quantum", color: "bg-nexus-purple" },
  { name: "Real Estate", icon: "Home", slug: "real-estate", color: "bg-nexus-purple" },
  { name: "SaaS", icon: "Cloud", slug: "saas", color: "bg-nexus-purple" },
  { name: "Semiconductor", icon: "Cpu", slug: "semiconductor", color: "bg-nexus-purple" },
  { name: "SEO", icon: "Search", slug: "seo", color: "bg-nexus-purple" },
  { name: "Solar", icon: "Sun", slug: "solar", color: "bg-nexus-purple" },
  { name: "SPACS", icon: "CircleDollarSign", slug: "spacs", color: "bg-nexus-purple" },
  { name: "Startups", icon: "Rocket", slug: "startups", color: "bg-nexus-purple" },
  { name: "Stem Cell", icon: "HeartPulse", slug: "stem-cell", color: "bg-nexus-purple" },
  { name: "Supply Chain", icon: "Truck", slug: "supply-chain", color: "bg-nexus-purple" },
  { name: "Trading", icon: "TrendingUp", slug: "trading", color: "bg-nexus-purple" },
  { name: "Venture Capital", icon: "Briefcase", slug: "venture-capital", color: "bg-nexus-purple" },
  { name: "Waste Management", icon: "Trash", slug: "waste-management", color: "bg-nexus-purple" },
  { name: "Web3", icon: "Globe", slug: "web3", color: "bg-nexus-purple" },
];

interface CategoryCubesProps {
  onCategorySelect: (category: CategoryItem) => void;
}

const CategoryCube: React.FC<{ category: CategoryItem }> = ({ category }) => {
  const navigate = useNavigate();
  
  // Get the actual icon component from lucide-react
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;
  
  return (
    <Card 
      className={cn("cursor-pointer transition-all hover:scale-105 hover:shadow-md", category.color)}
      onClick={() => navigate(`/search/category/${category.slug}`)}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center h-full">
        {IconComponent && <IconComponent className="h-8 w-8 text-white mb-2" />}
        <span className="text-sm font-medium text-white text-center">{category.name}</span>
      </CardContent>
    </Card>
  );
};

const CategoryCubes: React.FC<CategoryCubesProps> = ({ onCategorySelect }) => {
  return (
    <div className="p-6 pb-20 w-full">
      <h2 className="text-2xl font-bold mb-6 text-center">Browse by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category) => (
          <CategoryCube key={category.slug} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryCubes;
