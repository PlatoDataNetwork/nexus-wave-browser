
import React from 'react';
import { SearchResultItem } from '@/services/searchApi';
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface ImageResultsGridProps {
  results: SearchResultItem[];
  onNavigate?: (url: string) => void;
}

const ImageResultsGrid: React.FC<ImageResultsGridProps> = ({ results, onNavigate }) => {
  // Handle click on image card
  const handleImageClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(url);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {results.map((result) => (
        <Card key={result.id} className="overflow-hidden group hover:shadow-md transition-all">
          <a 
            href={result.url} 
            onClick={(e) => handleImageClick(e, result.url)}
            className="cursor-pointer"
          >
            <div className="relative">
              <AspectRatio ratio={1} className="bg-muted">
                {result.thumbnailUrl ? (
                  <img 
                    src={result.thumbnailUrl || result.imageUrl} 
                    alt={result.title}
                    className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = 'https://placehold.co/400?text=Image+Not+Available';
                    }}
                  />
                ) : (
                  <Skeleton className="w-full h-full" />
                )}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity flex items-center justify-center">
                  <ExternalLink className="text-white opacity-0 group-hover:opacity-100" />
                </div>
              </AspectRatio>
            </div>
            <CardContent className="p-2">
              <p className="text-xs text-muted-foreground truncate">{result.title}</p>
              <p className="text-xs text-muted-foreground truncate">{result.source}</p>
            </CardContent>
          </a>
        </Card>
      ))}
    </div>
  );
};

export default ImageResultsGrid;
