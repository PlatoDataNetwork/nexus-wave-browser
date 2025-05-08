
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Filter, Search, Package, Grid2x2, List, Settings, Download, Star, Users, Info, Tag } from "lucide-react";
import BrowserFooter from "@/components/Browser/BrowserFooter";
import { extensionsData } from "@/lib/extensionsData";
import ExtensionCard from "@/components/Extensions/ExtensionCard";
import PageLayout from "@/components/Layout/PageLayout";

const ExtensionStore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [extensions, setExtensions] = useState(extensionsData);
  
  // Get unique categories from extensions
  const categories = ["all", ...new Set(extensionsData.map(ext => ext.category))];

  // Filter extensions based on search query and active category
  const filteredExtensions = extensions.filter(extension => {
    const matchesSearch = 
      extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extension.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || extension.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleInstall = (id: number) => {
    setExtensions(
      extensions.map(ext => 
        ext.id === id ? { ...ext, installed: !ext.installed } : ext
      )
    );
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: extension.installed ? "Extension uninstalled" : "Extension installed",
        description: extension.installed 
          ? `${extension.name} has been removed from your browser` 
          : `${extension.name} has been added to your browser`,
      });
    }
  };

  const navigateToAdmin = () => {
    navigate("/extension-admin");
  };

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-center h-12 bg-card border-b border-border">
          <h1 className="text-xl font-medium bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
            Nexus Wave Extension Library
          </h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {/* Search and filter bar */}
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
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setViewMode("grid")}>
                <Grid2x2 className={`h-4 w-4 ${viewMode === "grid" ? "text-primary" : "text-muted-foreground"}`} />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setViewMode("list")}>
                <List className={`h-4 w-4 ${viewMode === "list" ? "text-primary" : "text-muted-foreground"}`} />
              </Button>
              <Button variant="default" size="sm" onClick={navigateToAdmin} className="bg-nexus-purple hover:bg-nexus-deep-purple">
                <Settings className="h-4 w-4 mr-2" />
                Manage Extensions
              </Button>
            </div>
          </div>

          {/* Categories bar */}
          <div className="mb-6 overflow-x-auto">
            <Tabs defaultValue={activeCategory} value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="flex h-10 w-full">
                <TabsTrigger value="all" className="flex-grow">
                  <Package className="h-4 w-4 mr-2" /> All
                </TabsTrigger>
                {categories.filter(c => c !== "all").sort().map((category) => (
                  <TabsTrigger key={category} value={category} className="flex-grow">
                    <Tag className="h-4 w-4 mr-2" /> {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Extensions grid/list */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredExtensions.map((extension) => (
                <ExtensionCard 
                  key={extension.id} 
                  extension={extension}
                  onInstall={() => handleInstall(extension.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExtensions.map((extension) => (
                <Card key={extension.id} className="flex items-center p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center flex-1">
                    <div className={`h-10 w-10 rounded-md flex items-center justify-center ${extension.iconBg}`}>
                      {extension.icon && <extension.icon className="h-5 w-5 text-white" />}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">{extension.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {extension.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant="outline">{extension.category}</Badge>
                    <Badge variant="secondary">{extension.users.toLocaleString()} users</Badge>
                    <Button 
                      variant={extension.installed ? "outline" : "default"}
                      onClick={() => handleInstall(extension.id)}
                      size="sm"
                    >
                      {extension.installed ? "Uninstall" : "Install"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {filteredExtensions.length === 0 && (
            <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed">
              <Package className="h-10 w-10 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No extensions found</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Try searching for something else or clearing your filters
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtensionStore;
