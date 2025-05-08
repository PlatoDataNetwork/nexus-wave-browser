
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ExtensionStore from "../Extensions/ExtensionStore";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SettingsIcon, Shield, Download } from "lucide-react";

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
  
  const handleExtensionSettings = () => {
    toast({
      title: "Extension Settings",
      description: `Opening settings for ${name}`,
    });
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
  ]);
  
  const [allowIncognito, setAllowIncognito] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  
  const { toast } = useToast();

  const toggleExtension = (id: number) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ));
  };

  const handleBrowseExtensions = () => {
    setIsStoreOpen(true);
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
          <Dialog open={isStoreOpen} onOpenChange={setIsStoreOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" onClick={handleBrowseExtensions}>
                <Download className="h-4 w-4 mr-2" />
                Browse extensions
              </Button>
            </DialogTrigger>
            <DialogContent className="p-0 border-none max-w-6xl h-[80vh]">
              <div className="flex items-center justify-center p-0 h-full overflow-auto">
                <ExtensionStore />
              </div>
            </DialogContent>
          </Dialog>
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
