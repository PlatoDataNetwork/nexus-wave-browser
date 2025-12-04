
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, BookText, Search, ArrowLeft, Apple, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Layout/Header";

const Documentation: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState("overview");
  const [searchParams, setSearchParams] = useSearchParams();

  // Set initial tab based on URL search params
  React.useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["overview", "getting-started", "features", "installation", "web3", "privacy", "settings", "shortcuts", "troubleshooting"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchParams({ tab: value });
  };

  // Handle sidebar section selection
  const handleSectionClick = (section: string) => {
    handleTabChange(section);
  };

  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      
      {/* Page Title */}
      <div className="flex items-center justify-center h-10 bg-card border-b border-border">
        <h1 className="text-sm font-medium">Plato W3 AI Browser - Documentation</h1>
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
              onValueChange={handleTabChange}
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
                  value="installation"
                  className="w-full justify-between px-2 py-1.5 text-sm font-normal data-[state=active]:bg-accent data-[state=active]:text-accent-foreground"
                >
                  <span>Installation</span>
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
                  <h2 className="text-xl font-medium mb-2">Plato W3 AI Browser</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    A next-generation Web3-enabled browser with enhanced privacy features
                  </p>
                </div>

                <div className="space-y-6">
                  <Card className="border-nexus-blue/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">About Plato W3 AI Browser</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Plato W3 AI Browser is a revolutionary browser built from the ground up with Web3 integration, 
                        privacy protection, and an intuitive user interface. It combines the speed and security of 
                        modern browsing with powerful blockchain features that make interacting with decentralized 
                        applications seamless and secure.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Version 2.1 introduces the Plato Bridge for improved wallet connectivity, enhanced 
                        privacy shields, and a streamlined user interface designed for both crypto enthusiasts 
                        and everyday users.
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-nexus-blue/20">
                      <CardContent className="p-6">
                        <h3 className="text-md font-medium mb-3">Key Features</h3>
                        <ul className="text-sm text-muted-foreground space-y-2">
                          <li>• Web3 wallet integration via Plato Bridge</li>
                          <li>• Enhanced privacy shields</li>
                          <li>• Decentralized application support</li>
                          <li>• Advanced bookmarking system</li>
                          <li>• Tab management with session saving</li>
                          <li>• Customizable user interface</li>
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border-nexus-blue/20">
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
                  <h2 className="text-xl font-medium mb-2">Getting Started with Plato W3 AI Browser</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to set up and start using Plato W3 AI Browser effectively
                  </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="installation">
                    <AccordionTrigger className="text-md font-medium">Installation</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>To install Plato W3 AI Browser:</p>
                      <ol className="space-y-2 list-decimal pl-5">
                        <li>Download the installer from the official website</li>
                        <li>Run the installer and follow the on-screen instructions</li>
                        <li>Choose your installation directory</li>
                        <li>Select additional components (optional)</li>
                        <li>Complete the installation</li>
                      </ol>
                      <p className="mt-2">Plato W3 AI Browser is available for Windows, macOS, and Linux systems.</p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="initial-setup">
                    <AccordionTrigger className="text-md font-medium">Initial Setup</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <p>When you first launch Plato W3 AI Browser, you'll be guided through these setup steps:</p>
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
                      <p>The Plato W3 AI Browser interface includes:</p>
                      <ul className="space-y-2 list-disc pl-5">
                        <li><strong>Address Bar:</strong> For URL entry and search</li>
                        <li><strong>Tab Bar:</strong> Displays and manages open tabs</li>
                        <li><strong>Bookmarks Bar:</strong> Quick access to saved sites</li>
                        <li><strong>Extensions Area:</strong> Access browser extensions</li>
                        <li><strong>Plato Bridge Button:</strong> Connect to Web3 wallets</li>
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
                        <li>Go to Settings {'>'} Advanced</li>
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
                    Explore the powerful features that make Plato W3 AI Browser unique
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Card className="border-nexus-blue/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Tab Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Plato W3 AI Browser provides advanced tab management features to keep your browsing organized:
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

                  <Card className="border-nexus-blue/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Bookmarks System</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        The bookmark system in Plato W3 AI Browser offers flexible organization options:
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

                  <Card className="border-nexus-blue/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Extensions Support</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Plato W3 AI Browser supports a wide range of extensions to enhance your browsing experience:
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

                  <Card className="border-nexus-blue/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">History Management</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Plato W3 AI Browser's history features help you track and revisit your browsing activity:
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

                <Card className="border-nexus-blue/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Performance Optimization</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Plato W3 AI Browser is designed for speed and efficiency with features like:
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

              <TabsContent value="installation" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Plato W3 AI Browser Installation</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Detailed installation guidelines for different operating systems and platforms
                  </p>
                </div>

                <Card className="border-nexus-blue/20 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Plato W3 AI Browser Versions</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Plato W3 AI Browser is available as both a native application for various operating systems 
                      and as a web-based version. Choose the option that best suits your needs.
                    </p>
                  </CardContent>
                </Card>

                <Accordion type="single" collapsible className="w-full mb-6">
                  <AccordionItem value="macos">
                    <AccordionTrigger className="text-md font-medium">macOS Installation</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <h4 className="font-medium text-sm">System Requirements</h4>
                      <ul className="space-y-1 list-disc pl-5 mb-3">
                        <li>macOS 11.0 (Big Sur) or later</li>
                        <li>Apple Silicon (M1/M2) or Intel processor</li>
                        <li>4GB RAM minimum (8GB recommended)</li>
                        <li>500MB available storage</li>
                      </ul>
                      
                      <h4 className="font-medium text-sm mt-4">Installation Options</h4>
                      
                      <div className="space-y-3 mt-2">
                        <div>
                          <h5 className="font-medium">Option 1: App Store Download</h5>
                          <p className="mb-2">Download Plato W3 AI Browser directly from the Apple App Store for the simplest installation experience:</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Open the App Store on your Mac</li>
                            <li>Search for "Plato W3 AI Browser"</li>
                            <li>Click "Get" or the price button</li>
                            <li>Authenticate with your Apple ID if prompted</li>
                            <li>The app will download and install automatically</li>
                            <li>Launch from your Applications folder or Launchpad</li>
                          </ol>
                          <Button className="mt-3 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Apple className="h-4 w-4 mr-2" /> Download from App Store
                          </Button>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium">Option 2: Direct Download</h5>
                          <p className="mb-2">Download the installer package directly from our official website:</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Visit the official Plato W3 AI Browser website</li>
                            <li>Go to the Downloads section</li>
                            <li>Select the macOS version</li>
                            <li>Download the .dmg file</li>
                            <li>Open the downloaded file</li>
                            <li>Drag the Plato W3 AI Browser icon to your Applications folder</li>
                            <li>Right-click the app and select "Open" the first time to bypass Gatekeeper</li>
                          </ol>
                          <Button className="mt-3 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Download className="h-4 w-4 mr-2" /> Download Installer
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="windows">
                    <AccordionTrigger className="text-md font-medium">Windows PC Installation</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <h4 className="font-medium text-sm">System Requirements</h4>
                      <ul className="space-y-1 list-disc pl-5 mb-3">
                        <li>Windows 10 (64-bit) or Windows 11</li>
                        <li>Intel Core i3 / AMD Ryzen 3 processor or better</li>
                        <li>4GB RAM minimum (8GB recommended)</li>
                        <li>500MB available storage</li>
                        <li>DirectX 11 compatible graphics</li>
                      </ul>
                      
                      <h4 className="font-medium text-sm mt-4">Installation Options</h4>
                      
                      <div className="space-y-3 mt-2">
                        <div>
                          <h5 className="font-medium">Option 1: Microsoft Store</h5>
                          <p className="mb-2">Download Plato W3 AI Browser from the Microsoft Store for automatic updates:</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Open the Microsoft Store on your PC</li>
                            <li>Search for "Plato W3 AI Browser"</li>
                            <li>Click "Get" or "Install"</li>
                            <li>The app will download and install automatically</li>
                            <li>Launch from your Start menu</li>
                          </ol>
                          <Button className="mt-3 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Download className="h-4 w-4 mr-2" /> Get from Microsoft Store
                          </Button>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium">Option 2: Direct Installer</h5>
                          <p className="mb-2">Download the installer package directly from our official website:</p>
                          <ol className="list-decimal pl-5 space-y-1">
                            <li>Visit the official Plato W3 AI Browser website</li>
                            <li>Go to the Downloads section</li>
                            <li>Select the Windows version</li>
                            <li>Download the .exe installer</li>
                            <li>Run the installer with administrator privileges</li>
                            <li>Follow the installation wizard instructions</li>
                            <li>Choose your preferred installation location</li>
                            <li>Select additional components (optional)</li>
                            <li>Create desktop and Start menu shortcuts if desired</li>
                            <li>Complete the installation</li>
                          </ol>
                          <Button className="mt-3 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Download className="h-4 w-4 mr-2" /> Download Installer
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="linux">
                    <AccordionTrigger className="text-md font-medium">Linux Installation</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground space-y-3 p-2">
                      <h4 className="font-medium text-sm">System Requirements</h4>
                      <ul className="space-y-1 list-disc pl-5 mb-3">
                        <li>Ubuntu 20.04 or newer, Fedora 34 or newer, or other major distributions</li>
                        <li>64-bit architecture</li>
                        <li>4GB RAM minimum (8GB recommended)</li>
                        <li>500MB available storage</li>
                        <li>GTK+ 3.14 or higher</li>
                      </ul>
                      
                      <h4 className="font-medium text-sm mt-4">Installation Options</h4>
                      
                      <div className="space-y-3 mt-2">
                        <div>
                          <h5 className="font-medium">Option 1: Snap/Flatpak</h5>
                          <p className="mb-2">Install Plato W3 AI Browser using Snap (recommended) or Flatpak:</p>
                          <div className="bg-black/90 text-white p-3 rounded-md font-mono text-xs my-3">
                            <p># Using Snap</p>
                            <p>sudo snap install plato-browser</p>
                            <p className="mt-2"># Using Flatpak</p>
                            <p>flatpak install flathub dev.plato.browser</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium">Option 2: APT Repository (Debian/Ubuntu)</h5>
                          <p className="mb-2">Add our repository and install via APT:</p>
                          <div className="bg-black/90 text-white p-3 rounded-md font-mono text-xs my-3">
                            <p>curl -s https://repo.platodata.io/gpg | sudo apt-key add -</p>
                            <p>echo "deb [arch=amd64] https://repo.platodata.io/apt stable main" | sudo tee /etc/apt/sources.list.d/plato.list</p>
                            <p>sudo apt update</p>
                            <p>sudo apt install plato-browser</p>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h5 className="font-medium">Option 3: Direct Download</h5>
                          <p className="mb-2">Download the appropriate package for your distribution:</p>
                          <ul className="list-disc pl-5 space-y-1">
                            <li>.deb package for Debian/Ubuntu</li>
                            <li>.rpm package for Fedora/RHEL/CentOS</li>
                            <li>.AppImage for universal compatibility</li>
                            <li>tarball for manual installation</li>
                          </ul>
                          <Button className="mt-3 mr-2 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Download className="h-4 w-4 mr-2" /> .deb Package
                          </Button>
                          <Button className="mt-3 mr-2 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Download className="h-4 w-4 mr-2" /> .rpm Package
                          </Button>
                          <Button className="mt-3 bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                            <Download className="h-4 w-4 mr-2" /> .AppImage
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Card className="border-nexus-blue/20 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Web-Based Version</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Access Plato W3 AI Browser directly from your web browser with no installation required.
                      The web-based version offers most of the same functionality as the desktop app,
                      with some limitations for certain Web3 integrations that require deeper system access.
                    </p>
                    
                    <h4 className="font-medium text-sm mt-3">Accessing the Web Version:</h4>
                    <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground mb-4">
                      <li>Visit app.platodata.io in any modern browser</li>
                      <li>Create an account or sign in with your existing credentials</li>
                      <li>Your browsing data will sync across devices when signed in</li>
                      <li>Bookmark the page for quick access</li>
                    </ol>

                    <h4 className="font-medium text-sm mt-3">Browser Compatibility:</h4>
                    <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground mb-4">
                      <li>Chrome 90+</li>
                      <li>Firefox 88+</li>
                      <li>Safari 14+</li>
                      <li>Edge 90+</li>
                      <li>Opera 76+</li>
                    </ul>
                    
                    <Button className="bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                      Launch Web Version
                    </Button>
                  </CardContent>
                </Card>

                <Card className="border-nexus-blue/20 mb-6">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Mobile Applications</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Take Plato W3 AI Browser with you on your mobile devices. Our mobile apps offer a
                      tailored experience for smaller screens while maintaining the core functionality
                      of the desktop version.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">iOS App</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Available for iPhone and iPad running iOS 14.0 or later.
                          Features include Touch ID/Face ID support, widget integration, 
                          and Shortcuts app compatibility.
                        </p>
                        <Button className="bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                          <Apple className="h-4 w-4 mr-2" /> Download on App Store
                        </Button>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm mb-2">Android App</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          Available for Android devices running Android 8.0 (Oreo) or later.
                          Features include biometric authentication, homescreen widgets,
                          and integration with Android's share functionality.
                        </p>
                        <Button className="bg-[#1A1F2C] hover:bg-[#1A1F2C]/80 text-white">
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5236 9.75885H6.47638C6.13974 9.75885 5.875 10.0236 5.875 10.3602V19.6398C5.875 19.9764 6.13974 20.2411 6.47638 20.2411H17.5236C17.8603 20.2411 18.125 19.9764 18.125 19.6398V10.3602C18.125 10.0236 17.8603 9.75885 17.5236 9.75885Z" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 9.5V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V9.5" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          Download on Google Play
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-nexus-blue/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Trademark Disclaimer</h3>
                    <p className="text-sm text-muted-foreground">
                      Apple, the Apple logo, iPhone, and iPad are trademarks of Apple Inc., registered in the U.S. and other countries. App Store is a service mark of Apple Inc.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Google Play and the Google Play logo are trademarks of Google LLC.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Plato W3 AI Browser is not affiliated with, endorsed by, or sponsored by Apple Inc. or Google LLC. All respective trademarks, logos, and brand names are the property of their respective owners.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="web3" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Web3 Integration</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn about Plato W3 AI Browser's powerful blockchain and Web3 features
                  </p>
                </div>

                <Card className="border-nexus-blue/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Plato Bridge</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Plato Bridge is a proprietary technology that connects your browser directly to blockchain networks, providing:
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
                  <Card className="border-nexus-blue/20">
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

                  <Card className="border-nexus-blue/20">
                    <CardContent className="p-6">
                      <h3 className="text-md font-medium mb-3">Supported Networks</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Plato W3 AI Browser works with major blockchain networks:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                        <li>Ethereum</li>
                        <li>Polygon</li>
                        <li>Binance Smart Chain</li>
                        <li>Solana</li>
                        <li>Avalanche</li>
                        <li>Arbitrum</li>
                        <li>Optimism</li>
                        <li>And many more...</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="privacy" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Privacy & Security</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn about Plato W3 AI Browser's robust privacy and security features
                  </p>
                </div>

                <Card className="border-nexus-blue/20">
                  <CardContent className="p-6">
                    <h3 className="text-md font-medium mb-3">Privacy Features</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Plato W3 AI Browser was built with privacy at its core, offering features like:
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
                      <li>Automatic tracker blocking</li>
                      <li>Fingerprint protection</li>
                      <li>Private browsing mode</li>
                      <li>Cookie management</li>
                      <li>HTTPS Everywhere</li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Settings Guide</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn how to configure Plato W3 AI Browser for optimal performance
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="shortcuts" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Keyboard Shortcuts</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Master Plato W3 AI Browser with these time-saving keyboard shortcuts
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="troubleshooting" className="p-6 space-y-6 mt-0">
                <div>
                  <h2 className="text-xl font-medium mb-2">Troubleshooting</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Solutions for common issues you might encounter
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
