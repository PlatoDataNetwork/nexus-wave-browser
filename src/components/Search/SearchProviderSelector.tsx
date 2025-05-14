
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

export type SearchProvider = "serper" | "you";

interface SearchProviderSelectorProps {
  selectedProvider: SearchProvider;
  onSelectProvider: (provider: SearchProvider) => void;
}

const SearchProviderSelector: React.FC<SearchProviderSelectorProps> = ({
  selectedProvider,
  onSelectProvider
}) => {
  const getProviderDisplayName = (provider: SearchProvider) => {
    switch (provider) {
      case "serper":
        return "Serper API";
      case "you":
        return "You.com API";
      default:
        return "Select Provider";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <span>Provider: {getProviderDisplayName(selectedProvider)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onSelectProvider("serper")}>
          {selectedProvider === "serper" && <Check className="h-4 w-4 mr-2" />}
          Serper API
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSelectProvider("you")}>
          {selectedProvider === "you" && <Check className="h-4 w-4 mr-2" />}
          You.com API
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SearchProviderSelector;
