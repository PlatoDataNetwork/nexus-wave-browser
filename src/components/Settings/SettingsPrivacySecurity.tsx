
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Shield, Lock, Trash2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      description: "Browsing data cleared successfully",
    });
  };
  
  const handleClearCache = () => {
    toast({
      title: "Clear Cache",
      description: "Browser cache cleared successfully",
    });
  };
  
  const handleClearCookies = () => {
    toast({
      title: "Clear Cookies",
      description: "Browser cookies cleared successfully",
    });
  };
  
  const handleClearPasswords = () => {
    toast({
      title: "Clear Passwords",
      description: "Saved passwords cleared successfully",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Privacy and security</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage your data and security settings to protect your online privacy
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-blue-500" />
            Safe Browsing
          </CardTitle>
          <CardDescription>
            Features to protect you while browsing the web
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Protect against dangerous sites</p>
              <p className="text-xs text-muted-foreground">
                Get warnings about potentially harmful sites and phishing attempts
              </p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Switch 
                  checked={safeBrowsing}
                  onCheckedChange={setSafeBrowsing}
                />
              </TooltipTrigger>
              <TooltipContent>
                {safeBrowsing ? "Enabled" : "Disabled"}
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Do Not Track</p>
              <p className="text-xs text-muted-foreground">
                Send "Do Not Track" requests with browsing traffic (not honored by all websites)
              </p>
            </div>
            <Switch 
              checked={doNotTrack}
              onCheckedChange={setDoNotTrack}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Prefetch resources on page hover</p>
              <p className="text-xs text-muted-foreground">
                Speed up browsing by preloading linked pages when you hover over links
              </p>
            </div>
            <Switch 
              checked={prefetchSites}
              onCheckedChange={setPrefetchSites}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2 text-green-500" />
            Data & Passwords
          </CardTitle>
          <CardDescription>
            Control how your personal data is stored and managed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Password manager</p>
              <p className="text-xs text-muted-foreground">
                Nexus Wave can remember and auto-fill your passwords
              </p>
            </div>
            <Switch 
              checked={passwordSaving}
              onCheckedChange={setPasswordSaving}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Payment methods</p>
              <p className="text-xs text-muted-foreground">
                Auto-fill your payment details for faster checkout
              </p>
            </div>
            <Switch 
              checked={creditCardSaving}
              onCheckedChange={setCreditCardSaving}
            />
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Downloads</h4>
            <RadioGroup value={downloadLocation} onValueChange={setDownloadLocation} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ask" id="download-ask" />
                <Label htmlFor="download-ask" className="text-sm">Ask where to save each file before downloading</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="auto" id="download-auto" />
                <Label htmlFor="download-auto" className="text-sm">Save files to default download location</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Cookies</h4>
            <RadioGroup value={cookies} onValueChange={setCookies} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="allow-all" id="cookies-all" />
                <Label htmlFor="cookies-all" className="text-sm">Allow all cookies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="block-third-party" id="cookies-block-third" />
                <Label htmlFor="cookies-block-third" className="text-sm">Block third-party cookies</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="block-all" id="cookies-block-all" />
                <Label htmlFor="cookies-block-all" className="text-sm">Block all cookies</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trash2 className="h-5 w-5 mr-2 text-red-500" />
            Clear Browsing Data
          </CardTitle>
          <CardDescription>
            Remove stored information from your device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Clear your browsing history, cookies, cached images and files, passwords and more. This action cannot be undone.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={handleClearData} className="flex-1">
              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
              All Browsing Data
            </Button>
            <Button variant="outline" onClick={handleClearCookies} className="flex-1">
              Cookies
            </Button>
            <Button variant="outline" onClick={handleClearCache} className="flex-1">
              Cache
            </Button>
            <Button variant="outline" onClick={handleClearPasswords} className="flex-1">
              Passwords
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPrivacySecurity;
