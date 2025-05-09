import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowLeft, MoreVertical, Settings, Star, FileText, Shield, Package } from "lucide-react";
import { extensionsData } from "@/lib/extensionsData";
import PageLayout from "@/components/Layout/PageLayout";
import ExtensionSearchBar from "@/components/Extensions/ExtensionSearchBar";
import ExtensionStats from "@/components/Extensions/ExtensionStats";
import BetaExtensions from "@/components/Extensions/BetaExtensions";

const ExtensionAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [extensions, setExtensions] = useState(extensionsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [activeCategory, setActiveCategory] = useState("all");

  // Get unique categories from extensions
  const categories = ["all", ...new Set(extensionsData.map(ext => ext.category))];

  const installedExtensions = extensions.filter(ext => ext.installed);
  const featuredExtensions = extensions.filter(ext => ext.featured);

  const currentExtensions = activeTab === "all" 
    ? extensions
    : activeTab === "installed" 
      ? installedExtensions
      : featuredExtensions;

  const filteredExtensions = currentExtensions.filter(ext => {
    const matchesSearch = 
      ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ext.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === "all" || ext.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const toggleExtension = (id: number) => {
    setExtensions(
      extensions.map(ext => 
        ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
      )
    );
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: extension.enabled ? "Extension disabled" : "Extension enabled",
        description: extension.enabled 
          ? `${extension.name} has been disabled` 
          : `${extension.name} has been enabled`,
      });
    }
  };

  const toggleFeatured = (id: number) => {
    setExtensions(
      extensions.map(ext => 
        ext.id === id ? { ...ext, featured: !ext.featured } : ext
      )
    );
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: extension.featured 
          ? "Removed from featured" 
          : "Added to featured",
        description: extension.featured 
          ? `${extension.name} has been removed from featured extensions` 
          : `${extension.name} has been added to featured extensions`,
      });
    }
  };

  const uninstallExtension = (id: number) => {
    setExtensions(
      extensions.map(ext => 
        ext.id === id ? { ...ext, installed: false } : ext
      )
    );
    
    const extension = extensions.find(ext => ext.id === id);
    if (extension) {
      toast({
        title: "Extension uninstalled",
        description: `${extension.name} has been uninstalled`,
      });
    }
  };

  // Handle Beta Navigation
  const handleBetaNavigation = () => {
    setActiveTab("beta");
  };

  return (
    <PageLayout>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <div className="flex items-center justify-between px-6 h-12 bg-card border-b border-border">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate("/extension-store")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-medium ml-2 bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
              Extension Admin Console
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/extension-store")}
          >
            Browse Store
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
          {/* Main Title matching ExtensionStore */}
          <h1 className="text-xl md:text-2xl font-semibold mb-6 bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
            Nexus Wave Extension Library
          </h1>
          
          {/* Stats Cards */}
          <ExtensionStats extensions={extensions} />
          
          {/* Tabs and search controls */}
          <div className="mt-6">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center">
                <TabsList className="h-10 bg-muted/30 rounded-lg border border-muted p-0.5 mr-3">
                  <TabsTrigger 
                    value="all" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    All Extensions
                  </TabsTrigger>
                  <TabsTrigger 
                    value="installed" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Installed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="favorites" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Favorites
                  </TabsTrigger>
                  <TabsTrigger 
                    value="featured" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Featured
                  </TabsTrigger>
                  <TabsTrigger 
                    value="beta" 
                    className="h-9 px-4 text-sm data-[state=active]:bg-nexus-purple data-[state=active]:text-white hover:bg-nexus-purple/20 transition-colors rounded"
                  >
                    Beta
                  </TabsTrigger>
                </TabsList>
                
                {/* Search bar moved to the same line as tabs */}
                <div className="flex-1">
                  {activeTab !== "beta" && (
                    <ExtensionSearchBar
                      searchQuery={searchQuery}
                      setSearchQuery={setSearchQuery}
                      categories={categories}
                      activeCategory={activeCategory}
                      setActiveCategory={setActiveCategory}
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                    />
                  )}
                </div>
              </div>
              
              {/* Content based on active tab */}
              <TabsContent value="beta" className="mt-6 p-0">
                <BetaExtensions />
              </TabsContent>

              <TabsContent value="all" className="mt-6 p-0">
                {/* Extensions table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExtensions.map((extension) => (
                        <TableRow key={extension.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded flex items-center justify-center ${extension.iconBg}`}>
                                {extension.icon && <extension.icon className="h-4 w-4 text-white" />}
                              </div>
                              <div className="ml-3">
                                <div>{extension.name}</div>
                                <div className="text-xs text-muted-foreground">{extension.version}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{extension.category}</Badge>
                          </TableCell>
                          <TableCell>{extension.users.toLocaleString()}</TableCell>
                          <TableCell>
                            {extension.installed && (
                              <Switch 
                                checked={extension.featured} 
                                onCheckedChange={() => toggleFeatured(extension.id)} 
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            {extension.installed ? (
                              <Switch 
                                checked={extension.enabled} 
                                onCheckedChange={() => toggleExtension(extension.id)}
                              />
                            ) : (
                              <Badge variant="outline" className="bg-muted">Not installed</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => toast({
                                    title: "Extension settings",
                                    description: `Opening settings for ${extension.name}`
                                  })}
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(extension.id.toString())}>
                                  Copy ID
                                </DropdownMenuItem>
                                {extension.installed && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => uninstallExtension(extension.id)}
                                  >
                                    Uninstall
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredExtensions.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed mt-6">
                    <Package className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No extensions found</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Try searching for something else or clearing your filters
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="installed" className="mt-6 p-0">
                {/* Reuse the same table but with installedExtensions */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExtensions.map((extension) => (
                        <TableRow key={extension.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded flex items-center justify-center ${extension.iconBg}`}>
                                {extension.icon && <extension.icon className="h-4 w-4 text-white" />}
                              </div>
                              <div className="ml-3">
                                <div>{extension.name}</div>
                                <div className="text-xs text-muted-foreground">{extension.version}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{extension.category}</Badge>
                          </TableCell>
                          <TableCell>{extension.users.toLocaleString()}</TableCell>
                          <TableCell>
                            <Switch 
                              checked={extension.featured} 
                              onCheckedChange={() => toggleFeatured(extension.id)} 
                            />
                          </TableCell>
                          <TableCell>
                            <Switch 
                              checked={extension.enabled} 
                              onCheckedChange={() => toggleExtension(extension.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => toast({
                                    title: "Extension settings",
                                    description: `Opening settings for ${extension.name}`
                                  })}
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(extension.id.toString())}>
                                  Copy ID
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => uninstallExtension(extension.id)}
                                >
                                  Uninstall
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredExtensions.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed mt-6">
                    <Package className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No installed extensions found</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Visit the Extension Store to install extensions
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="featured" className="mt-6 p-0">
                {/* Reuse the same table but with featuredExtensions */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Users</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredExtensions.map((extension) => (
                        <TableRow key={extension.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded flex items-center justify-center ${extension.iconBg}`}>
                                {extension.icon && <extension.icon className="h-4 w-4 text-white" />}
                              </div>
                              <div className="ml-3">
                                <div>{extension.name}</div>
                                <div className="text-xs text-muted-foreground">{extension.version}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{extension.category}</Badge>
                          </TableCell>
                          <TableCell>{extension.users.toLocaleString()}</TableCell>
                          <TableCell>
                            <Switch 
                              checked={extension.featured} 
                              onCheckedChange={() => toggleFeatured(extension.id)} 
                            />
                          </TableCell>
                          <TableCell>
                            {extension.installed ? (
                              <Switch 
                                checked={extension.enabled} 
                                onCheckedChange={() => toggleExtension(extension.id)}
                              />
                            ) : (
                              <Badge variant="outline" className="bg-muted">Not installed</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => toast({
                                    title: "Extension settings",
                                    description: `Opening settings for ${extension.name}`
                                  })}
                                >
                                  <Settings className="mr-2 h-4 w-4" />
                                  <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(extension.id.toString())}>
                                  Copy ID
                                </DropdownMenuItem>
                                {extension.installed && (
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => uninstallExtension(extension.id)}
                                  >
                                    Uninstall
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {filteredExtensions.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed mt-6">
                    <Star className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No featured extensions found</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      Mark extensions as featured using the toggle
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtensionAdmin;
