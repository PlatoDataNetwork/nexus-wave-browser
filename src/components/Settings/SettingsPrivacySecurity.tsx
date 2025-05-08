
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SettingsPrivacySecurity: React.FC = () => {
  const [safeBrowsing, setSafeBrowsing] = useState(true);
  const [doNotTrack, setDoNotTrack] = useState(false);
  const [cookies, setCookies] = useState("allow-all");
  const [passwordSaving, setPasswordSaving] = useState(true);
  const [creditCardSaving, setCreditCardSaving] = useState(false);
  const [downloadLocation, setDownloadLocation] = useState("ask");
  const [prefetchSites, setPrefetchSites] = useState(true);
  
  const { toast } = useToast();
  
  const handleClearData = () => {
    toast({
      title: "Clear Data",
      description: "Clearing browsing data...",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Privacy and security</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your data and security settings
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-3">Safe Browsing</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Protect against dangerous sites</p>
              <p className="text-xs text-muted-foreground">
                Get warnings about potentially harmful sites
              </p>
            </div>
            <Switch 
              checked={safeBrowsing}
              onCheckedChange={setSafeBrowsing}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Do Not Track</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Send "Do Not Track" requests with browsing traffic</p>
              <p className="text-xs text-muted-foreground">
                Websites might still collect and use your browsing data
              </p>
            </div>
            <Switch 
              checked={doNotTrack}
              onCheckedChange={setDoNotTrack}
            />
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Password manager</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Offer to save passwords</p>
              <p className="text-xs text-muted-foreground">
                Nexus Wave can remember and auto-fill your passwords
              </p>
            </div>
            <Switch 
              checked={passwordSaving}
              onCheckedChange={setPasswordSaving}
            />
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Payment methods</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Save and fill payment methods</p>
              <p className="text-xs text-muted-foreground">
                Auto-fill your payment details for faster checkout
              </p>
            </div>
            <Switch 
              checked={creditCardSaving}
              onCheckedChange={setCreditCardSaving}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Link prefetching</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Prefetch resources on page hover</p>
              <p className="text-xs text-muted-foreground">
                Speed up browsing by preloading linked pages
              </p>
            </div>
            <Switch 
              checked={prefetchSites}
              onCheckedChange={setPrefetchSites}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Downloads</h3>
          <RadioGroup value={downloadLocation} onValueChange={setDownloadLocation}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="ask" id="download-ask" />
              <Label htmlFor="download-ask">Ask where to save each file before downloading</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="auto" id="download-auto" />
              <Label htmlFor="download-auto">Save files to default download location</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Cookies</h3>
          <RadioGroup value={cookies} onValueChange={setCookies}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="allow-all" id="cookies-all" />
              <Label htmlFor="cookies-all">Allow all cookies</Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="block-third-party" id="cookies-block-third" />
              <Label htmlFor="cookies-block-third">Block third-party cookies</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="block-all" id="cookies-block-all" />
              <Label htmlFor="cookies-block-all">Block all cookies</Label>
            </div>
          </RadioGroup>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Clear browsing data</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Clear your browsing history, cookies, cached images and files, passwords and more
          </p>
          <Button variant="outline" onClick={handleClearData}>Clear browsing data</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPrivacySecurity;
