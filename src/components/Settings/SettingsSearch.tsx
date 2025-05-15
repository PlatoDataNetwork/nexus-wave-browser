
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Plus, Loader2 } from "lucide-react";

const defaultEngines = [
  { id: "google", name: "Google", url: "https://www.google.com/search?q={searchTerms}" },
  { id: "bing", name: "Bing", url: "https://www.bing.com/search?q={searchTerms}" },
  { id: "duckduckgo", name: "DuckDuckGo", url: "https://duckduckgo.com/?q={searchTerms}" },
  { id: "you", name: "You.com", url: "https://you.com/search?q={searchTerms}" },
];

const SettingsSearch = () => {
  const [defaultEngine, setDefaultEngine] = useState("google");
  const [engines, setEngines] = useState(defaultEngines);
  const [newEngineName, setNewEngineName] = useState("");
  const [newEngineUrl, setNewEngineUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  
  // Safe search settings
  const [safeSearch, setSafeSearch] = useState(true);
  const [showExplicitImages, setShowExplicitImages] = useState(false);
  const [trackSearchHistory, setTrackSearchHistory] = useState(true);
  
  // Clear search history
  const [clearing, setClearing] = useState(false);
  
  const handleSetDefaultEngine = (engineId: string) => {
    setDefaultEngine(engineId);
    
    // In a real app, this would save to a database
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        description: `Default search engine set to ${engines.find(e => e.id === engineId)?.name || engineId}`
      });
    }, 500);
  };
  
  const handleAddEngine = () => {
    if (!newEngineName.trim() || !newEngineUrl.trim()) {
      toast({
        description: "Please enter both a name and URL for the new search engine",
        variant: "destructive"
      });
      return;
    }
    
    if (!newEngineUrl.includes("{searchTerms}")) {
      toast({
        description: "Search URL must include {searchTerms} as a placeholder for the query"
      });
      return;
    }
    
    const newEngine = {
      id: `custom-${Date.now()}`,
      name: newEngineName,
      url: newEngineUrl
    };
    
    setEngines([...engines, newEngine]);
    setNewEngineName("");
    setNewEngineUrl("");
    
    toast({
      description: `Added ${newEngineName} search engine`
    });
  };
  
  const handleRemoveEngine = (engineId: string) => {
    // Don't remove default engines
    if (defaultEngines.some(e => e.id === engineId)) {
      toast({
        description: "Cannot remove default search engines"
      });
      return;
    }
    
    setEngines(engines.filter(e => e.id !== engineId));
    
    // If this was the default engine, reset to google
    if (defaultEngine === engineId) {
      setDefaultEngine("google");
    }
    
    toast({
      description: "Search engine removed"
    });
  };
  
  const handleClearSearchHistory = () => {
    setClearing(true);
    
    // Simulate clearing search history
    setTimeout(() => {
      setClearing(false);
      toast({
        description: "Search history cleared"
      });
    }, 1000);
  };
  
  const handleToggleSafeSearch = () => {
    setSafeSearch(!safeSearch);
    
    toast({
      description: `Safe search ${!safeSearch ? 'enabled' : 'disabled'}`
    });
  };
  
  const handleToggleExplicitImages = () => {
    setShowExplicitImages(!showExplicitImages);
    
    toast({
      description: `Explicit images will now be ${!showExplicitImages ? 'shown' : 'filtered'}`
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search Settings</CardTitle>
          <CardDescription>
            Configure how search works in Nexus Browser
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="defaultEngine">Default Search Engine</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {engines.map((engine) => (
                <Button
                  key={engine.id}
                  variant={defaultEngine === engine.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSetDefaultEngine(engine.id)}
                  disabled={isSaving}
                >
                  {engine.name}
                </Button>
              ))}
              
              {isSaving && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <Label>Search Engines</Label>
            <div className="space-y-2">
              {engines.map((engine) => (
                <div key={engine.id} className="flex items-center justify-between py-2">
                  <div>
                    <div className="font-medium">{engine.name}</div>
                    <div className="text-xs text-muted-foreground">{engine.url}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveEngine(engine.id)}
                    disabled={defaultEngines.some(e => e.id === engine.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2 mt-4">
              <div className="grid gap-2 flex-1">
                <Label htmlFor="engineName">Name</Label>
                <Input
                  id="engineName"
                  placeholder="Engine name"
                  value={newEngineName}
                  onChange={(e) => setNewEngineName(e.target.value)}
                />
              </div>
              <div className="grid gap-2 flex-1">
                <Label htmlFor="engineUrl">URL with {"{searchTerms}"}</Label>
                <Input
                  id="engineUrl"
                  placeholder="https://example.com/search?q={searchTerms}"
                  value={newEngineUrl}
                  onChange={(e) => setNewEngineUrl(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="mb-[1px]"
                  onClick={handleAddEngine}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Safety & Privacy</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="safeSearch">Safe Search</Label>
                <p className="text-sm text-muted-foreground">
                  Filter out explicit content from search results
                </p>
              </div>
              <Switch
                id="safeSearch"
                checked={safeSearch}
                onCheckedChange={handleToggleSafeSearch}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="explicitImages">Hide Explicit Images</Label>
                <p className="text-sm text-muted-foreground">
                  Blur images that may contain adult content
                </p>
              </div>
              <Switch
                id="explicitImages"
                checked={!showExplicitImages}
                onCheckedChange={handleToggleExplicitImages}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="trackHistory">Save Search History</Label>
                <p className="text-sm text-muted-foreground">
                  Keep record of your searches for future reference
                </p>
              </div>
              <Switch
                id="trackHistory"
                checked={trackSearchHistory}
                onCheckedChange={() => {
                  setTrackSearchHistory(!trackSearchHistory);
                  toast({
                    description: `Search history ${!trackSearchHistory ? 'will be saved' : 'will not be saved'}`
                  });
                }}
              />
            </div>
            
            <Button 
              variant="outline" 
              onClick={handleClearSearchHistory}
              disabled={clearing}
              className="w-full"
            >
              {clearing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : "Clear Search History"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsSearch;
