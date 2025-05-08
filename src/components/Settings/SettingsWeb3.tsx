
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const SettingsWeb3: React.FC = () => {
  const [walletNotifications, setWalletNotifications] = useState(true);
  const [defaultNetwork, setDefaultNetwork] = useState("ethereum");
  const [autoConnectDapps, setAutoConnectDapps] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Web3</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure blockchain and wallet settings
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-3">Default network</h3>
          <Select value={defaultNetwork} onValueChange={setDefaultNetwork}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select default blockchain network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="solana">Solana</SelectItem>
              <SelectItem value="bsc">BNB Smart Chain</SelectItem>
              <SelectItem value="avalanche">Avalanche</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Wallet</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Transaction notifications</p>
              <p className="text-xs text-muted-foreground">
                Receive notifications about wallet transactions
              </p>
            </div>
            <Switch 
              checked={walletNotifications}
              onCheckedChange={setWalletNotifications}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Auto-connect to dApps</p>
              <p className="text-xs text-muted-foreground">
                Automatically connect wallet to decentralized applications
              </p>
            </div>
            <Switch 
              checked={autoConnectDapps}
              onCheckedChange={setAutoConnectDapps}
            />
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Advanced blockchain settings</h3>
          <Collapsible
            open={isDetailsOpen}
            onOpenChange={setIsDetailsOpen}
            className="border rounded-md p-2"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Custom RPC endpoints</h4>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  <ChevronDown className="h-4 w-4" />
                  <span className="sr-only">Toggle</span>
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent className="pt-2">
              <p className="text-xs text-muted-foreground mb-2">
                Configure custom RPC endpoints for each network. This is for advanced users only.
              </p>
              <div className="bg-muted p-2 rounded text-xs">
                <code>https://mainnet.infura.io/v3/your-api-key</code>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default SettingsWeb3;
