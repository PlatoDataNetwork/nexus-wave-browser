
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
    <div className="flex items-center gap-2 w-full">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search extensions..." 
          className="pl-10 h-9 text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-9 px-3 gap-1 text-sm">
            <Filter className="h-4 w-4" />
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
          className={`h-9 rounded-none border-0 px-2 ${viewMode === "grid" ? "bg-nexus-purple hover:bg-nexus-deep-purple" : "hover:bg-nexus-purple/20"}`}
        >
          <Grid2x2 className="h-4 w-4" />
        </Button>
        <Button 
          variant={viewMode === "list" ? "default" : "outline"}
          onClick={() => setViewMode("list")} 
          className={`h-9 rounded-none border-0 border-l border-input px-2 ${viewMode === "list" ? "bg-nexus-purple hover:bg-nexus-deep-purple" : "hover:bg-nexus-purple/20"}`}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ExtensionSearchBar;
