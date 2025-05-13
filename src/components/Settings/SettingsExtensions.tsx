
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SettingsIcon, Shield, Download, ExternalLink } from "lucide-react";

interface ExtensionItemProps {
  name: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

const ExtensionItem: React.FC<ExtensionItemProps> = ({ 
  name, 
  description, 
  enabled, 
  onToggle 
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleExtensionSettings = () => {
    toast({
      title: "Extension Settings",
      description: `Opening settings for ${name}`,
    });
  };
  
  // Function to determine the correct URL based on extension name
  const getExtensionUrl = () => {
    if (name === "GasSaver") {
      return "https://gasless-nexus-wave-watch.lovable.app/dashboard";
    }
    return "javascript:void(0)";
  };
  
  // Handle access extension click
  const handleAccessExtension = () => {
    const url = getExtensionUrl();
    
    if (url === "javascript:void(0)") {
      toast({
        title: "Extension not available",
        description: `${name} is not currently available for access.`,
      });
      return;
    }
    
    toast({
      title: "Opening Extension",
      description: `Loading ${name} in the browser...`,
    });
    
    // Navigate to /app with the URL as a parameter
    navigate(`/app?url=${encodeURIComponent(url)}`);
  };
  
  return (
    <div className="flex items-start justify-between py-3">
      <div className="flex-1">
        <div className="flex items-center">
          <span className="text-sm font-medium">{name}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        <Switch checked={enabled} onCheckedChange={onToggle} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleExtensionSettings}>
              <SettingsIcon className="mr-2 h-4 w-4" />
              Extension settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Extension permissions
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleAccessExtension}>
              <ExternalLink className="mr-2 h-4 w-4" />
              Access extension
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              Remove extension
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

const SettingsExtensions: React.FC = () => {
  const [extensions, setExtensions] = useState([
    { id: 1, name: "Nexus Ad Blocker", description: "Block ads and trackers", enabled: true },
    { id: 2, name: "MetaMask", description: "Ethereum wallet and dApp browser", enabled: true },
    { id: 3, name: "Web3 Inspector", description: "Inspect blockchain transactions", enabled: false },
    { id: 4, name: "GasSaver", description: "Ethereum gas price optimizer", enabled: true },
  ]);
  
  const [allowIncognito, setAllowIncognito] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const toggleExtension = (id: number) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ));
  };

  const handleBrowseExtensions = () => {
    // Navigate to the extension store
    navigate('/extension-store');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Extensions</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Manage and configure browser extensions
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleBrowseExtensions}>
            <Download className="h-4 w-4 mr-2" />
            Browse extensions
          </Button>
        </div>

        <div className="border rounded-md divide-y">
          {extensions.map(ext => (
            <ExtensionItem
              key={ext.id}
              name={ext.name}
              description={ext.description}
              enabled={ext.enabled}
              onToggle={() => toggleExtension(ext.id)}
            />
          ))}
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Extension Settings</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Allow in incognito mode</p>
                <p className="text-xs text-muted-foreground">
                  Enable extensions when browsing in incognito mode
                </p>
              </div>
              <Switch 
                checked={allowIncognito}
                onCheckedChange={setAllowIncognito}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm">Auto-update extensions</p>
                <p className="text-xs text-muted-foreground">
                  Automatically update extensions when new versions are available
                </p>
              </div>
              <Switch 
                checked={autoUpdate}
                onCheckedChange={setAutoUpdate}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Developer mode</h3>
          <p className="text-sm text-muted-foreground mb-2">
            Load unpacked extensions and access additional developer features
          </p>
          <Button variant="secondary" size="sm" className="mr-2">
            Load unpacked
          </Button>
          <Button variant="secondary" size="sm">
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsExtensions;
