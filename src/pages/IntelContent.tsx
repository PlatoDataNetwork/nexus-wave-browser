
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain } from "lucide-react";

const IntelContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexus-space-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-purple text-nexus-light-purple bg-nexus-purple/10">
            Coming Soon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Intel Content
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Advanced intelligence and content analysis features for the Nexus Wave ecosystem.
          </p>
        </div>

        <div className="text-center">
          <Card className="bg-nexus-card-dark border-nexus-purple/10 max-w-2xl mx-auto">
            <CardHeader>
              <Brain className="h-16 w-16 text-nexus-purple mx-auto mb-4" />
              <CardTitle>Intel Content Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400 mb-6">
                This feature is currently in development. Stay tuned for advanced content intelligence capabilities.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IntelContent;
