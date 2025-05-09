
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Package, Heart } from "lucide-react";
import { Extension } from "@/lib/extensionsData";
import ExtensionCard from "@/components/Extensions/ExtensionCard";

interface ExtensionListProps {
  extensions: Extension[];
  viewMode: "grid" | "list";
  onInstall: (id: number) => void;
  onToggleFavorite?: (id: number) => void;
}

const ExtensionList: React.FC<ExtensionListProps> = ({ 
  extensions, 
  viewMode, 
  onInstall, 
  onToggleFavorite 
}) => {
  if (extensions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed">
        <Package className="h-10 w-10 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No extensions found</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Try searching for something else or clearing your filters
        </p>
      </div>
    );
  }

  return viewMode === "grid" ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {extensions.map((extension) => (
        <ExtensionCard 
          key={extension.id} 
          extension={extension}
          onInstall={() => onInstall(extension.id)}
          onToggleFavorite={() => onToggleFavorite && onToggleFavorite(extension.id)}
        />
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {extensions.map((extension) => {
        const isFavorite = extension.featured;
        
        return (
          <Card key={extension.id} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center flex-1">
              <div className={`h-10 w-10 rounded-md flex items-center justify-center ${extension.iconBg}`}>
                {extension.icon && <extension.icon className="h-5 w-5 text-white" />}
              </div>
              <div className="ml-4">
                <div className="flex items-center">
                  <h3 className="font-medium">{extension.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {extension.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-4">
              <button
                onClick={() => onToggleFavorite && onToggleFavorite(extension.id)}
                className="text-muted-foreground hover:text-nexus-purple transition-colors"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart 
                  className={`h-5 w-5 ${isFavorite ? 'fill-nexus-purple text-nexus-purple' : ''}`} 
                />
              </button>
              <Badge variant="outline" className="bg-secondary/50 text-foreground">{extension.category}</Badge>
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span>{extension.rating}</span>
              </div>
              <Button 
                variant={extension.installed ? "outline" : "default"}
                onClick={() => onInstall(extension.id)}
                className={extension.installed ? "" : "bg-nexus-purple hover:bg-nexus-purple/90"}
              >
                {extension.installed ? "Uninstall" : "Install Now"}
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ExtensionList;
