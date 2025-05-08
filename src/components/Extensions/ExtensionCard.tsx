
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
  const { id, name, description, category, rating, users, installed, featured, icon: Icon, iconBg, version } = extension;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${featured ? 'border-nexus-purple/40 bg-gradient-to-br from-nexus-purple/5 to-transparent' : ''}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className={`h-10 w-10 rounded-md flex items-center justify-center ${iconBg}`}>
              {Icon && <Icon className="h-5 w-5 text-white" />}
            </div>
            <div className="ml-3">
              <h3 className="font-medium line-clamp-1">{name}</h3>
              <div className="text-xs text-muted-foreground">v{version}</div>
            </div>
          </div>
          {featured && (
            <Badge variant="secondary" className="bg-nexus-purple/20 text-nexus-purple">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-3 h-[4.5rem]">
          {description}
        </p>
        <div className="flex items-center justify-between mt-3">
          <Badge variant="outline">{category}</Badge>
          <div className="flex items-center text-sm">
            <div className="flex items-center mr-3">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
              <span>{rating}</span>
            </div>
            <span className="text-muted-foreground">{users.toLocaleString()} users</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onInstall} 
          className={installed ? "bg-muted hover:bg-muted/80 text-foreground" : ""}
          variant={installed ? "outline" : "default"}
          size="sm"
          className="w-full"
        >
          {installed ? "Uninstall" : "Install Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionCard;
