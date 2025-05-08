
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download, Upload, MessageCircle, LifeBuoy, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const SettingsAdvanced: React.FC = () => {
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [backgroundApps, setBackgroundApps] = useState(false);
  const [startupMode, setStartupMode] = useState("restore");
  const [memoryUsage, setMemoryUsage] = useState("balanced");
  const [experimentalFeatures, setExperimentalFeatures] = useState(false);
  const [smoothScrolling, setSmoothScrolling] = useState(true);
  const [tabDiscarding, setTabDiscarding] = useState(true);
  const [webGL, setWebGL] = useState(true);
  const [supportIssue, setSupportIssue] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportMessages, setSupportMessages] = useState([
    { sender: "system", content: "Welcome to Nexus Wave Support. How can we help you today?", timestamp: new Date().toISOString() }
  ]);
  const [messageInput, setMessageInput] = useState("");
  const [troubleshootTab, setTroubleshootTab] = useState("reset");
  const { toast } = useToast();

  const handleResetSettings = () => {
    toast({
      title: "Settings reset",
      description: "All settings have been restored to default values",
    });
  };

  const handleClearData = () => {
    toast({
      title: "Browser data cleared",
      description: "All browsing data has been cleared",
    });
  };
  
  const handleImportSettings = () => {
    toast({
      title: "Import Settings",
      description: "Select a file to import settings",
    });
  };
  
  const handleExportSettings = () => {
    toast({
      title: "Export Settings",
      description: "Settings exported to file",
    });
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (supportIssue.trim() && supportEmail.trim()) {
      toast({
        title: "Support ticket created",
        description: "A support representative will contact you shortly",
      });
      setSupportIssue("");
      setSupportEmail("");
    } else {
      toast({
        title: "Form incomplete",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    
    // Add user message
    const userMessage = { sender: "user", content: messageInput, timestamp: new Date().toISOString() };
    setSupportMessages(prev => [...prev, userMessage]);
    setMessageInput("");
    
    // Simulate agent response after a short delay
    setTimeout(() => {
      const agentMessage = { 
        sender: "agent", 
        content: "Thanks for reaching out! Our support team has received your message and will respond shortly. For urgent issues, please call our support line at 1-800-NEXUS-HELP.", 
        timestamp: new Date().toISOString() 
      };
      setSupportMessages(prev => [...prev, agentMessage]);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium mb-2">Advanced</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Configure advanced browser settings
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-md font-medium mb-3">System</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">Use hardware acceleration when available</p>
              <p className="text-xs text-muted-foreground">
                Uses GPU to accelerate browsing (requires restart)
              </p>
            </div>
            <Switch 
              checked={hardwareAcceleration}
              onCheckedChange={setHardwareAcceleration}
            />
          </div>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm">WebGL</p>
              <p className="text-xs text-muted-foreground">
                Enable hardware-accelerated graphics (recommended)
              </p>
            </div>
            <Switch 
              checked={webGL}
              onCheckedChange={setWebGL}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Smooth scrolling</p>
              <p className="text-xs text-muted-foreground">
                Enable smooth scrolling animation
              </p>
            </div>
            <Switch 
              checked={smoothScrolling}
              onCheckedChange={setSmoothScrolling}
            />
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Startup</h3>
          <Select value={startupMode} onValueChange={setStartupMode}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Choose startup behavior" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="restore">Restore previous session</SelectItem>
              <SelectItem value="homepage">Open homepage</SelectItem>
              <SelectItem value="newtab">Open new tab page</SelectItem>
              <SelectItem value="specific">Open specific pages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Memory management</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm">Automatically discard inactive tabs</p>
                <p className="text-xs text-muted-foreground">
                  Reduce memory usage by unloading background tabs
                </p>
              </div>
              <Switch 
                checked={tabDiscarding}
                onCheckedChange={setTabDiscarding}
              />
            </div>
            
            <div className="mb-2">
              <p className="text-sm mb-2">Memory usage</p>
              <Select value={memoryUsage} onValueChange={setMemoryUsage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select memory usage profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="efficient">Efficient (lower memory usage)</SelectItem>
                  <SelectItem value="balanced">Balanced (recommended)</SelectItem>
                  <SelectItem value="performance">Performance (higher memory usage)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Background apps</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Continue running background apps when Nexus Wave is closed</p>
              <p className="text-xs text-muted-foreground">
                This may affect system performance
              </p>
            </div>
            <Switch 
              checked={backgroundApps}
              onCheckedChange={setBackgroundApps}
            />
          </div>
        </div>

        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Experimental features</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm">Enable experimental features</p>
              <p className="text-xs text-muted-foreground">
                Try new features that are still in development (may be unstable)
              </p>
            </div>
            <Switch 
              checked={experimentalFeatures}
              onCheckedChange={setExperimentalFeatures}
            />
          </div>
        </div>
        
        <Separator />
        
        <div>
          <h3 className="text-md font-medium mb-3">Import/Export</h3>
          <p className="text-xs text-muted-foreground mb-3">
            Import or export your browser settings and data
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleImportSettings}>
              <Download className="h-4 w-4" />
              Import settings
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportSettings}>
              <Upload className="h-4 w-4" />
              Export settings
            </Button>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="text-md font-medium mb-3">Troubleshooting</h3>
          
          <Tabs value={troubleshootTab} onValueChange={setTroubleshootTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-2">
              <TabsTrigger value="reset" className="text-xs">Reset Settings</TabsTrigger>
              <TabsTrigger value="clear" className="text-xs">Clear Data</TabsTrigger>
              <TabsTrigger value="support" className="text-xs">Get Support</TabsTrigger>
            </TabsList>

            <TabsContent value="reset" className="space-y-3">
              <p className="text-xs text-muted-foreground">
                This will reset all Nexus Wave settings to their default values.
              </p>
              <Button variant="destructive" size="sm" onClick={handleResetSettings}>
                Reset settings
              </Button>
            </TabsContent>
            
            <TabsContent value="clear" className="space-y-3">
              <p className="text-xs text-muted-foreground">
                This will clear all your browsing history, cookies, and site data.
              </p>
              <Button variant="destructive" size="sm" onClick={handleClearData}>
                Clear data
              </Button>
            </TabsContent>
            
            <TabsContent value="support" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-md p-4 space-y-4">
                  <h4 className="text-sm font-medium">Contact Support</h4>
                  <form onSubmit={handleSupportSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="supportEmail" className="text-xs font-medium">Email Address</label>
                      <Input 
                        id="supportEmail" 
                        type="email" 
                        value={supportEmail} 
                        onChange={(e) => setSupportEmail(e.target.value)}
                        placeholder="your.email@example.com"
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="supportIssue" className="text-xs font-medium">Describe your issue</label>
                      <Textarea 
                        id="supportIssue"
                        value={supportIssue}
                        onChange={(e) => setSupportIssue(e.target.value)} 
                        placeholder="Please provide details about the problem you're experiencing..." 
                        className="mt-1"
                        required
                      />
                    </div>
                    <Button size="sm" type="submit" className="w-full">
                      <LifeBuoy className="h-4 w-4 mr-2" />
                      Submit support request
                    </Button>
                  </form>
                </div>
                
                <div className="bg-muted/50 rounded-md p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Live Support Chat</h4>
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Online</span>
                  </div>
                  
                  <div className="bg-background border rounded-md h-48 overflow-y-auto p-3 space-y-2">
                    {supportMessages.map((message, index) => (
                      <div 
                        key={index}
                        className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                            message.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : message.sender === 'system' 
                                ? 'bg-muted text-foreground' 
                                : 'bg-card text-card-foreground border'
                          }`}
                        >
                          {message.content}
                        </div>
                        <span className="text-[10px] text-muted-foreground mt-1">
                          {new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 text-sm"
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button size="sm" onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SettingsAdvanced;
