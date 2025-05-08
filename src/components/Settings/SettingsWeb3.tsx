
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, Wallet, Plus, Shield } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SettingsWeb3: React.FC = () => {
  const [walletNotifications, setWalletNotifications] = useState(true);
  const [defaultNetwork, setDefaultNetwork] = useState("ethereum");
  const [autoConnectDapps, setAutoConnectDapps] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showTestNetworks, setShowTestNetworks] = useState(false);
  const [ipfsGateway, setIpfsGateway] = useState("ipfs.io");
  const [gasPreference, setGasPreference] = useState("standard");
  const [securityLevel, setSecurityLevel] = useState("standard");
  const [transactionApproval, setTransactionApproval] = useState(true);

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
          
          <div className="flex justify-between items-center mt-3">
            <div>
              <p className="text-sm">Show test networks</p>
              <p className="text-xs text-muted-foreground">
                Display testnets like Goerli and Sepolia
              </p>
            </div>
            <Switch 
              checked={showTestNetworks}
              onCheckedChange={setShowTestNetworks}
            />
          </div>
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
          
          <div className="flex justify-between items-center mb-3">
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
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Transaction approval confirmation</p>
              <p className="text-xs text-muted-foreground">
                Require confirmation before sending transactions
              </p>
            </div>
            <Switch 
              checked={transactionApproval}
              onCheckedChange={setTransactionApproval}
            />
          </div>
          
          <div className="mt-3">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Wallet className="h-4 w-4 mr-1" />
              Connect new wallet
            </Button>
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Transaction settings</h3>
          <div className="mb-4">
            <p className="text-sm mb-2">Gas price preference</p>
            <RadioGroup value={gasPreference} onValueChange={setGasPreference}>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="slow" id="gas-slow" />
                <Label htmlFor="gas-slow">Slow (lowest cost)</Label>
              </div>
              <div className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value="standard" id="gas-standard" />
                <Label htmlFor="gas-standard">Standard (recommended)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fast" id="gas-fast" />
                <Label htmlFor="gas-fast">Fast (highest cost)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">IPFS Gateway</h3>
          <Select value={ipfsGateway} onValueChange={setIpfsGateway}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select IPFS gateway" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ipfs.io">ipfs.io</SelectItem>
              <SelectItem value="cloudflare-ipfs.com">cloudflare-ipfs.com</SelectItem>
              <SelectItem value="dweb.link">dweb.link</SelectItem>
              <SelectItem value="gateway.pinata.cloud">gateway.pinata.cloud</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Security level</h3>
          <RadioGroup value={securityLevel} onValueChange={setSecurityLevel}>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="standard" id="security-standard" />
              <Label htmlFor="security-standard">
                <span className="flex flex-col">
                  <span>Standard</span>
                  <span className="text-xs text-muted-foreground">Default security for most users</span>
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value="strict" id="security-strict" />
              <Label htmlFor="security-strict">
                <span className="flex flex-col">
                  <span>Strict</span>
                  <span className="text-xs text-muted-foreground">Verify contract addresses and request approvals</span>
                </span>
              </Label>
            </div>
          </RadioGroup>
          
          <div className="mt-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Shield className="h-4 w-4 mr-1" />
              Manage security settings
            </Button>
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
            <CollapsibleContent className="pt-2 space-y-3">
              <p className="text-xs text-muted-foreground mb-2">
                Configure custom RPC endpoints for each network. This is for advanced users only.
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-sm w-24">Ethereum:</span>
                  <Input 
                    className="h-8 text-xs" 
                    defaultValue="https://mainnet.infura.io/v3/your-api-key" 
                  />
                </div>
                <div className="flex items-center">
                  <span className="text-sm w-24">Polygon:</span>
                  <Input 
                    className="h-8 text-xs" 
                    defaultValue="https://polygon-rpc.com" 
                  />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add custom RPC
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};

export default SettingsWeb3;
