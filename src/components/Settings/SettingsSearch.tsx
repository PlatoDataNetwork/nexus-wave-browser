
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const SettingsSearch: React.FC = () => {
  const [defaultSearchEngine, setDefaultSearchEngine] = useState("platodata");
  const [searchSuggestions, setSearchSuggestions] = useState(true);
  const [contextualSearch, setContextualSearch] = useState(false);
  const [showVisitedSites, setShowVisitedSites] = useState(true);
  const [safeBrowsing, setSafeBrowsing] = useState(true);
  const [newTabPage, setNewTabPage] = useState("top-sites");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Search engine</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage search engine settings and suggestions
        </p>
      </div>

      <div className="space-y-4">
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
