
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { extensionsData } from "@/lib/extensionsData";
import PageLayout from "@/components/Layout/PageLayout";
import ExtensionSearchBar from "@/components/Extensions/ExtensionSearchBar";
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

  const statsData = [
    { title: "Total Extensions", value: extensions.length, icon: Package },
    { title: "Installed", value: installedExtensions.length, icon: FileText },
    { title: "Featured", value: featuredExtensions.length, icon: Star },
    { title: "Active", value: extensions.filter(ext => ext.enabled).length, icon: Shield },
  ];

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
              Nexus Wave Extension Library
            </h1>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {statsData.map((stat, index) => (
              <Card key={index} className={`bg-gradient-to-br ${
                index % 4 === 0 ? "from-purple-500/20 to-purple-700/20" : 
                index % 4 === 1 ? "from-blue-500/20 to-blue-700/20" : 
                index % 4 === 2 ? "from-pink-500/20 to-pink-700/20" : 
                "from-emerald-500/20 to-emerald-700/20"
              }`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Unified control bar - matching ExtensionStore layout with hover effects */}
          <div className="flex items-center justify-between gap-4 mt-6 mb-8">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="flex-shrink-0">
              <TabsList className="h-12 bg-gray-800/80 rounded-lg border border-gray-700">
                <TabsTrigger 
                  value="all" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  All Extensions
                </TabsTrigger>
                <TabsTrigger 
                  value="installed" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  Installed
                </TabsTrigger>
                <TabsTrigger 
                  value="featured" 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  Featured
                </TabsTrigger>
                <TabsTrigger 
                  value="beta" 
                  onClick={handleBetaNavigation} 
                  className="text-base px-6 py-2.5 data-[state=active]:bg-gray-900 hover:bg-gray-700/80 transition-colors rounded-md"
                >
                  Beta
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            <div className="flex-grow flex justify-end">
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
          <TabsContent value="beta" className="mt-0">
            <BetaExtensions />
          </TabsContent>

          <TabsContent value="all" className="mt-0">
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

          <TabsContent value="installed" className="mt-0">
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

          <TabsContent value="featured" className="mt-0">
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
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtensionAdmin;
