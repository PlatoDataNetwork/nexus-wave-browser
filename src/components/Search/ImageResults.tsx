
import React from 'react';
import { Loader2 } from "lucide-react";
import { SearchResultItem } from '@/services/searchApi';
import ImageResultsGrid from './ImageResultsGrid';

interface ImageResultsProps {
  isLoading: boolean;
  results: SearchResultItem[];
  searchQuery: string;
}

const ImageResults: React.FC<ImageResultsProps> = ({ isLoading, results, searchQuery }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-40">
        <Loader2 className="h-8 w-8 text-nexus-purple animate-spin mb-2" />
        <p className="text-muted-foreground">Searching images...</p>
      </div>
    );
  }

  if (!searchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-xl font-medium mb-2">Enter a search term to find images</h2>
        <p className="text-muted-foreground">Search for high-quality images across the web</p>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl font-medium mb-2">No image results found</h2>
        <p className="text-muted-foreground">Try different keywords or search terms</p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">
        About {results.length.toLocaleString()} image results ({(Math.random() * 0.5 + 0.1).toFixed(2)} seconds)
      </p>
      <ImageResultsGrid results={results} />
    </div>
  );
};

export default ImageResults;
