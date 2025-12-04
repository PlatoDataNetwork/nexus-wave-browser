
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Token: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexus-space-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
            Coming Soon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            PLTO Token
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            The native utility token powering the Plato W3 AI Browser ecosystem. Stake, earn, and participate in governance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="bg-nexus-card-dark border-nexus-blue/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle>Utility Token</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Use PLTO tokens for premium features, gas optimization, and exclusive access to Web3 tools.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-nexus-card-dark border-nexus-blue/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle>Governance</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Participate in protocol governance and help shape the future of the Plato ecosystem.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-nexus-card-dark border-nexus-blue/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle>Rewards</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Earn PLTO tokens through browsing, staking, and contributing to the Web3 community.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-nexus-card-dark border-nexus-blue/10 max-w-2xl mx-auto">
            <CardHeader>
              <Lock className="h-16 w-16 text-nexus-blue mx-auto mb-4" />
              <CardTitle>Token Launch Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 mb-6">
                The PLTO token is currently in development. Join our community to be the first to know about the token launch and early access opportunities.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/app">
                  <Button className="bg-nexus-blue hover:bg-nexus-deep-blue text-white">
                    Try Plato W3 AI Browser
                  </Button>
                </Link>
                <Button variant="outline" className="border-nexus-blue text-nexus-light-blue hover:bg-nexus-blue/10">
                  Join Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Token;
