import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { 
  Filter, 
  Search, 
  Package, 
  Grid2x2, 
  List, 
  Star, 
  ShoppingCart, 
  Zap, 
  Shield,
  UserCog
} from "lucide-react";
import { extensionsData } from "@/lib/extensionsData";
import ExtensionCard from "@/components/Extensions/ExtensionCard";

const ExtensionStore: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [extensions, setExtensions] = useState(extensionsData);
  
  // Get unique categories from extensions
  const categories = ["all", ...new Set(extensionsData.map(ext => ext.category))];

  // Filter extensions based on search query, active category, and tab
  const filteredExtensions = extensions.filter(extension => {
    const matchesSearch = 
      extension.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      extension.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || extension.category === activeCategory;
    
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "installed" && extension.installed) ||
      (activeTab === "featured" && extension.featured);
    
    return matchesSearch && matchesCategory && matchesTab;
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

  // Handle Admin Navigation
  const handleAdminNavigation = () => {
    toast({
      title: "Navigating to Admin",
      description: "Opening Extension Admin Console"
    });
    navigate("/extension-admin");
  };

  // Statistics data
  const statsData = [
    { title: "Available", value: extensions.length, icon: Package, color: "bg-gradient-to-br from-purple-500/20 to-purple-700/20" },
    { title: "Installed", value: extensions.filter(ext => ext.installed).length, icon: ShoppingCart, color: "bg-gradient-to-br from-blue-500/20 to-blue-700/20" },
    { title: "Featured", value: extensions.filter(ext => ext.featured).length, icon: Star, color: "bg-gradient-to-br from-pink-500/20 to-pink-700/20" },
    { title: "Security", value: extensions.filter(ext => ext.category === "Security").length, icon: Shield, color: "bg-gradient-to-br from-emerald-500/20 to-emerald-700/20" }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto w-full">
      {/* Header - moved to left alignment and increased size */}
      <div className="flex justify-start mb-6">
        <h1 className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
          Nexus Wave Extension Library
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className={stat.color}>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
              <div className="bg-background/80 p-2 rounded-full">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Tabs for filtering */}
      <div className="mb-6">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-4 sm:grid-cols-4">
            <TabsTrigger value="all">All Extensions</TabsTrigger>
            <TabsTrigger value="installed">Installed</TabsTrigger>
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="admin" onClick={handleAdminNavigation} className="bg-nexus-purple/10 hover:bg-nexus-purple/20">
              <UserCog className="h-4 w-4 mr-1" />
              Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
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

          <Button
            variant="outline"
            size="icon"
            className="bg-nexus-purple/10 hover:bg-nexus-purple/20"
            onClick={handleAdminNavigation}
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
              <div className="flex items-center gap-4 ml-4">
                <Badge variant="outline" className="bg-secondary/50 text-foreground">{extension.category}</Badge>
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{extension.rating}</span>
                </div>
                <Button 
                  variant={extension.installed ? "outline" : "default"}
                  onClick={() => handleInstall(extension.id)}
                  className={extension.installed ? "" : "bg-nexus-purple hover:bg-nexus-purple/90"}
                >
                  {extension.installed ? "Uninstall" : "Install Now"}
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
  );
};

export default ExtensionStore;
