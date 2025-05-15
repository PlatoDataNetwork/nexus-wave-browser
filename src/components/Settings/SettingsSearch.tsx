import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Save, 
  Reset, 
  Shield, 
  Lightbulb, 
  ListChecks, 
  Search as SearchIcon,
  Plus,
  Trash2
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTheme } from "@/components/theme-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SearchEngine {
  id: string;
  name: string;
  url: string;
}

const SettingsSearch: React.FC = () => {
  const [searchEngine, setSearchEngine] = useLocalStorage<string>("searchEngine", "google");
  const [safeSearch, setSafeSearch] = useLocalStorage<boolean>("safeSearch", true);
  const [searchSuggestions, setSearchSuggestions] = useLocalStorage<boolean>("searchSuggestions", true);
  const [saveSearchHistory, setSaveSearchHistory] = useLocalStorage<boolean>("saveSearchHistory", true);
  const [customSearchEngines, setCustomSearchEngines] = useLocalStorage<SearchEngine[]>("customSearchEngines", []);
  const [newEngineName, setNewEngineName] = useState("");
  const [newEngineUrl, setNewEngineUrl] = useState("");
  const { setTheme } = useTheme();
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(true);
  const [showSearchHistory, setShowSearchHistory] = useState(true);

  useEffect(() => {
    setShowSearchSuggestions(searchSuggestions);
  }, [searchSuggestions]);

  useEffect(() => {
    setShowSearchHistory(saveSearchHistory);
  }, [saveSearchHistory]);

  const handleSaveSearchEngine = (engine: string) => {
    setSearchEngine(engine);
    toast("Search engine preference saved");
  };

  const handleResetSearchHistory = () => {
    // Implement reset search history logic here
    toast("Search history cleared");
  };

  const handleToggleSafeSearch = () => {
    setSafeSearch(!safeSearch);
    toast(`Safe search ${safeSearch ? "disabled" : "enabled"}`);
  };

  const handleAddCustomEngine = () => {
    if (!newEngineUrl || !newEngineName) {
      toast("Please enter both name and URL for the custom search engine");
      return;
    }

    const newEngine: SearchEngine = {
      id: Date.now().toString(),
      name: newEngineName,
      url: newEngineUrl,
    };

    setCustomSearchEngines([...customSearchEngines, newEngine]);
    setNewEngineName("");
    setNewEngineUrl("");
    toast("Custom search engine added");
  };

  const handleRemoveCustomEngine = (id: string) => {
    const updatedEngines = customSearchEngines.filter((engine) => engine.id !== id);
    setCustomSearchEngines(updatedEngines);
    toast("Custom search engine removed");
  };

  const handleMakeDefault = (engine: SearchEngine) => {
    setSearchEngine(engine.url);
    toast(`${engine.name} set as default search engine`);
  };

  const handleToggleSearchSuggestions = () => {
    setSearchSuggestions(!showSearchSuggestions);
    setShowSearchSuggestions(!showSearchSuggestions);
    toast(`Search suggestions ${showSearchSuggestions ? "disabled" : "enabled"}`);
  };

  const handleToggleSearchHistory = () => {
    setSaveSearchHistory(!showSearchHistory);
    setShowSearchHistory(!showSearchHistory);
    toast(`Search history ${saveSearchHistory ? "disabled" : "enabled"}`);
  };

  const handleSelectSearchProvider = (provider: "serper" | "you") => {
    // This is a placeholder, replace with actual logic to change search provider
    // For example, you might want to store the selected provider in local storage
    // and use it in your search API calls.
    toast(`Search provider changed to ${provider === "serper" ? "Serper" : "You.com"}`);
  };

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        <Card>
          <CardHeader>
            <CardTitle>Search Engine</CardTitle>
          </CardHeader>
          <CardContent className="pl-8 sm:pl-12">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="searchEngine">Default Search Engine</Label>
                <Select value={searchEngine} onValueChange={handleSaveSearchEngine}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select engine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="duckduckgo">DuckDuckGo</SelectItem>
                    <SelectItem value="bing">Bing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Search Engines</CardTitle>
          </CardHeader>
          <CardContent className="pl-8 sm:pl-12">
            <div className="grid gap-4">
              {customSearchEngines.map((engine) => (
                <div key={engine.id} className="flex items-center justify-between">
                  <span>{engine.name}</span>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={() => handleMakeDefault(engine)}>
                      Make Default
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleRemoveCustomEngine(engine.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="Engine Name"
                  value={newEngineName}
                  onChange={(e) => setNewEngineName(e.target.value)}
                />
                <Input
                  type="url"
                  placeholder="Engine URL"
                  value={newEngineUrl}
                  onChange={(e) => setNewEngineUrl(e.target.value)}
                />
                <Button variant="outline" size="sm" onClick={handleAddCustomEngine}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Engine
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Search Preferences</CardTitle>
          </CardHeader>
          <CardContent className="pl-8 sm:pl-12">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="safeSearch">Safe Search</Label>
                <Switch id="safeSearch" checked={safeSearch} onCheckedChange={handleToggleSafeSearch} />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="searchSuggestions">Search Suggestions</Label>
                <Switch
                  id="searchSuggestions"
                  checked={showSearchSuggestions}
                  onCheckedChange={handleToggleSearchSuggestions}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="searchHistory">Save Search History</Label>
                <Switch id="searchHistory" checked={showSearchHistory} onCheckedChange={handleToggleSearchHistory} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardContent className="pl-8 sm:pl-12">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <Select onValueChange={setTheme} defaultValue={localStorage.getItem("theme") || "system"}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="pl-8 sm:pl-12">
            <Button variant="destructive" onClick={handleResetSearchHistory}>
              <Reset className="h-4 w-4 mr-2" />
              Reset Search History
            </Button>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
};

export default SettingsSearch;
