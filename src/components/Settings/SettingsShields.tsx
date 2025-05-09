
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
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Eye, 
  Fingerprint, 
  Code, 
  Cookie, 
  RefreshCw,
  MessageSquare,
  Globe,
  AlertTriangle
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const SettingsShields: React.FC = () => {
  const [adBlocking, setAdBlocking] = useState(true);
  const [trackerBlocking, setTrackerBlocking] = useState("standard");
  const [fingerprintingProtection, setFingerprintingProtection] = useState(true);
  const [scriptBlocking, setScriptBlocking] = useState(false);
  const [cookieControl, setCookieControl] = useState("block-third-party");
  
  const [socialMediaBlocking, setSocialMediaBlocking] = useState(true);
  const [httpsOnly, setHttpsOnly] = useState(true);
  const [webRTC, setWebRTC] = useState("default");
  
  // Calculate protection score based on settings
  const calculateProtectionScore = () => {
    let score = 0;
    
    if (adBlocking) score += 20;
    if (trackerBlocking === "aggressive") score += 20;
    else if (trackerBlocking === "standard") score += 15;
    else if (trackerBlocking === "minimal") score += 10;
    
    if (fingerprintingProtection) score += 15;
    if (scriptBlocking) score += 15;
    if (cookieControl === "block-all") score += 15;
    else if (cookieControl === "block-third-party") score += 10;
    
    if (socialMediaBlocking) score += 5;
    if (httpsOnly) score += 5;
    if (webRTC !== "default") score += 5;
    
    return score;
  };
  
  const protectionScore = calculateProtectionScore();
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium mb-2">Shields & Privacy</h2>
          <Badge 
            variant={protectionScore > 70 ? "default" : "outline"} 
            className={protectionScore > 70 ? "bg-green-600" : ""}
          >
            {protectionScore > 70 ? "Strong Protection" : "Basic Protection"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Configure protection against ads, trackers, and fingerprinting
        </p>
      </div>
      
      <Card className="border border-green-600/20">
        <CardHeader className="pb-2 bg-green-600/5">
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-green-600" />
            Protection Status
          </CardTitle>
          <CardDescription>
            Your current browser privacy and security level
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Protection Score</p>
              <p className="text-sm font-bold">{protectionScore}%</p>
            </div>
            <Progress value={protectionScore} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${adBlocking ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">Ad Blocking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${trackerBlocking !== "disabled" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">Tracker Blocking</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${fingerprintingProtection ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">Anti-Fingerprinting</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${cookieControl !== "allow-all" ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-xs">Cookie Protection</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="px-6 py-3 bg-green-600/5 border-t border-green-600/20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setAdBlocking(true);
              setTrackerBlocking("aggressive");
              setFingerprintingProtection(true);
              setCookieControl("block-third-party");
              setSocialMediaBlocking(true);
              setHttpsOnly(true);
            }}
            className="text-xs border-green-600/40 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <RefreshCw className="h-3 w-3 mr-2" />
            Enable Maximum Protection
          </Button>
        </CardFooter>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* First column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-500" />
                Ad & Tracker Blocking
              </CardTitle>
              <CardDescription>
                Control what content gets blocked while browsing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Block ads and trackers</p>
                  <p className="text-xs text-muted-foreground">
                    Blocks most ads and trackers across the web
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      checked={adBlocking}
                      onCheckedChange={setAdBlocking}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {adBlocking ? "Enabled" : "Disabled"}
                  </TooltipContent>
                </Tooltip>
              </div>
  
              <Separator />
  
              <div>
                <p className="text-sm font-medium mb-2">Tracker blocking level</p>
                <Select value={trackerBlocking} onValueChange={setTrackerBlocking}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tracker blocking level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aggressive">Aggressive - Block all trackers</SelectItem>
                    <SelectItem value="standard">Standard - Block most trackers</SelectItem>
                    <SelectItem value="minimal">Minimal - Block only invasive trackers</SelectItem>
                    <SelectItem value="disabled">Disabled - Don't block trackers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
  
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Social media blocking</p>
                  <p className="text-xs text-muted-foreground">
                    Block social media trackers and embedded content
                  </p>
                </div>
                <Switch 
                  checked={socialMediaBlocking}
                  onCheckedChange={setSocialMediaBlocking}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Fingerprint className="h-5 w-5 mr-2 text-purple-500" />
                Fingerprinting Protection
              </CardTitle>
              <CardDescription>
                Prevent websites from uniquely identifying your device
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Block fingerprinting attempts</p>
                  <p className="text-xs text-muted-foreground">
                    Helps prevent websites from identifying your unique browser and system configuration
                  </p>
                </div>
                <Switch 
                  checked={fingerprintingProtection}
                  onCheckedChange={setFingerprintingProtection}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Second column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-green-500" />
                Connection Security
              </CardTitle>
              <CardDescription>
                Control how your browser connects to websites
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">HTTPS-Only Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Upgrade connections to HTTPS when possible
                  </p>
                </div>
                <Switch 
                  checked={httpsOnly}
                  onCheckedChange={setHttpsOnly}
                />
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm font-medium mb-2">WebRTC IP handling policy</p>
                <RadioGroup value={webRTC} onValueChange={setWebRTC} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="default" id="webrtc-default" />
                    <Label htmlFor="webrtc-default" className="text-sm">Default (Use system settings)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="webrtc-public" />
                    <Label htmlFor="webrtc-public" className="text-sm">Public IP only (More private)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="disabled" id="webrtc-disabled" />
                    <Label htmlFor="webrtc-disabled" className="text-sm">Disable non-proxy UDP (Most private)</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Cookie className="h-5 w-5 mr-2 text-amber-500" />
                Cookie Controls
              </CardTitle>
              <CardDescription>
                Manage how websites can store and access cookies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={cookieControl} onValueChange={setCookieControl}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select cookie control level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="allow-all">Allow all cookies</SelectItem>
                  <SelectItem value="block-third-party">Block third-party cookies</SelectItem>
                  <SelectItem value="block-all">Block all cookies (may break sites)</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="h-5 w-5 mr-2 text-red-500" />
                Script Controls
              </CardTitle>
              <CardDescription>
                Manage JavaScript execution (advanced)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div>
                  <div className="flex items-center">
                    <p className="text-sm font-medium">Block JavaScript on unknown sites</p>
                    <Badge variant="outline" className="ml-2 text-xs bg-red-50 text-red-500 border-red-200">Advanced</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Improves security but may break website functionality
                  </p>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Switch 
                      checked={scriptBlocking}
                      onCheckedChange={setScriptBlocking}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    <AlertTriangle className="h-3 w-3 inline mr-1 text-amber-500" />
                    Warning: May break many websites
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsShields;
