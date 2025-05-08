
import React from "react";
import { 
  Plus, AppWindow, EyeOff, Torus, Star, Wallet, Shield,
  LayoutPanelLeft, Key, History, Bookmark, Download, Puzzle,
  Trash, ZoomIn, ZoomOut, Printer, Pen, Share, MoreHorizontal,
  HelpCircle, Settings, X, ChevronRight, Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SettingSectionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  shortcut?: string;
  children?: React.ReactNode;
}

const SettingSection: React.FC<SettingSectionProps> = ({ 
  icon: Icon, title, description, shortcut, children 
}) => {
  return (
    <div className="border border-border rounded-lg mb-6">
      <div className="p-6 flex items-start">
        <div className="mr-4 mt-1">
          <div className="bg-muted/50 p-2.5 rounded-md">
            <Icon className="h-5 w-5 text-nexus-purple" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            {shortcut && (
              <span className="text-sm text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                {shortcut}
              </span>
            )}
          </div>
          <p className="text-muted-foreground mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );
};

const SettingsDocumentation: React.FC = () => {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: `${action} activated`,
      description: `You activated the ${action} feature.`
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card hidden md:block">
        <div className="p-6 border-b border-border">
          <h2 className="font-semibold text-xl">Nexus Wave Browser</h2>
          <p className="text-sm text-muted-foreground mt-1">Settings Documentation</p>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <Link to="/" className="flex items-center text-sm gap-2 px-3 py-2 rounded-md hover:bg-muted">
              <Home className="h-4 w-4" />
              <span>Back to Browser</span>
            </Link>
          </div>
          <div className="space-y-1">
            <p className="px-3 py-2 text-sm font-medium">On this page</p>
            <a href="#tabs" className="flex items-center text-sm gap-1 px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-muted-foreground">•</span>
              <span>Tab Management</span>
            </a>
            <a href="#privacy" className="flex items-center text-sm gap-1 px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-muted-foreground">•</span>
              <span>Privacy Features</span>
            </a>
            <a href="#tools" className="flex items-center text-sm gap-1 px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-muted-foreground">•</span>
              <span>Browser Tools</span>
            </a>
            <a href="#data" className="flex items-center text-sm gap-1 px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-muted-foreground">•</span>
              <span>User Data</span>
            </a>
            <a href="#display" className="flex items-center text-sm gap-1 px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-muted-foreground">•</span>
              <span>Display Settings</span>
            </a>
            <a href="#help" className="flex items-center text-sm gap-1 px-3 py-2 rounded-md hover:bg-muted">
              <span className="text-muted-foreground">•</span>
              <span>Help & Support</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          {/* Top Navigation */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Nexus Wave Browser Settings</h1>
              <p className="text-muted-foreground mt-2">Complete guide to browser settings and features</p>
            </div>
            <Link to="/">
              <Button variant="outline">
                <Home className="mr-2 h-4 w-4" />
                Back to Browser
              </Button>
            </Link>
          </div>

          {/* Table of Contents - Mobile Only */}
          <div className="md:hidden mb-8">
            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="table-of-contents">
                <AccordionTrigger className="px-4">Table of Contents</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 pt-1">
                  <div className="space-y-2">
                    <a href="#tabs" className="flex items-center text-sm gap-1 py-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Tab Management</span>
                    </a>
                    <a href="#privacy" className="flex items-center text-sm gap-1 py-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Privacy Features</span>
                    </a>
                    <a href="#tools" className="flex items-center text-sm gap-1 py-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Browser Tools</span>
                    </a>
                    <a href="#data" className="flex items-center text-sm gap-1 py-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>User Data</span>
                    </a>
                    <a href="#display" className="flex items-center text-sm gap-1 py-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Display Settings</span>
                    </a>
                    <a href="#help" className="flex items-center text-sm gap-1 py-1">
                      <ChevronRight className="h-3 w-3" />
                      <span>Help & Support</span>
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* Content Sections */}
          <div>
            <section id="tabs" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Tab Management</h2>
              
              <SettingSection 
                icon={Plus}
                title="New Tab"
                shortcut="Ctrl+T"
                description="Open a new tab in the current browser window."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("New tab")}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Try it
                </Button>
              </SettingSection>

              <SettingSection 
                icon={AppWindow}
                title="New Window"
                shortcut="Ctrl+N"
                description="Open a new browser window, separate from your current session."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("New window")}
                >
                  <AppWindow className="h-4 w-4 mr-2" />
                  Try it
                </Button>
              </SettingSection>
            </section>

            <section id="privacy" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Privacy Features</h2>
              
              <SettingSection 
                icon={EyeOff}
                title="New Private Window"
                shortcut="Shift+Ctrl+N"
                description="Browse privately without storing local data. Your browsing history won't be saved."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("New private window")}
                >
                  <EyeOff className="h-4 w-4 mr-2" />
                  Try it
                </Button>
              </SettingSection>

              <SettingSection 
                icon={Torus}
                title="New Private Window with Tor"
                shortcut="Alt+Shift+N"
                description="Browse with additional privacy protection through the Tor network for enhanced anonymity."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("New private window with Tor")}
                >
                  <Torus className="h-4 w-4 mr-2" />
                  Try it
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={Shield}
                title="Nexus VPN"
                description="Protect your connection with end-to-end encryption and hide your real IP address."
              >
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button 
                    variant="outline"
                    className="inline-flex items-center"
                    onClick={() => handleAction("Nexus VPN Settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                  <Button 
                    variant="secondary"
                    className="inline-flex items-center"
                    onClick={() => handleAction("Nexus VPN")}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Connect VPN
                  </Button>
                </div>
              </SettingSection>
            </section>

            <section id="tools" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Browser Tools</h2>
              
              <SettingSection 
                icon={Star}
                title="Apollo"
                description="Access Apollo, the AI assistant for web browsing, research, and content creation."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Apollo")}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Launch Apollo
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={Wallet}
                title="Wallet"
                description="Manage your cryptocurrency wallet, view balances, and make transactions securely."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Wallet")}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Open Wallet
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={LayoutPanelLeft}
                title="Sidebar"
                description="Toggle the browser sidebar to access quick tools and bookmarks."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Sidebar toggle")}
                >
                  <LayoutPanelLeft className="h-4 w-4 mr-2" />
                  Toggle Sidebar
                </Button>
              </SettingSection>
            </section>

            <section id="data" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">User Data</h2>
              
              <SettingSection 
                icon={Key}
                title="Passwords and Autofill"
                description="Manage saved passwords, payment methods, and autofill information."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Passwords and autofill")}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={History}
                title="History"
                description="View and manage your browsing history, downloads, and saved items."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("History")}
                >
                  <History className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={Bookmark}
                title="Bookmarks and Lists"
                description="Access and organize your bookmarks, reading lists, and collections."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Bookmarks and lists")}
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  View Bookmarks
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={Download}
                title="Downloads"
                shortcut="Ctrl+J"
                description="View, manage and access your downloaded files."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Downloads")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  View Downloads
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={Trash}
                title="Delete Browsing Data"
                shortcut="Shift+Ctrl+Del"
                description="Clear cookies, cache, history, and other browsing data."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Delete browsing data")}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </SettingSection>
            </section>

            <section id="display" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Display Settings</h2>
              
              <SettingSection 
                icon={ZoomIn}
                title="Zoom Controls"
                description="Adjust the zoom level of your browser content."
              >
                <div className="flex items-center gap-3">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => handleAction("Zoom out")}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm">100%</span>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                    onClick={() => handleAction("Zoom in")}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </SettingSection>
            </section>

            <section id="help" className="mb-12">
              <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Help & Support</h2>
              
              <SettingSection 
                icon={HelpCircle}
                title="Help"
                description="Access help guides, tutorials, and support documentation."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Help")}
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Get Help
                </Button>
              </SettingSection>
              
              <SettingSection 
                icon={Settings}
                title="Settings"
                description="Configure browser settings, appearance, privacy and more."
              >
                <Button 
                  variant="secondary"
                  className="inline-flex items-center"
                  onClick={() => handleAction("Settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Open Settings
                </Button>
              </SettingSection>
            </section>
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-6 border-t text-center text-muted-foreground text-sm">
            <p>Nexus Wave Browser Documentation © 2025</p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default SettingsDocumentation;
