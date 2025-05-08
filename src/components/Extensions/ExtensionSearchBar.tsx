
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Filter, Search, Grid2x2, List, UserCog } from "lucide-react";

interface ExtensionSearchBarProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  onAdminNavigation: () => void;
}

const ExtensionSearchBar: React.FC<ExtensionSearchBarProps> = ({
  searchQuery,
  setSearchQuery,
  categories,
  activeCategory,
  setActiveCategory,
  viewMode,
  setViewMode,
  onAdminNavigation
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
      <div className="flex items-center space-x-2 w-full sm:w-auto">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search extensions..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
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

        <Button
          variant="outline"
          size="icon"
          className="bg-nexus-purple/10 hover:bg-nexus-purple/20"
          onClick={onAdminNavigation}
        >
          <UserCog className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
          <Grid2x2 className={`h-4 w-4 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`} />
        </Button>
        <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
          <List className={`h-4 w-4 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
        </Button>
      </div>
    </div>
  );
};

export default ExtensionSearchBar;
