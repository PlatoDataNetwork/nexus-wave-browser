
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Extension } from "@/lib/extensionsData";

interface ExtensionCardProps {
  extension: Extension;
  onInstall: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, onInstall }) => {
  const { id, name, description, category, rating, installed, featured, icon: Icon, iconBg, version } = extension;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${featured ? 'border-nexus-purple/40 bg-gradient-to-br from-nexus-purple/5 to-transparent' : ''}`}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start space-x-3">
          <div className={`h-12 w-12 rounded-md flex items-center justify-center ${iconBg}`}>
            {Icon && <Icon className="h-6 w-6 text-white" />}
          </div>
          <div>
            <h3 className="font-medium text-lg line-clamp-1">{name}</h3>
            <div className="text-xs text-muted-foreground">v{version}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5rem] mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-secondary/50 text-foreground">
            {category}
          </Badge>
          <div className="flex items-center text-sm">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onInstall} 
          className={`w-full ${installed ? "bg-muted hover:bg-muted/80 text-foreground" : "bg-nexus-purple hover:bg-nexus-purple/90"}`}
          variant={installed ? "outline" : "default"}
        >
          {installed ? "Uninstall" : "Install Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionCard;
