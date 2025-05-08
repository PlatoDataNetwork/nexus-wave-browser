
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const SettingsShields: React.FC = () => {
  const [adBlocking, setAdBlocking] = useState("aggressive");
  const [trackerBlocking, setTrackerBlocking] = useState("standard");
  const [fingerprintingProtection, setFingerprintingProtection] = useState(true);
  const [scriptBlocking, setScriptBlocking] = useState(false);
  const [cookieControl, setCookieControl] = useState("block-third-party");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Shields & Privacy</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure protection against ads, trackers, and fingerprinting
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-3">Ad blocking</h3>
          <RadioGroup value={adBlocking} onValueChange={setAdBlocking}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="aggressive" id="ad-aggressive" />
              <Label htmlFor="ad-aggressive">Aggressive</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">?</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-xs">
                    Blocks all ads and trackers, but may cause some websites to break.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="standard" id="ad-standard" />
              <Label htmlFor="ad-standard">Standard</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0 ml-1">?</Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <p className="text-xs">
                    Blocks most ads and trackers while maintaining compatibility with most websites.
                  </p>
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="allow" id="ad-allow" />
              <Label htmlFor="ad-allow">Allow ads</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Tracker blocking</h3>
          <Select value={trackerBlocking} onValueChange={setTrackerBlocking}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select tracker blocking level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aggressive">Aggressive</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Fingerprinting protection</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Block fingerprinting attempts</p>
              <p className="text-xs text-muted-foreground">
                Helps prevent websites from identifying your device
              </p>
            </div>
            <Switch 
              checked={fingerprintingProtection}
              onCheckedChange={setFingerprintingProtection}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Script blocking</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Block JavaScript on unknown sites</p>
              <p className="text-xs text-muted-foreground">
                Improves security but may break website functionality
              </p>
            </div>
            <Switch 
              checked={scriptBlocking}
              onCheckedChange={setScriptBlocking}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Cookie controls</h3>
          <Select value={cookieControl} onValueChange={setCookieControl}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select cookie control level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="allow-all">Allow all cookies</SelectItem>
              <SelectItem value="block-third-party">Block third-party cookies</SelectItem>
              <SelectItem value="block-all">Block all cookies</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default SettingsShields;
