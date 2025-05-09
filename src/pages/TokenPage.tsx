
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ChevronRight, Info, TrendingUp } from "lucide-react";

const TokenPage = () => {
  const [amount, setAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  const { toast } = useToast();

  const tokenPrice = 0.15; // $0.15 per token
  const tokensToReceive = amount ? parseFloat(amount) / tokenPrice : 0;

  const handleBuyTokens = () => {
    toast({
      title: "Purchase initiated",
      description: `You are purchasing ${tokensToReceive.toFixed(2)} $NWF3 tokens for $${amount}.`,
    });
    // In a real app, this would connect to a payment processor
  };

  const presetAmounts = [10, 25, 50, 100, 500];

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
        Purchase $NWF3 Tokens
      </h1>
      
      <div className="flex flex-col gap-8 md:flex-row">
        <Card className="flex-1 nexus-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Token Information
            </CardTitle>
            <CardDescription>
              $NWF3 is the utility token for the Nexus Wave ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Current Price</span>
              <span className="font-medium text-green-500">${tokenPrice.toFixed(2)} USD</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">24h Change</span>
              <span className="font-medium text-green-500">+5.32%</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Market Cap</span>
              <span className="font-medium">$14.5M USD</span>
            </div>
            
            <div className="bg-secondary/30 p-4 rounded-lg mt-4">
              <h3 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-nexus-purple" />
                Token Utility
              </h3>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-nexus-purple" /> Access premium browser extensions
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-nexus-purple" /> Reduce transaction fees in the ecosystem
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-nexus-purple" /> Participate in governance decisions
                </li>
                <li className="flex items-center gap-2">
                  <ChevronRight className="h-3 w-3 text-nexus-purple" /> Earn rewards through staking
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Buy $NWF3 Tokens</CardTitle>
            <CardDescription>
              Enter the amount you wish to spend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Select amount (USD)
              </label>
              <div className="flex flex-wrap gap-2 mb-4">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    className={`${amount === preset.toString() ? 'bg-secondary border-nexus-purple' : ''}`}
                    onClick={() => setAmount(preset.toString())}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <Input
                type="number"
                placeholder="Custom amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
              <div className="mt-2 text-sm text-muted-foreground">
                You will receive approximately {tokensToReceive.toFixed(2)} $NWF3 tokens
              </div>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">
                Payment Method
              </label>
              <Tabs defaultValue="card" onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="card">Card</TabsTrigger>
                  <TabsTrigger value="crypto">Crypto</TabsTrigger>
                  <TabsTrigger value="bank">Bank</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Pay using your credit or debit card. Instant processing.
                  </div>
                </TabsContent>
                <TabsContent value="crypto" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Pay using BTC, ETH, or other major cryptocurrencies.
                  </div>
                </TabsContent>
                <TabsContent value="bank" className="mt-4">
                  <div className="text-sm text-muted-foreground">
                    Pay using bank transfer. Processing may take 1-3 business days.
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleBuyTokens}
              disabled={!amount || parseFloat(amount) <= 0}
              className="w-full bg-gradient-to-r from-nexus-purple to-nexus-light-purple hover:opacity-90"
            >
              Buy $NWF3 Tokens
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card className="mt-8 bg-secondary/30">
        <CardHeader>
          <CardTitle className="text-lg">Important Information</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Cryptocurrency investments involve risk. The value of $NWF3 tokens may fluctuate, and 
            you should only purchase tokens you can afford to lose. Please read our terms and 
            conditions before making any purchases.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TokenPage;
