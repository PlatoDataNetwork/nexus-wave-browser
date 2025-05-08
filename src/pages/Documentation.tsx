
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, BookText, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-8 bg-card border-b border-border">
        <h1 className="text-xs font-medium">Nexus Wave Browser - Documentation</h1>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card">
          <div className="p-4">
            <div className="flex items-center mb-4">
              <BookText className="h-5 w-5 mr-2 text-muted-foreground" />
              <h2 className="font-medium">Documentation</h2>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documentation"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs 
              defaultValue={activeTab} 
              value={activeTab}
              onValueChange={setActiveTab}
              orientation="vertical" 
              className="w-full"
            >
              <TabsList className="flex flex-col items-start justify-start h-auto gap-1 bg-transparent p-0">
                <TabsTrigger
                  value="overview"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Overview</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="getting-started"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Getting Started</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="features"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Features</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="web3"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Web3 Integration</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="privacy"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Privacy & Security</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Settings Guide</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="shortcuts"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Keyboard Shortcuts</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
                <TabsTrigger
                  value="troubleshooting"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Troubleshooting</span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="overview" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Nexus Wave Browser</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    A next-generation Web3-enabled browser with enhanced privacy features
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">About Nexus Wave</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Nexus Wave is a revolutionary browser built from the ground up with Web3 integration, 
                        privacy protection, and an intuitive user interface. It combines the speed and security of 
                        modern browsing with powerful blockchain features that make interacting with decentralized 
                        applications seamless and secure.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Version 2.1 introduces the Nexus Bridge for improved wallet connectivity, enhanced 
                        privacy shields, and a streamlined user interface designed for both crypto enthusiasts 
                        and everyday users.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-nexus-purple/20">
                      <CardContent className="p-6">
                        <h3 className="text-md font-medium mb-3">Key Features</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Web3 wallet integration via Nexus Bridge</li>
                          <li>• Enhanced privacy shields</li>
                          <li>• Decentralized application support</li>
                          <li>• Advanced bookmarking system</li>
                          <li>• Tab management with session saving</li>
                          <li>• Customizable user interface</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-nexus-purple/20">
                      <CardContent className="p-6">
                        <h3 className="text-md font-medium mb-3">Highlights</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Built-in crypto wallet connectivity</li>
                          <li>• Tracker blocking and fingerprint protection</li>
                          <li>• DApp-optimized browsing experience</li>
                          <li>• Protocol price ticker integration</li>
                          <li>• Cross-device synchronization</li>
                          <li>• Resource-efficient design</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="getting-started" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Getting Started with Nexus Wave</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to set up and start using the Nexus Wave browser effectively
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="installation">
                    <AccordionTrigger className="text-md font-medium">Installation</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>To install Nexus Wave Browser:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Download the installer from the official website</li>
                        <li>Run the installer and follow the on-screen instructions</li>
                        <li>Choose your installation directory</li>
                        <li>Select additional components (optional)</li>
                        <li>Complete the installation</li>
                      </ol>
                      <p className="mt-2">Nexus Wave is available for Windows, macOS, and Linux systems.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="initial-setup">
                    <AccordionTrigger className="text-md font-medium">Initial Setup</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>When you first launch Nexus Wave, you'll be guided through these setup steps:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Choose your default theme (Dark or Light)</li>
                        <li>Select your default search engine</li>
                        <li>Configure privacy shield settings</li>
                        <li>Set up bookmark synchronization (optional)</li>
                        <li>Connect your Web3 wallet (optional)</li>
                      </ol>
                      <p className="mt-2">You can change any of these settings later in the Settings menu.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="interface">
                    <AccordionTrigger className="text-md font-medium">Understanding the Interface</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>The Nexus Wave interface includes:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Address Bar:</strong> For URL entry and search</li>
                        <li><strong>Tab Bar:</strong> Displays and manages open tabs</li>
                        <li><strong>Bookmarks Bar:</strong> Quick access to saved sites</li>
                        <li><strong>Extensions Area:</strong> Access browser extensions</li>
                        <li><strong>Nexus Bridge Button:</strong> Connect to Web3 wallets</li>
                        <li><strong>Settings Button:</strong> Configure browser options</li>
                        <li><strong>Protocol Ticker:</strong> Shows current crypto prices</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="importing">
                    <AccordionTrigger className="text-md font-medium">Importing Data from Other Browsers</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>To import your data from another browser:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Go to Settings > Advanced</li>
                        <li>Click on "Import/Export"</li>
                        <li>Select "Import from browser"</li>
                        <li>Choose the browser you want to import from</li>
                        <li>Select the data types you wish to import (bookmarks, history, passwords, etc.)</li>
                        <li>Click "Import" to complete the process</li>
                      </ol>
                      <p className="mt-2">Supported browsers include Chrome, Firefox, Edge, and Brave.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="features" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Features & Functionality</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Explore the powerful features that make Nexus Wave unique
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Tab Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Nexus Wave provides advanced tab management features to keep your browsing organized:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Drag and drop to reorder tabs</li>
                        <li>Tab grouping for better organization</li>
                        <li>Session saving for later restoration</li>
                        <li>Vertical tab layout option</li>
                        <li>Tab search functionality</li>
                        <li>Memory-efficient tab suspension</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Bookmarks System</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        The bookmark system in Nexus Wave offers flexible organization options:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Hierarchical folder structure</li>
                        <li>Tags for cross-categorization</li>
                        <li>Bookmark search with filters</li>
                        <li>Cross-device synchronization</li>
                        <li>Import/export capabilities</li>
                        <li>Quick bookmark creation with keyboard shortcuts</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Extensions Support</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Nexus Wave supports a wide range of extensions to enhance your browsing experience:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Compatible with Chrome Web Store extensions</li>
                        <li>Built-in extension manager</li>
                        <li>Security verification for extensions</li>
                        <li>Resource usage monitoring</li>
                        <li>Extension-specific permissions</li>
                        <li>Web3-specific extension support</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">History Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Nexus Wave's history features help you track and revisit your browsing activity:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Chronological and categorical views</li>
                        <li>Advanced search and filtering</li>
                        <li>Selective history deletion</li>
                        <li>Browsing insights and statistics</li>
                        <li>Private browsing mode (no history recording)</li>
                        <li>History synchronization across devices</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border-nexus-purple/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Performance Optimization</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Nexus Wave is designed for speed and efficiency with features like:
                    </p>
                    <ul className="text-sm text-muted-foreground grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5">
                      <li>Hardware acceleration</li>
                      <li>Resource-efficient memory management</li>
                      <li>Automatic tab discarding for inactive tabs</li>
                      <li>Parallel downloading</li>
                      <li>Optimized cache management</li>
                      <li>Process isolation for stability</li>
                      <li>GPU acceleration for Web3 applications</li>
                      <li>Network optimizations</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="web3" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Web3 Integration</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn about Nexus Wave's powerful blockchain and Web3 features
                  </p>
                </div>

                <Card className="border-nexus-purple/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Nexus Bridge</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Nexus Bridge is a proprietary technology that connects your browser directly to blockchain networks, providing:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                      <li>Seamless wallet integration without extensions</li>
                      <li>Support for multiple blockchain networks</li>
                      <li>Enhanced transaction security</li>
                      <li>Built-in transaction verification</li>
                      <li>Gas optimization features</li>
                    </ul>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Wallet Connectivity</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Connect with popular Web3 wallets:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>MetaMask</li>
                        <li>WalletConnect</li>
                        <li>Coinbase Wallet</li>
                        <li>Trust Wallet</li>
                        <li>Phantom</li>
                        <li>Ledger Live</li>
                        <li>And more...</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Supported Networks</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Nexus Wave supports these blockchain networks:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Ethereum and EVM-compatible chains</li>
                        <li>Solana</li>
                        <li>Polkadot ecosystem</li>
                        <li>Cosmos ecosystem</li>
                        <li>Bitcoin</li>
                        <li>Layer 2 solutions (Optimism, Arbitrum)</li>
                        <li>And more being added regularly</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="dapps">
                    <AccordionTrigger className="text-md font-medium">DApp Interaction</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Nexus Wave provides enhanced experiences with decentralized applications:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Transaction Previews:</strong> See exactly what a transaction will do before signing</li>
                        <li><strong>Risk Assessments:</strong> Automated security checks for DApp interactions</li>
                        <li><strong>Gas Optimization:</strong> AI-powered suggestions for optimal gas fees</li>
                        <li><strong>Connection Management:</strong> Control which DApps can access your wallet</li>
                        <li><strong>Contract Verification:</strong> Automatic verification of smart contract code</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="protocol-ticker">
                    <AccordionTrigger className="text-md font-medium">Protocol Ticker</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>The built-in protocol ticker provides:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Real-time price updates for major cryptocurrencies</li>
                        <li>Customizable watchlist for tokens of interest</li>
                        <li>Price alerts and notifications</li>
                        <li>Historical price data visualization</li>
                        <li>Market trends and indicators</li>
                      </ul>
                      <p className="mt-2">Data is sourced from multiple exchanges to ensure accuracy and reliability.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="web3-settings">
                    <AccordionTrigger className="text-md font-medium">Web3 Settings</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Customize your Web3 experience with these settings:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Default Network:</strong> Choose your primary blockchain network</li>
                        <li><strong>RPC Configuration:</strong> Custom RPC endpoints for specific networks</li>
                        <li><strong>Auto-Connect:</strong> Manage automatic wallet connections for trusted sites</li>
                        <li><strong>Transaction Confirmations:</strong> Set confirmation requirements based on value</li>
                        <li><strong>Gas Settings:</strong> Configure default gas price strategies</li>
                      </ul>
                      <p className="mt-2">These settings can be found in Settings > Web3.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="privacy" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Privacy & Security</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Discover how Nexus Wave protects your privacy and keeps you secure online
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Shields</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Nexus Shield is our comprehensive privacy protection system that includes:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Tracker Blocking</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>Blocks third-party tracking scripts</li>
                            <li>Prevents cross-site tracking cookies</li>
                            <li>Disables tracking pixels</li>
                            <li>Customizable blocking levels</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Fingerprint Protection</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>Canvas fingerprinting protection</li>
                            <li>WebRTC IP masking</li>
                            <li>User agent randomization</li>
                            <li>Hardware information concealment</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Advanced Features</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>HTTPS Everywhere encryption</li>
                            <li>Script blocking options</li>
                            <li>Cookie management</li>
                            <li>Referrer policy controls</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Site-Specific Controls</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>Per-site shield customization</li>
                            <li>Temporary permission granting</li>
                            <li>Shield statistics and reporting</li>
                            <li>Easy toggle for trusted sites</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Security Features</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Nexus Wave implements multiple security layers to protect your browsing:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Safe Browsing</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>Phishing site detection</li>
                            <li>Malware download prevention</li>
                            <li>Suspicious site warnings</li>
                            <li>Real-time threat updates</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Connection Security</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>DNS over HTTPS (DoH) support</li>
                            <li>Transport Layer Security (TLS) validation</li>
                            <li>Certificate transparency checking</li>
                            <li>Mixed content blocking</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Web3 Security</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>Smart contract security scanning</li>
                            <li>Phishing-resistant wallet connections</li>
                            <li>Transaction validation warnings</li>
                            <li>Security ratings for DApps</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium mb-2">Data Protection</h4>
                          <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                            <li>End-to-end encrypted sync</li>
                            <li>Secure password storage</li>
                            <li>Auto-clear browsing data options</li>
                            <li>Private browsing mode</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="private-browsing">
                    <AccordionTrigger className="text-md font-medium">Private Browsing Mode</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Nexus Wave's private browsing mode provides enhanced privacy by:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Not saving browsing history, cookies, or site data</li>
                        <li>Preventing trackers from following you across sites</li>
                        <li>Blocking third-party cookies by default</li>
                        <li>Preventing sites from accessing local storage</li>
                        <li>Clearing all session data when closed</li>
                      </ul>
                      <p className="mt-2">To activate, click the menu button and select "New Private Window" or use Ctrl+Shift+N (Cmd+Shift+N on Mac).</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="password-management">
                    <AccordionTrigger className="text-md font-medium">Password Management</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Nexus Wave includes a secure password manager that offers:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li>Encrypted password storage</li>
                        <li>Password generator for strong, unique passwords</li>
                        <li>Auto-fill capability for forms and login pages</li>
                        <li>Password health check to identify weak or compromised passwords</li>
                        <li>Optional biometric authentication for accessing passwords</li>
                        <li>Import/export functionality to migrate from other password managers</li>
                      </ul>
                      <p className="mt-2">Access your password manager in Settings > Autofill > Manage saved passwords.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="settings" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Settings Guide</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Comprehensive guide to configuring Nexus Wave to your preferences
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="appearance">
                    <AccordionTrigger className="text-md font-medium">Appearance Settings</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Customize how Nexus Wave looks with these options:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Theme:</strong> Choose between Light, Dark, or System-based themes</li>
                        <li><strong>Page Zoom:</strong> Set your default zoom level for websites</li>
                        <li><strong>Bookmarks Bar:</strong> Toggle visibility and customize appearance</li>
                        <li><strong>Home Button:</strong> Show or hide the home button on the toolbar</li>
                        <li><strong>Tab Appearance:</strong> Customize the look and behavior of tabs</li>
                        <li><strong>Custom Fonts:</strong> Choose preferred fonts for website display</li>
                      </ul>
                      <p className="mt-2">Access these settings in Settings > Appearance.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="privacy-settings">
                    <AccordionTrigger className="text-md font-medium">Privacy & Security Settings</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Configure your privacy and security preferences:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Content Blocking:</strong> Control trackers, cookies, and scripts</li>
                        <li><strong>HTTPS-Only Mode:</strong> Enforce secure connections</li>
                        <li><strong>Permission Management:</strong> Control site access to camera, location, etc.</li>
                        <li><strong>Cookie Settings:</strong> Manage how cookies are stored and used</li>
                        <li><strong>Safe Browsing:</strong> Configure protection against dangerous sites</li>
                        <li><strong>Privacy Reports:</strong> View and manage your privacy protection statistics</li>
                      </ul>
                      <p className="mt-2">Access these settings in Settings > Privacy and security.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="extensions-settings">
                    <AccordionTrigger className="text-md font-medium">Extensions Settings</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Manage your browser extensions:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Install Extensions:</strong> Browse and install from the extensions store</li>
                        <li><strong>Extension Permissions:</strong> Review and adjust what extensions can access</li>
                        <li><strong>Update Management:</strong> Control how extensions update</li>
                        <li><strong>Extension Shortcuts:</strong> Configure keyboard shortcuts for extensions</li>
                        <li><strong>Developer Mode:</strong> Enable developer options for extension testing</li>
                      </ul>
                      <p className="mt-2">Access these settings in Settings > Extensions.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="web3-settings-detail">
                    <AccordionTrigger className="text-md font-medium">Web3 Settings</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Configure your Web3 experience:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Default Network:</strong> Set your primary blockchain network</li>
                        <li><strong>Wallet Connections:</strong> Manage wallet integrations</li>
                        <li><strong>Transaction Confirmations:</strong> Set confirmation requirements</li>
                        <li><strong>Gas Settings:</strong> Configure default gas price strategies</li>
                        <li><strong>Custom RPCs:</strong> Add and manage RPC endpoints</li>
                        <li><strong>Token Lists:</strong> Manage token visibility and custom tokens</li>
                      </ul>
                      <p className="mt-2">Access these settings in Settings > Web3.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="advanced-settings">
                    <AccordionTrigger className="text-md font-medium">Advanced Settings</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>Fine-tune advanced browser functionality:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>System Integration:</strong> Configure how Nexus Wave interacts with your OS</li>
                        <li><strong>Hardware Acceleration:</strong> Enable/disable GPU acceleration</li>
                        <li><strong>Network Settings:</strong> Configure proxy and DNS settings</li>
                        <li><strong>Memory Management:</strong> Control how memory is allocated and used</li>
                        <li><strong>Developer Tools:</strong> Access and configure developer features</li>
                        <li><strong>Experimental Features:</strong> Try out features still in development</li>
                      </ul>
                      <p className="mt-2">Access these settings in Settings > Advanced.</p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

              <TabsContent value="shortcuts" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Keyboard Shortcuts</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Master Nexus Wave with these time-saving keyboard shortcuts
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Navigation Shortcuts</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Back</span>
                          <span className="text-sm text-muted-foreground">Alt + ←</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Forward</span>
                          <span className="text-sm text-muted-foreground">Alt + →</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Reload</span>
                          <span className="text-sm text-muted-foreground">Ctrl + R</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Home</span>
                          <span className="text-sm text-muted-foreground">Alt + Home</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Focus Address Bar</span>
                          <span className="text-sm text-muted-foreground">Ctrl + L</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Find in Page</span>
                          <span className="text-sm text-muted-foreground">Ctrl + F</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Tab Management</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">New Tab</span>
                          <span className="text-sm text-muted-foreground">Ctrl + T</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Close Tab</span>
                          <span className="text-sm text-muted-foreground">Ctrl + W</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Reopen Closed Tab</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + T</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Next Tab</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Tab</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Previous Tab</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + Tab</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Go to Tab (1-8)</span>
                          <span className="text-sm text-muted-foreground">Ctrl + 1-8</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Web3 Shortcuts</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Open Wallet Connect</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + W</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">View Connected Sites</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + C</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Toggle Protocol Ticker</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + P</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">View Transaction History</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + H</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-nexus-purple/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">General Shortcuts</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm">Settings</span>
                          <span className="text-sm text-muted-foreground">Ctrl + ,</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">History</span>
                          <span className="text-sm text-muted-foreground">Ctrl + H</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Bookmarks</span>
                          <span className="text-sm text-muted-foreground">Ctrl + B</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Private Browsing</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + N</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm">Extensions</span>
                          <span className="text-sm text-muted-foreground">Ctrl + Shift + E</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="troubleshooting" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Troubleshooting</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Solutions for common issues you may encounter with Nexus Wave
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="performance">
                    <AccordionTrigger className="text-md font-medium">Performance Issues</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>If Nexus Wave is running slowly, try these solutions:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Update the browser</strong> to the latest version</li>
                        <li><strong>Clear browsing data</strong> in Settings > Advanced > Clear browsing data</li>
                        <li><strong>Disable unused extensions</strong> that may be consuming resources</li>
                        <li><strong>Enable hardware acceleration</strong> in Settings > Advanced > System</li>
                        <li><strong>Check your computer's resources</strong> in Task Manager/Activity Monitor</li>
                        <li><strong>Close unnecessary tabs</strong> to free up memory</li>
                      </ol>
                      <p className="mt-2">If problems persist, try resetting browser settings in Settings > Advanced > Reset settings.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="wallet-connection">
                    <AccordionTrigger className="text-md font-medium">Wallet Connection Issues</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>If you're having trouble connecting your Web3 wallet:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Ensure your wallet is unlocked</strong> before attempting connection</li>
                        <li><strong>Check network settings</strong> in both your wallet and Nexus Bridge</li>
                        <li><strong>Verify permissions</strong> for the specific site you're using</li>
                        <li><strong>Clear site data</strong> for the specific DApp experiencing issues</li>
                        <li><strong>Try disconnecting and reconnecting</strong> the wallet</li>
                        <li><strong>Update your wallet software</strong> to the latest version</li>
                      </ol>
                      <p className="mt-2">For persistent issues, check the connection logs in Settings > Web3 > Connection logs.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="website-compatibility">
                    <AccordionTrigger className="text-md font-medium">Website Compatibility Issues</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>If a website isn't displaying or functioning correctly:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Temporarily disable shields</strong> by clicking the shield icon in the address bar</li>
                        <li><strong>Check if it works in private browsing mode</strong> to rule out extension conflicts</li>
                        <li><strong>Clear cookies and site data</strong> for the specific site</li>
                        <li><strong>Try using compatibility mode</strong> from the site settings menu</li>
                        <li><strong>Check if the site is up-to-date</strong> with modern web standards</li>
                        <li><strong>Report the issue</strong> to help improve compatibility</li>
                      </ol>
                      <p className="mt-2">For specific DApps, check the Web3 compatibility list in Settings > Web3 > Compatible DApps.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="crashes">
                    <AccordionTrigger className="text-md font-medium">Browser Crashes and Freezes</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>If Nexus Wave crashes or freezes frequently:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Update to the latest version</strong> to fix known bugs</li>
                        <li><strong>Disable problematic extensions</strong> one by one to identify issues</li>
                        <li><strong>Clear all browsing data</strong> including cache and cookies</li>
                        <li><strong>Check for malware or viruses</strong> on your system</li>
                        <li><strong>Reset browser settings</strong> to default in Settings > Advanced</li>
                        <li><strong>Reinstall the browser</strong> if problems persist</li>
                      </ol>
                      <p className="mt-2">For technical users, check crash reports in Settings > Advanced > Crash reports.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="sync-issues">
                    <AccordionTrigger className="text-md font-medium">Sync Issues</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>If your bookmarks, passwords, or settings aren't syncing correctly:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li><strong>Verify your account status</strong> in Settings > Sync</li>
                        <li><strong>Check which sync categories are enabled</strong> in sync settings</li>
                        <li><strong>Force a manual sync</strong> by clicking "Sync now"</li>
                        <li><strong>Sign out and sign back in</strong> to refresh your connection</li>
                        <li><strong>Check your internet connection</strong> as sync requires connectivity</li>
                        <li><strong>Reset sync</strong> as a last resort (will require setting up sync again)</li>
                      </ol>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Card className="border-nexus-purple/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Getting Additional Help</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      If you're still experiencing issues, here are additional resources:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-3 list-disc pl-5">
                      <li><strong>Community Forums:</strong> Connect with other users to discuss solutions</li>
                      <li><strong>Knowledge Base:</strong> Search our extensive documentation for answers</li>
                      <li><strong>Customer Support:</strong> Contact our dedicated support team</li>
                      <li><strong>Discord Community:</strong> Join our active Discord server for real-time help</li>
                      <li><strong>Bug Reports:</strong> Submit detailed bug reports to help us improve</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>

      <div className="flex justify-between p-4 border-t border-border bg-card">
        <Button asChild variant="outline">
          <Link to="/settings">View Settings</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/">Return to Browser</Link>
        </Button>
      </div>
    </div>
  );
};

export default Documentation;
