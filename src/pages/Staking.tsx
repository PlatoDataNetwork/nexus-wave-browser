
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Shield, Award, TrendingUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Staking: React.FC = () => {
  return (
    <div className="min-h-screen bg-nexus-header-blue">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-nexus-blue text-nexus-light-blue bg-nexus-blue/10">
            Coming Soon
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            TMRW Staking
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Stake your TMRW tokens to earn rewards, secure the network, and unlock premium features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-nexus-header-blue border-white/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle className="text-lg">High APY</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Earn competitive staking rewards with attractive annual percentage yields.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-nexus-header-blue border-white/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle className="text-lg">Secure Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Help secure the TMRW network and earn rewards for your contribution.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-nexus-header-blue border-white/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle className="text-lg">Premium Access</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Unlock exclusive features and premium tools by staking your tokens.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-nexus-header-blue border-white/10">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-nexus-blue/20 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-nexus-blue" />
              </div>
              <CardTitle className="text-lg">Flexible Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400">
                Choose from various staking periods and unstaking options that fit your needs.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <Card className="bg-nexus-header-blue border-white/10">
            <CardHeader>
              <CardTitle>Staking Tiers</CardTitle>
              <CardDescription className="text-gray-400">
                Different staking amounts unlock various benefits and reward rates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-nexus-blue/10 rounded-lg">
                  <div>
                    <p className="font-medium">Bronze Tier</p>
                    <p className="text-sm text-gray-400">1,000+ TMRW</p>
                  </div>
                  <Badge variant="outline" className="border-yellow-500 text-yellow-500">5% APY</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-nexus-blue/10 rounded-lg">
                  <div>
                    <p className="font-medium">Silver Tier</p>
                    <p className="text-sm text-gray-400">10,000+ TMRW</p>
                  </div>
                  <Badge variant="outline" className="border-gray-400 text-gray-400">8% APY</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-nexus-blue/10 rounded-lg">
                  <div>
                    <p className="font-medium">Gold Tier</p>
                    <p className="text-sm text-gray-400">50,000+ TMRW</p>
                  </div>
                  <Badge variant="outline" className="border-yellow-600 text-yellow-600">12% APY</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-nexus-header-blue border-white/10">
            <CardHeader>
              <CardTitle>Staking Benefits</CardTitle>
              <CardDescription className="text-gray-400">
                Unlock these exclusive benefits by staking your TMRW tokens.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-nexus-blue"></div>
                  <span className="text-sm">Priority access to new features</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-nexus-blue"></div>
                  <span className="text-sm">Reduced transaction fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-nexus-blue"></div>
                  <span className="text-sm">Governance voting rights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-nexus-blue"></div>
                  <span className="text-sm">Exclusive community access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-nexus-blue"></div>
                  <span className="text-sm">Advanced analytics tools</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Card className="bg-nexus-header-blue border-white/10 max-w-2xl mx-auto">
            <CardHeader>
              <Lock className="h-16 w-16 text-nexus-blue mx-auto mb-4" />
              <CardTitle>Staking Platform Coming Soon</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-400 mb-6">
                The TMRW staking platform is currently in development. Get ready to earn rewards and unlock premium features.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/token">
                  <Button className="bg-nexus-blue hover:bg-nexus-deep-blue text-white">
                    Learn About TMRW Token
                  </Button>
                </Link>
                <Button variant="outline" className="border-nexus-blue text-nexus-light-blue hover:bg-nexus-blue/10">
                  Join Staking Waitlist
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Staking;
