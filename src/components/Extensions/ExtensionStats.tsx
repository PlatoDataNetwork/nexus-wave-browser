
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Star, Shield } from "lucide-react";
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
      icon: Package, 
      color: "bg-gradient-to-br from-purple-500/20 to-purple-700/20" 
    },
    { 
      title: "Installed", 
      value: extensions.filter(ext => ext.installed).length, 
      icon: ShoppingCart, 
      color: "bg-gradient-to-br from-blue-500/20 to-blue-700/20" 
    },
    { 
      title: "Featured", 
      value: extensions.filter(ext => ext.featured).length, 
      icon: Star, 
      color: "bg-gradient-to-br from-pink-500/20 to-pink-700/20" 
    },
    { 
      title: "Security", 
      value: extensions.filter(ext => ext.category === "Security").length, 
      icon: Shield, 
      color: "bg-gradient-to-br from-emerald-500/20 to-emerald-700/20" 
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat, index) => (
        <Card key={index} className={stat.color}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="absolute top-4 right-4 bg-background/80 p-2 rounded-full">
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExtensionStats;
