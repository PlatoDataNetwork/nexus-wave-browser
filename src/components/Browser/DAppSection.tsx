
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
      <CardHeader className="pb-2 px-3 py-2">
        <CardTitle className="text-base font-medium">Popular DApps</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 nexus-scrollbar overflow-y-auto px-3" style={{ maxHeight: "260px" }}>
        {visibleDApps.map((dapp) => (
          <div 
            key={dapp.id}
            className="relative p-2 bg-secondary/30 rounded-md border border-border hover:border-nexus-purple/50 transition-all cursor-pointer"
            onClick={() => onNavigate(dapp.url)}
          >
            {/* Close Button */}
            <button
              onClick={(e) => handleClose(dapp.id, e)}
              className="absolute -top-1.5 -right-1.5 bg-nexus-purple text-white rounded-full p-0.5 shadow-md hover:bg-nexus-light-purple z-10"
              aria-label="Close"
            >
              <X className="h-3 w-3" />
            </button>
            
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
                  {dapp.icon && <dapp.icon className="h-4 w-4 text-nexus-purple" />}
                </div>
                <div>
                  <h3 className="font-medium text-sm">{dapp.name}</h3>
                  <p className="text-xs text-muted-foreground">{dapp.description}</p>
                </div>
              </div>
              <Badge variant="outline" className="text-xs px-1.5 py-0 h-5 bg-nexus-purple/10 text-nexus-purple border-nexus-purple/20 ml-1">
                {dapp.category}
              </Badge>
            </div>
            <div className="mt-1.5 flex justify-end">
              <Button 
                variant="ghost" 
                size="sm"
                className="h-6 text-xs px-2 text-nexus-purple hover:text-nexus-light-purple hover:bg-nexus-purple/10"
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
