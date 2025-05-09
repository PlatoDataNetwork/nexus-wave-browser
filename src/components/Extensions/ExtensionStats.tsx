
import React from "react";
import { Extension } from "@/lib/extensionsData";

interface ExtensionStatsProps {
  extensions: Extension[];
}

const ExtensionStats: React.FC<ExtensionStatsProps> = ({ extensions }) => {
  // Statistics data
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
      title: "Featured", 
      value: extensions.filter(ext => ext.featured).length, 
      bgColor: "bg-[#3a1e38]" 
    },
    { 
      title: "Security", 
      value: extensions.filter(ext => ext.category === "Security").length, 
      bgColor: "bg-[#1e3a38]" 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
