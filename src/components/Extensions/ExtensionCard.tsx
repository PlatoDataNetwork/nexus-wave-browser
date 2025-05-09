
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart } from "lucide-react";
import { Extension } from "@/lib/extensionsData";

interface ExtensionCardProps {
  extension: Extension;
  onInstall: () => void;
  onToggleFavorite?: () => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ extension, onInstall, onToggleFavorite }) => {
  const { 
    name, 
    description, 
    category, 
    icon: Icon, 
    iconBg, 
    rating, 
    version, 
    installed, 
    featured,
    isBeta,
    estimatedRelease 
  } = extension;
  
  const isFavorite = featured;

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md bg-[#191823] border border-[#433E56] ${isFavorite ? 'border-nexus-purple bg-gradient-to-br from-nexus-purple/5 to-transparent' : ''}`}>
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`h-12 w-12 rounded-md flex items-center justify-center ${iconBg}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-lg line-clamp-1 text-white">{name}</h3>
                {isBeta && (
                  <Badge variant="outline" className="ml-2 bg-yellow-500/20 text-yellow-400 border-yellow-600">
                    BETA
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-400">
                {isBeta ? `Est. Release: ${estimatedRelease}` : `v${version}`}
              </div>
            </div>
          </div>
          {onToggleFavorite && (
            <button
              onClick={onToggleFavorite}
              className="text-gray-400 hover:text-nexus-purple transition-colors"
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart 
                className={`h-5 w-5 ${isFavorite ? 'fill-[#9271FF] text-[#9271FF]' : ''}`} 
              />
            </button>
          )}
        </div>
      </div>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-400 line-clamp-3 h-[4.5rem] mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-[#24212F] text-gray-300 border-[#433E56]">
            {category}
          </Badge>
          <div className="flex items-center text-sm text-gray-300">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{rating}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={onInstall}
          className={`w-full ${installed ? "bg-[#24212F] hover:bg-[#24212F]/80 text-gray-300 border border-[#433E56]" : "bg-[#9271FF] hover:bg-[#9271FF]/90 text-white"}`}
          variant={installed ? "outline" : "default"}
        >
          {installed ? "Uninstall" : "Install Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionCard;
