
import React, { useEffect, useState } from "react";
import { Extension } from "@/lib/extensionsData";

interface ExtensionStatsProps {
  extensions: Extension[];
}

const ExtensionStats: React.FC<ExtensionStatsProps> = ({ extensions }) => {
  // Use state to store calculated stats
  const [statsData, setStatsData] = useState([
    { title: "Available", value: 0, bgColor: "bg-[#2a1e48]" },
    { title: "Installed", value: 0, bgColor: "bg-[#1e2a48]" },
    { title: "Web3 & Crypto", value: 0, bgColor: "bg-[#3a1e38]" },
    { title: "Privacy & Security", value: 0, bgColor: "bg-[#1e3a38]" },
    { title: "Generative AI", value: 0, bgColor: "bg-[#3a1e48]" }
  ]);

  // Calculate stats whenever extensions prop changes
  useEffect(() => {
    if (!extensions || extensions.length === 0) return;
    
    console.log("Calculating stats from", extensions.length, "extensions");
    
    // Count Web3 & Crypto extensions
    const web3Extensions = extensions.filter(ext => 
      ext.category === "Web3 & Crypto" || 
      ext.category === "Crypto" || 
      ext.category === "Web3"
    );
    console.log("Web3 & Crypto extensions:", web3Extensions.length);
    
    // Calculate new stats based on the extensions data
    const newStatsData = [
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
        value: web3Extensions.length, 
        bgColor: "bg-[#3a1e38]" 
      },
      { 
        title: "Privacy & Security", 
        value: extensions.filter(ext => 
          ext.category === "Privacy & Security" || 
          ext.category === "Security" ||
          ext.category === "Privacy"
        ).length, 
        bgColor: "bg-[#1e3a38]" 
      },
      { 
        title: "Generative AI", 
        value: extensions.filter(ext => 
          ext.category === "AI" || 
          ext.category === "AI Tools" ||
          ext.category === "Generative AI"
        ).length, 
        bgColor: "bg-[#3a1e48]" 
      }
    ];
    
    setStatsData(newStatsData);
  }, [extensions]);

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
