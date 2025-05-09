
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { popularDApps } from "@/lib/dummyData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface DAppSectionProps {
  onNavigate: (url: string) => void;
}

const DAppSection: React.FC<DAppSectionProps> = ({ onNavigate }) => {
  const [visibleDApps, setVisibleDApps] = React.useState(popularDApps);

  const handleClose = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleDApps(visibleDApps.filter(dapp => dapp.id !== id));
    toast.info("DApp removed from view");
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Popular DApps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 nexus-scrollbar overflow-y-auto" style={{ maxHeight: "260px" }}>
        {visibleDApps.map((dapp) => (
          <div 
            key={dapp.id}
            className="relative p-3 bg-secondary/30 rounded-md border border-border hover:border-nexus-purple/50 transition-all cursor-pointer"
            onClick={() => onNavigate(dapp.url)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => handleClose(dapp.id, e)}
              className="absolute -top-2 -right-2 bg-nexus-purple text-white rounded-full p-1 shadow-md hover:bg-nexus-light-purple z-10"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center">
                  {dapp.icon && <dapp.icon className="h-5 w-5 text-nexus-purple" />}
                </div>
                <div>
                  <h3 className="font-medium">{dapp.name}</h3>
                  <p className="text-xs text-muted-foreground">{dapp.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-nexus-purple/10 text-nexus-purple border-nexus-purple/20">
                {dapp.category}
              </Badge>
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-xs text-nexus-purple hover:text-nexus-light-purple hover:bg-nexus-purple/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate(dapp.url);
                }}
              >
                Open DApp
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default DAppSection;
