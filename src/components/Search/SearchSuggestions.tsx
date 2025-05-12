
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SearchSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = [
  "What is the market size for Web3 browsers?",
  "Compare Nexus Wave to other blockchain browsers",
  "How does Nexus Bridge secure crypto transactions?",
  "Web3 browser growth projections 2025-2030",
  "Explain Nexus Wave's competitive advantages",
  "How will Nexus Wave monetize its user base?"
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
  onSelectSuggestion,
  suggestions = DEFAULT_SUGGESTIONS
}) => {
  return (
    <div className="mt-6 flex flex-col gap-2 max-w-md mx-auto">
      {suggestions.slice(0, 4).map((suggestion, index) => (
        <Button 
          key={index}
          variant="outline" 
          className="flex items-center justify-between"
          onClick={() => onSelectSuggestion(suggestion)}
        >
          <span>{suggestion}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
