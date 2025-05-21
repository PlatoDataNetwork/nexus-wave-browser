
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
  { name: "Aerospace", icon: "Rocket", slug: "aerospace", color: "bg-blue-500" },
  { name: "AI", icon: "Brain", slug: "ai", color: "bg-purple-500" },
  { name: "AR/VR", icon: "Cube", slug: "ar-vr", color: "bg-indigo-500" },
  { name: "Autism", icon: "Smile", slug: "autism", color: "bg-pink-500" },
  { name: "Automotive", icon: "Car", slug: "automotive", color: "bg-red-500" },
  { name: "Aviation", icon: "Plane", slug: "aviation", color: "bg-sky-500" },
  { name: "Banking", icon: "Banknote", slug: "banking", color: "bg-green-500" },
  { name: "Big Data", icon: "Database", slug: "big-data", color: "bg-emerald-500" },
  { name: "Biotech", icon: "Dna", slug: "biotech", color: "bg-teal-500" },
  { name: "Blockchain", icon: "Box", slug: "blockchain", color: "bg-cyan-500" },
  { name: "Cannabis", icon: "Leaf", slug: "cannabis", color: "bg-lime-500" },
  { name: "Carbon", icon: "LeafyGreen", slug: "carbon", color: "bg-green-600" },
  { name: "Cleantech", icon: "Leaf", slug: "cleantech", color: "bg-teal-600" },
  { name: "Clinical Trials", icon: "FlaskConical", slug: "clinical-trials", color: "bg-cyan-600" },
  { name: "Code", icon: "Code", slug: "code", color: "bg-violet-500" },
  { name: "Crowdfunding", icon: "HandCoins", slug: "crowdfunding", color: "bg-amber-500" },
  { name: "Crypto", icon: "Bitcoin", slug: "crypto", color: "bg-orange-500" },
  { name: "Cyber Security", icon: "Shield", slug: "cyber-security", color: "bg-red-600" },
  { name: "Defense", icon: "Shield", slug: "defense", color: "bg-stone-500" },
  { name: "Ecommerce", icon: "ShoppingBag", slug: "ecommerce", color: "bg-emerald-600" },
  { name: "EdTech", icon: "BookOpen", slug: "edtech", color: "bg-blue-600" },
  { name: "Energy", icon: "Bolt", slug: "energy", color: "bg-yellow-500" },
  { name: "ESG", icon: "Award", slug: "esg", color: "bg-green-700" },
  { name: "Esports", icon: "Gamepad2", slug: "esports", color: "bg-purple-600" },
  { name: "Finance", icon: "DollarSign", slug: "finance", color: "bg-green-800" },
  { name: "FinanceFeeds", icon: "TrendingUp", slug: "finance-feeds", color: "bg-blue-700" },
  { name: "Fintech", icon: "CreditCard", slug: "fintech", color: "bg-indigo-600" },
  { name: "Forex", icon: "DollarSign", slug: "forex", color: "bg-violet-600" },
  { name: "Gaming", icon: "Gamepad2", slug: "gaming", color: "bg-fuchsia-500" },
  { name: "Hydrogen", icon: "Droplet", slug: "hydrogen", color: "bg-sky-600" },
  { name: "IOT", icon: "Cpu", slug: "iot", color: "bg-slate-500" },
  { name: "Medical Devices", icon: "Microscope", slug: "medical-devices", color: "bg-pink-600" },
  { name: "Music", icon: "Music", slug: "music", color: "bg-violet-700" },
  { name: "Nano Technology", icon: "Atom", slug: "nano-technology", color: "bg-indigo-700" },
  { name: "NFTs", icon: "Image", slug: "nfts", color: "bg-pink-700" },
  { name: "Patents", icon: "FileText", slug: "patents", color: "bg-neutral-500" },
  { name: "Payments", icon: "CreditCard", slug: "payments", color: "bg-emerald-700" },
  { name: "Private Equity", icon: "Briefcase", slug: "private-equity", color: "bg-blue-800" },
  { name: "Psychedelics", icon: "Flask", slug: "psychedelics", color: "bg-purple-700" },
  { name: "Quantum", icon: "Atom", slug: "quantum", color: "bg-cyan-700" },
  { name: "Real Estate", icon: "Home", slug: "real-estate", color: "bg-amber-600" },
  { name: "SaaS", icon: "Cloud", slug: "saas", color: "bg-blue-600" },
  { name: "Semiconductor", icon: "Cpu", slug: "semiconductor", color: "bg-gray-500" },
  { name: "SEO", icon: "Search", slug: "seo", color: "bg-orange-600" },
  { name: "Solar", icon: "Sun", slug: "solar", color: "bg-yellow-600" },
  { name: "SPACS", icon: "CircleDollarSign", slug: "spacs", color: "bg-amber-700" },
  { name: "Startups", icon: "Rocket", slug: "startups", color: "bg-indigo-800" },
  { name: "Stem Cell", icon: "HeartPulse", slug: "stem-cell", color: "bg-teal-700" },
  { name: "Supply Chain", icon: "Truck", slug: "supply-chain", color: "bg-zinc-500" },
  { name: "Trading", icon: "TrendingUp", slug: "trading", color: "bg-green-600" },
  { name: "Venture Capital", icon: "Briefcase", slug: "venture-capital", color: "bg-indigo-600" },
  { name: "Waste Management", icon: "Trash", slug: "waste-management", color: "bg-amber-800" },
  { name: "Web3", icon: "Globe", slug: "web3", color: "bg-purple-800" },
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
