
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Filter, Search, Grid2x2, List } from "lucide-react";

interface ExtensionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
}

const ExtensionSearchBar: React.FC<ExtensionSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  activeCategory,
  setActiveCategory,
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search extensions..." 
          className="pl-10 h-11 text-base"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="lg" className="h-11 px-4 gap-2">
            <Filter className="h-5 w-5" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setActiveCategory("all")}>
            All Categories
          </DropdownMenuItem>
          {categories.filter(c => c !== "all").sort().map((category) => (
            <DropdownMenuItem 
              key={category} 
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <div className="flex items-center rounded-md border border-input overflow-hidden">
        <Button 
          variant={viewMode === "grid" ? "default" : "outline"}
          onClick={() => setViewMode("grid")} 
          className="h-11 rounded-none border-0 px-4"
        >
          <Grid2x2 className="h-5 w-5" />
        </Button>
        <Button 
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")} 
          className="h-11 rounded-none border-0 border-l border-input px-4"
        >
          <List className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ExtensionSearchBar;
