
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
import { TabsContent } from "@/components/ui/tabs";
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

  // Handle tab navigation
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
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
          
          {/* New Tab Navigation */}
          <div className="flex flex-wrap items-center gap-4 mt-6">
            {/* Custom Tabs */}
            <div className="flex rounded-lg overflow-hidden bg-[#151515]">
              <button 
                className={`px-6 py-3 ${activeTab === 'all' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => handleTabChange('all')}
              >
                All Extensions
              </button>
              <button 
                className={`px-6 py-3 ${activeTab === 'installed' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => handleTabChange('installed')}
              >
                Installed
              </button>
              <button 
                className={`px-6 py-3 ${activeTab === 'favorites' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => handleTabChange('favorites')}
              >
                Favorites
              </button>
              <button 
                className={`px-6 py-3 ${activeTab === 'featured' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => handleTabChange('featured')}
              >
                Featured
              </button>
              <button 
                className={`px-6 py-3 ${activeTab === 'beta' ? 'bg-nexus-purple text-white' : 'text-white'}`}
                onClick={() => handleTabChange('beta')}
              >
                Beta
              </button>
            </div>
            
            {/* Search input */}
            {activeTab !== "beta" && (
              <div className="flex-1">
                <div className="relative flex items-center">
                  <input
                    type="search"
                    placeholder="Search extensions..."
                    className="w-full bg-[#151515] text-white pl-10 pr-4 py-3 rounded-lg"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="absolute left-3">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            )}
            
            {/* Filter Button */}
            {activeTab !== "beta" && (
              <button className="bg-[#151515] text-white px-6 py-3 rounded-lg flex items-center space-x-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 6H21M7 12H17M11 18H13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Filter</span>
              </button>
            )}
            
            {/* View Mode Toggles */}
            {activeTab !== "beta" && (
              <div className="flex bg-[#151515] rounded-lg overflow-hidden">
                <button
                  className={`p-3 ${viewMode === 'grid' ? 'bg-nexus-purple' : 'bg-transparent'}`}
                  onClick={() => setViewMode('grid')}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                    <rect x="3" y="11" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                    <rect x="11" y="3" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                    <rect x="11" y="11" width="6" height="6" rx="1" stroke="white" strokeWidth="2"/>
                  </svg>
                </button>
                <button
                  className={`p-3 ${viewMode === 'list' ? 'bg-nexus-purple' : 'bg-transparent'}`}
                  onClick={() => setViewMode('list')}
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 5H17M3 10H17M3 15H17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {/* Content based on active tab */}
          <div className="mt-6">
            {activeTab === "beta" ? (
              <BetaExtensions />
            ) : (
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
            )}

            {activeTab !== "beta" && filteredExtensions.length === 0 && (
              <div className="flex flex-col items-center justify-center p-10 bg-muted/20 rounded-lg border border-dashed mt-6">
                <Package className="h-10 w-10 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No extensions found</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Try searching for something else or clearing your filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExtensionAdmin;
