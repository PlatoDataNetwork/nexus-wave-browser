
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
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
  const [adBlocking, setAdBlocking] = useState(true);
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
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Block ads and trackers</p>
              <p className="text-xs text-muted-foreground">
                Blocks most ads and trackers across the web
              </p>
            </div>
            <Switch 
              checked={adBlocking}
              onCheckedChange={setAdBlocking}
            />
          </div>
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
