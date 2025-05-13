
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ExternalLink } from "lucide-react";
import { Extension } from "@/lib/extensionsData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ExtensionCardProps {
  extension: Extension;
  onInstall: () => void;
  onToggleFavorite?: () => void;
  onNavigate?: (url: string) => void;
}

const ExtensionCard: React.FC<ExtensionCardProps> = ({ 
  extension, 
  onInstall, 
  onToggleFavorite,
  onNavigate
}) => {
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
  const navigate = useNavigate();
  const { toast } = useToast();

  // Function to determine the correct URL based on extension name
  const getExtensionUrl = () => {
    // Make sure we have a valid name before attempting to check it
    if (!name) {
      console.error("ExtensionCard: Extension name is undefined");
      return "javascript:void(0)";
    }
    
    if (name === "GasSaver") {
      return "https://gasless-nexus-wave-watch.lovable.app/dashboard";
    }
    if (name === "DefiX") {
      return "https://defix-extension-demo.lovable.app/dashboard";
    }
    return "javascript:void(0)";
  };

  // Handle the button click to navigate to the extension URL
  const handleExtensionAccess = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = getExtensionUrl();
    
    // Skip navigation for javascript:void(0)
    if (url === "javascript:void(0)") {
      toast({
        title: "Extension not available",
        description: `${name} is not currently available for access.`,
      });
      return;
    }
    
    toast({
      title: "Opening Extension",
      description: `Loading ${name} in the browser...`,
    });
    
    // If onNavigate prop exists, use it to navigate in the integrated browser
    if (onNavigate) {
      console.log(`ExtensionCard: Navigating to ${url} using onNavigate`);
      onNavigate(url);
    } else {
      // Fallback to navigate to /app with the URL as a parameter
      console.log(`ExtensionCard: Navigating to /app?url=${encodeURIComponent(url)} using navigate`);
      navigate(`/app?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md bg-[#191823] border border-[#433E56] ${isFavorite ? 'border-nexus-purple bg-gradient-to-br from-nexus-purple/5 to-transparent' : ''}`}>
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`h-12 w-12 rounded-md flex items-center justify-center ${iconBg}`}>
              {Icon && <Icon className="h-6 w-6 text-white" />}
            </div>
            <div>
              <div className="flex items-center">
                <h3 className="font-medium text-lg line-clamp-1 text-white">{name || "Unnamed Extension"}</h3>
              </div>
              <div className="text-xs text-gray-400">
                {isBeta ? `Est. Release: ${estimatedRelease}` : `v${version || "1.0.0"}`}
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
          {description || "No description available"}
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="bg-[#24212F] text-gray-300 border-[#433E56]">
            {category || "Uncategorized"}
          </Badge>
          <div className="flex items-center text-sm text-gray-300">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span>{rating || "N/A"}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          className={`w-full ${installed ? "bg-[#24212F] hover:bg-[#24212F]/80 text-gray-300 border border-[#433E56]" : "bg-[#9271FF] hover:bg-[#9271FF]/90 text-white"}`}
          variant={installed ? "outline" : "default"}
          onClick={handleExtensionAccess}
        >
          Access Now <ExternalLink className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExtensionCard;
