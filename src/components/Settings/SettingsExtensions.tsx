
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ChevronDown, SettingsIcon } from "lucide-react";

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
          <div className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
            Installed
          </div>
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
  
  const { toast } = useToast();

  const toggleExtension = (id: number) => {
    setExtensions(extensions.map(ext => 
      ext.id === id ? { ...ext, enabled: !ext.enabled } : ext
    ));
  };

  const handleBrowseExtensions = () => {
    toast({
      title: "Extension Store",
      description: "Opening Nexus Wave extension store",
    });
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
