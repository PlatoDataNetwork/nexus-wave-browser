
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SettingsAppearance: React.FC = () => {
  const [theme, setTheme] = useState("system");
  const [showBookmarksBar, setShowBookmarksBar] = useState(true);
  const [bookmarksBarDisplay, setBookmarksBarDisplay] = useState<"visible" | "minimized" | "hidden">("visible");
  const [showHomeButton, setShowHomeButton] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Appearance</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Customize how your browser looks
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-2">Theme</h3>
          <RadioGroup value={theme} onValueChange={setTheme}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="light" id="theme-light" />
              <Label htmlFor="theme-light">Light</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="dark" id="theme-dark" />
              <Label htmlFor="theme-dark">Dark</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="theme-system" />
              <Label htmlFor="theme-system">Use system theme</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Page zoom</h3>
          <p className="text-sm text-muted-foreground">100% (Recommended)</p>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Customize toolbar</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Show bookmarks bar</p>
                <p className="text-xs text-muted-foreground">
                  Show websites you've bookmarked
                </p>
              </div>
              <Switch 
                checked={showBookmarksBar}
                onCheckedChange={setShowBookmarksBar}
              />
            </div>
            
            {showBookmarksBar && (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm">Bookmarks bar display</p>
                  <p className="text-xs text-muted-foreground">
                    Choose how the bookmarks bar appears
                  </p>
                </div>
                <Select 
                  value={bookmarksBarDisplay}
                  onValueChange={(value) => setBookmarksBarDisplay(value as "visible" | "minimized" | "hidden")}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select display mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visible">Full (Default)</SelectItem>
                    <SelectItem value="minimized">Minimized</SelectItem>
                    <SelectItem value="hidden">Hidden</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Show home button</p>
                <p className="text-xs text-muted-foreground">
                  Go to your homepage with one click
                </p>
              </div>
              <Switch 
                checked={showHomeButton}
                onCheckedChange={setShowHomeButton}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsAppearance;
