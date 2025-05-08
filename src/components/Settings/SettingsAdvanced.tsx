
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const SettingsAdvanced: React.FC = () => {
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [backgroundApps, setBackgroundApps] = useState(false);
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
          <div className="flex justify-between items-center">
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
