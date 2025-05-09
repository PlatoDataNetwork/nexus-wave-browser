
import React from "react";
import { Extension } from "@/lib/extensionsData";

interface ExtensionStatsProps {
  extensions: Extension[];
}

const ExtensionStats: React.FC<ExtensionStatsProps> = ({ extensions }) => {
  // Calculate statistics data from extensions passed in props
  const statsData = [
    { 
      title: "Available", 
      value: extensions.length, 
      bgColor: "bg-[#2a1e48]" 
    },
    { 
      title: "Installed", 
      value: extensions.filter(ext => ext.installed).length, 
      bgColor: "bg-[#1e2a48]" 
    },
    { 
      title: "Web3 & Crypto", 
      value: extensions.filter(ext => 
        ext.category === "Web3 & Crypto" || 
        ext.category === "Crypto" || 
        ext.category === "Web3"
      ).length, 
      bgColor: "bg-[#3a1e38]" 
    },
    { 
      title: "Privacy & Security", 
      value: extensions.filter(ext => 
        ext.category === "Privacy & Security" || 
        ext.category === "Security"
      ).length, 
      bgColor: "bg-[#1e3a38]" 
    },
    { 
      title: "Generative AI", 
      value: extensions.filter(ext => 
        ext.category === "AI" || 
        ext.category === "AI Tools"
      ).length, 
      bgColor: "bg-[#3a1e48]" 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-lg p-6`}>
          <div className="text-sm font-medium mb-2">{stat.title}</div>
          <div className="text-4xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
};

export default ExtensionStats;
