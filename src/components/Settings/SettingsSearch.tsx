
import React, { useState, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SettingsSearch: React.FC = () => {
  const [defaultSearchEngine, setDefaultSearchEngine] = useState("platodata");
  const [searchSuggestions, setSearchSuggestions] = useState(true);
  const [contextualSearch, setContextualSearch] = useState(false);
  const [showVisitedSites, setShowVisitedSites] = useState(true);
  const [safeBrowsing, setSafeBrowsing] = useState(true);
  const [newTabPage, setNewTabPage] = useState("top-sites");
  const [searchProvider, setSearchProvider] = useState("serper");
  
  // API key management
  const [serperApiKey, setSerperApiKey] = useState("");
  const [youApiKey, setYouApiKey] = useState("");
  const [showSerperKey, setShowSerperKey] = useState(false);
  const [showYouKey, setShowYouKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch existing API keys from Supabase if available
  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data, error } = await supabase
            .from("search_api_keys")
            .select("provider, api_key")
            .eq("user_id", user.id);
          
          if (error) {
            throw error;
          }
          
          if (data) {
            const serperKeyObj = data.find(k => k.provider === "serper");
            const youKeyObj = data.find(k => k.provider === "you");
            
            if (serperKeyObj) {
              setSerperApiKey(serperKeyObj.api_key);
            }
            
            if (youKeyObj) {
              setYouApiKey(youKeyObj.api_key);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching API keys:", error);
      }
    };
    
    fetchApiKeys();
  }, []);
  
  // Save API keys to Supabase
  const saveApiKey = async (provider: "serper" | "you") => {
    setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your API keys",
          variant: "destructive"
        });
        return;
      }
      
      const apiKey = provider === "serper" ? serperApiKey : youApiKey;
      
      if (!apiKey.trim()) {
        toast({
          title: "Error",
          description: "API key cannot be empty",
          variant: "destructive"
        });
        return;
      }
      
      // Check if key already exists
      const { data: existingKeys } = await supabase
        .from("search_api_keys")
        .select("id")
        .eq("user_id", user.id)
        .eq("provider", provider);
      
      let result;
      
      if (existingKeys && existingKeys.length > 0) {
        // Update existing key
        result = await supabase
          .from("search_api_keys")
          .update({ api_key: apiKey })
          .eq("user_id", user.id)
          .eq("provider", provider);
      } else {
        // Insert new key
        result = await supabase
          .from("search_api_keys")
          .insert({
            user_id: user.id,
            provider: provider,
            api_key: apiKey
          });
      }
      
      if (result.error) {
        throw result.error;
      }
      
      toast({
        title: "API key saved",
        description: `Your ${provider === "serper" ? "Serper" : "You.com"} API key has been saved successfully`,
      });
      
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({
        title: "Error saving API key",
        description: "There was an error saving your API key. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Search engine</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage search engine settings and suggestions
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-3">Search API Configuration</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Configure your search API providers. Our application uses Serper API or You.com API for search functionality.
          </p>
          
          {/* Serper API Key */}
          <div className="mb-4 space-y-2">
            <Label htmlFor="serper-api-key">Serper API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  id="serper-api-key"
                  type={showSerperKey ? "text" : "password"}
                  value={serperApiKey}
                  onChange={(e) => setSerperApiKey(e.target.value)}
                  placeholder="Enter your Serper API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowSerperKey(!showSerperKey)}
                >
                  {showSerperKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                onClick={() => saveApiKey("serper")} 
                disabled={isLoading}
                className="bg-nexus-purple hover:bg-nexus-deep-purple"
              >
                <Check className="h-4 w-4" />
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your Serper API key at{" "}
              <a href="https://serper.dev/" target="_blank" rel="noopener noreferrer" className="text-nexus-purple hover:underline">
                serper.dev
              </a>
            </p>
          </div>
          
          {/* You.com API Key */}
          <div className="mb-4 space-y-2">
            <Label htmlFor="you-api-key">You.com API Key</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input 
                  id="you-api-key"
                  type={showYouKey ? "text" : "password"}
                  value={youApiKey}
                  onChange={(e) => setYouApiKey(e.target.value)}
                  placeholder="Enter your You.com API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowYouKey(!showYouKey)}
                >
                  {showYouKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <Button 
                onClick={() => saveApiKey("you")} 
                disabled={isLoading}
                className="bg-nexus-purple hover:bg-nexus-deep-purple"
              >
                <Check className="h-4 w-4" />
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Get your You.com API key at{" "}
              <a href="https://you.com/api" target="_blank" rel="noopener noreferrer" className="text-nexus-purple hover:underline">
                you.com/api
              </a>
            </p>
          </div>
          
          <div className="mb-4 space-y-2">
            <Label htmlFor="default-search-provider">Default Search Provider</Label>
            <RadioGroup 
              value={searchProvider} 
              onValueChange={setSearchProvider}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="serper" id="serper-provider" />
                <Label htmlFor="serper-provider">Serper</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="you" id="you-provider" />
                <Label htmlFor="you-provider">You.com</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Default search engine</h3>
          <RadioGroup value={defaultSearchEngine} onValueChange={setDefaultSearchEngine}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="platodata" id="search-platodata" />
              <Label htmlFor="search-platodata">Platodata</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="google" id="search-google" />
              <Label htmlFor="search-google">Google</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="bing" id="search-bing" />
              <Label htmlFor="search-bing">Bing</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="duckduckgo" id="search-duckduckgo" />
              <Label htmlFor="search-duckduckgo">DuckDuckGo</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Plus className="h-3.5 w-3.5" />
            Add search engine
          </Button>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Search suggestions</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Show search suggestions</p>
              <p className="text-xs text-muted-foreground">
                Get suggestions from your search engine as you type
              </p>
            </div>
            <Switch 
              checked={searchSuggestions}
              onCheckedChange={setSearchSuggestions}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">New Tab page</h3>
          <RadioGroup value={newTabPage} onValueChange={setNewTabPage}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="top-sites" id="new-tab-sites" />
              <Label htmlFor="new-tab-sites">Show top sites</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="search" id="new-tab-search" />
              <Label htmlFor="new-tab-search">Show search box only</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="blank" id="new-tab-blank" />
              <Label htmlFor="new-tab-blank">Show blank page</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Address bar suggestions</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Show visited sites</p>
                <p className="text-xs text-muted-foreground">
                  Display sites from your browsing history
                </p>
              </div>
              <Switch 
                checked={showVisitedSites}
                onCheckedChange={setShowVisitedSites}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Contextual search</p>
                <p className="text-xs text-muted-foreground">
                  Get more relevant results based on your activity
                </p>
              </div>
              <Switch 
                checked={contextualSearch}
                onCheckedChange={setContextualSearch}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Safe browsing suggestions</p>
                <p className="text-xs text-muted-foreground">
                  Get warnings for potentially dangerous sites
                </p>
              </div>
              <Switch 
                checked={safeBrowsing}
                onCheckedChange={setSafeBrowsing}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSearch;
