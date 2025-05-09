
import React, { useEffect, useState } from "react";
import { Extension } from "@/lib/extensionsData";
import { AlertTriangle, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ExtensionStatsProps {
  extensions: Extension[];
}

const ExtensionStats: React.FC<ExtensionStatsProps> = ({ extensions }) => {
  // Use state to store calculated stats
  const [statsData, setStatsData] = useState([
    { 
      title: "Available", 
      value: 0, 
      bgColor: "bg-[#2a1e48]",
      icon: CheckCircle2,
      description: "Total extensions available",
    },
    { 
      title: "Installed", 
      value: 0, 
      bgColor: "bg-[#1e2a48]",
      icon: CheckCircle2,
      description: "Currently installed extensions",
    },
    { 
      title: "Web3 & Crypto", 
      value: 0, 
      bgColor: "bg-[#3a1e38]",
      icon: Sparkles,
      description: "Blockchain and cryptocurrency tools",
    },
    { 
      title: "Privacy & Security", 
      value: 0, 
      bgColor: "bg-[#1e3a38]",
      icon: ShieldCheck,
      description: "Tools to protect your data and privacy",
    },
    { 
      title: "Generative AI", 
      value: 0, 
      bgColor: "bg-[#3a1e48]",
      icon: Sparkles,
      description: "AI-powered content creation tools",
    }
  ]);

  // Calculate stats whenever extensions prop changes
  useEffect(() => {
    if (!extensions || extensions.length === 0) return;
    
    console.log("Calculating stats from", extensions.length, "extensions");
    
    // Identify all Web3 & Crypto extensions
    // This includes explicit crypto categories plus specific crypto extensions by ID or description
    const web3Extensions = extensions.filter(ext => {
      // Check for explicit crypto categories
      const categoryMatch = 
        ext.category === "Web3 & Crypto" || 
        ext.category === "Crypto" || 
        ext.category === "Web3";
      
      // Check specific IDs that we know are crypto-related (from ConceptualExtensions and BetaExtensions)
      const specificCryptoIds = [16, 17, 18, 19, 20, 21, 22, 23, 24];
      
      // Additional check for crypto/web3/blockchain mentions in description
      const descriptionMatch = ext.description && 
        (ext.description.toLowerCase().includes("crypto") ||
         ext.description.toLowerCase().includes("web3") ||
         ext.description.toLowerCase().includes("blockchain") ||
         ext.description.toLowerCase().includes("token") ||
         ext.description.toLowerCase().includes("defi") ||
         ext.description.toLowerCase().includes("nft"));
      
      // Check all BetaExtensions with crypto category
      const isBetaCryptoExt = ext.isBeta && ext.category === "Crypto";
      
      return categoryMatch || specificCryptoIds.includes(ext.id) || descriptionMatch || isBetaCryptoExt;
    });
    
    console.log("Web3 & Crypto extensions:", web3Extensions.length);
    console.log("Web3 extensions IDs:", web3Extensions.map(ext => ext.id));
    
    // Identify Privacy & Security extensions
    const privacySecurityExtensions = extensions.filter(ext => {
      // Check for explicit privacy/security categories
      const categoryMatch = 
        ext.category === "Privacy & Security" || 
        ext.category === "Security" ||
        ext.category === "Privacy";
      
      // Check specific secure/privacy extension IDs
      const specificIds = [6, 7, 8, 9, 10];
      
      // Check description for privacy/security terms
      const descriptionMatch = ext.description && 
        (ext.description.toLowerCase().includes("privacy") ||
         ext.description.toLowerCase().includes("security") ||
         ext.description.toLowerCase().includes("protection") ||
         ext.description.toLowerCase().includes("blocker") ||
         ext.description.toLowerCase().includes("secure") ||
         ext.description.toLowerCase().includes("shield") ||
         ext.description.toLowerCase().includes("tracking") ||
         ext.description.toLowerCase().includes("vpn") ||
         ext.description.toLowerCase().includes("encrypt"));
      
      return categoryMatch || specificIds.includes(ext.id) || descriptionMatch;
    });
    
    console.log("Privacy & Security extensions:", privacySecurityExtensions.length);
    
    // Calculate new stats based on the extensions data
    const newStatsData = [
      { 
        title: "Available", 
        value: extensions.length, 
        bgColor: "bg-[#2a1e48]",
        icon: CheckCircle2,
        description: "Total extensions available",
      },
      { 
        title: "Installed", 
        value: extensions.filter(ext => ext.installed).length, 
        bgColor: "bg-[#1e2a48]",
        icon: CheckCircle2,
        description: "Currently installed extensions",
      },
      { 
        title: "Web3 & Crypto", 
        value: web3Extensions.length, 
        bgColor: "bg-[#3a1e38]",
        icon: Sparkles,
        description: "Blockchain and cryptocurrency tools",
      },
      { 
        title: "Privacy & Security", 
        value: privacySecurityExtensions.length, 
        bgColor: "bg-[#1e3a38]",
        icon: ShieldCheck,
        description: "Tools to protect your data and privacy",
      },
      { 
        title: "Generative AI", 
        value: extensions.filter(ext => 
          ext.category === "AI" || 
          ext.category === "AI Tools" ||
          ext.category === "Generative AI" ||
          (ext.description && 
            (ext.description.toLowerCase().includes("ai") ||
             ext.description.toLowerCase().includes("artificial intelligence") ||
             ext.description.toLowerCase().includes("machine learning")))
        ).length, 
        bgColor: "bg-[#3a1e48]",
        icon: Sparkles,
        description: "AI-powered content creation tools",
      }
    ];
    
    setStatsData(newStatsData);
  }, [extensions]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div className={`${stat.bgColor} rounded-lg p-6 hover:opacity-95 transition-opacity cursor-help`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium">{stat.title}</div>
                  <Icon className="h-4 w-4 opacity-70" />
                </div>
                <div className="text-4xl font-bold">{stat.value}</div>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{stat.description}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default ExtensionStats;
