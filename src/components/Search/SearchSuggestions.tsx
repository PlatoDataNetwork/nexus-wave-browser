
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface SearchSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void;
  autoSubmit?: boolean;
  suggestions?: string[];
  isDisabled?: boolean;
}

const DEFAULT_SUGGESTIONS = [
  "What is Blockchain technology?",
  "Explain Bitcoin versus Ethereum",
  "How does web3 change the internet?",
  "What are the best crypto projects to invest in?",
  "Explain Decentralized Finance (DeFi)",
  "What are NFTs and how do they work?"
];

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ 
  onSelectSuggestion,
  autoSubmit = true,
  suggestions = DEFAULT_SUGGESTIONS,
  isDisabled = false
}) => {
  const handleSuggestionClick = (suggestion: string) => {
    onSelectSuggestion(suggestion);
  };
  
  return (
    <div className="mt-6 flex flex-col gap-2 max-w-md mx-auto">
      {suggestions.slice(0, 4).map((suggestion, index) => (
        <Button 
          key={index}
          variant="outline" 
          className="flex items-center justify-between"
          onClick={() => handleSuggestionClick(suggestion)}
          disabled={isDisabled}
        >
          <span>{suggestion}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default SearchSuggestions;
