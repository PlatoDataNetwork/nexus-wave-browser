
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Upload } from "lucide-react";

const SettingsAdvanced: React.FC = () => {
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [backgroundApps, setBackgroundApps] = useState(false);
  const [startupMode, setStartupMode] = useState("restore");
  const [memoryUsage, setMemoryUsage] = useState("balanced");
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [smoothScrolling, setSmoothScrolling] = useState(true);
  const [tabDiscarding, setTabDiscarding] = useState(true);
  const [webGL, setWebGL] = useState(true);
  const { toast } = useToast();

  const handleResetSettings = () => {
    toast({
      title: "Settings reset",
      description: "All settings have been restored to default values",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Browser data cleared",
      description: "All browsing data has been cleared",
    });
  };
  
  const handleImportSettings = () => {
    toast({
      title: "Import Settings",
      description: "Select a file to import settings",
    });
  };
  
  const handleExportSettings = () => {
    toast({
      title: "Export Settings",
      description: "Settings exported to file",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Advanced</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure advanced browser settings
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-3">System</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Use hardware acceleration when available</p>
              <p className="text-xs text-muted-foreground">
                Uses GPU to accelerate browsing (requires restart)
              </p>
            </div>
            <Switch 
              checked={hardwareAcceleration}
              onCheckedChange={setHardwareAcceleration}
            />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">WebGL</p>
              <p className="text-xs text-muted-foreground">
                Enable hardware-accelerated graphics (recommended)
              </p>
            </div>
            <Switch 
              checked={webGL}
              onCheckedChange={setWebGL}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Smooth scrolling</p>
              <p className="text-xs text-muted-foreground">
                Enable smooth scrolling animation
              </p>
            </div>
            <Switch 
              checked={smoothScrolling}
              onCheckedChange={setSmoothScrolling}
            />
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Startup</h3>
          <Select value={startupMode} onValueChange={setStartupMode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose startup behavior" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restore">Restore previous session</SelectItem>
              <SelectItem value="homepage">Open homepage</SelectItem>
              <SelectItem value="newtab">Open new tab page</SelectItem>
              <SelectItem value="specific">Open specific pages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Memory management</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm">Automatically discard inactive tabs</p>
                <p className="text-xs text-muted-foreground">
                  Reduce memory usage by unloading background tabs
                </p>
              </div>
              <Switch 
                checked={tabDiscarding}
                onCheckedChange={setTabDiscarding}
              />
            </div>
            
            <div className="mb-2">
              <p className="text-sm mb-2">Memory usage</p>
              <Select value={memoryUsage} onValueChange={setMemoryUsage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select memory usage profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efficient">Efficient (lower memory usage)</SelectItem>
                  <SelectItem value="balanced">Balanced (recommended)</SelectItem>
                  <SelectItem value="performance">Performance (higher memory usage)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Background apps</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Continue running background apps when Nexus Wave is closed</p>
              <p className="text-xs text-muted-foreground">
                This may affect system performance
              </p>
            </div>
            <Switch 
              checked={backgroundApps}
              onCheckedChange={setBackgroundApps}
            />
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Experimental features</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Enable experimental features</p>
              <p className="text-xs text-muted-foreground">
                Try new features that are still in development (may be unstable)
              </p>
            </div>
            <Switch 
              checked={experimentalFeatures}
              onCheckedChange={setExperimentalFeatures}
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Import/Export</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Import or export your browser settings and data
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleImportSettings}>
              <Download className="h-4 w-4" />
              Import settings
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportSettings}>
              <Upload className="h-4 w-4" />
              Export settings
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Troubleshooting</h3>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="reset-settings">
              <AccordionTrigger className="text-sm py-2">Reset settings</AccordionTrigger>
              <AccordionContent>
                <p className="text-xs text-muted-foreground mb-3">
                  This will reset all Nexus Wave settings to their default values.
                </p>
                <Button variant="destructive" size="sm" onClick={handleResetSettings}>
                  Reset settings
                </Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="clear-data">
              <AccordionTrigger className="text-sm py-2">Clear browsing data</AccordionTrigger>
              <AccordionContent>
                <p className="text-xs text-muted-foreground mb-3">
                  This will clear all your browsing history, cookies, and site data.
                </p>
                <Button variant="destructive" size="sm" onClick={handleClearData}>
                  Clear data
                </Button>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdvanced;
