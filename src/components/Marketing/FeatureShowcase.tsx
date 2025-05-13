
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureShowcase: React.FC<{
  features: FeatureProps[];
  title?: string;
  subtitle?: string;
}> = ({ features, title, subtitle }) => {
  return (
    <div className="w-full">
      {(title || subtitle) && (
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
          {subtitle && <p className="text-gray-300 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          
          return (
            <Card key={index} className="bg-nexus-card-dark border-nexus-purple/10 hover:border-nexus-purple/30 transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-nexus-purple/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-nexus-purple" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-400">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FeatureShowcase;
