
import React, { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SettingsSearch: React.FC = () => {
  const [defaultSearchEngine, setDefaultSearchEngine] = useState("platodata");
  const [searchSuggestions, setSearchSuggestions] = useState(true);

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
      </div>
    </div>
  );
};

export default SettingsSearch;
