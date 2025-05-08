import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText } from "lucide-react";
import SupportTicketDialog from "@/components/SupportTicket/SupportTicketDialog";

const Documentation: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-center h-8 bg-card border-b border-border">
        <h1 className="text-xs font-medium">Nexus Wave Browser - Documentation</h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <FileText className="h-6 w-6 mr-2 text-[#e5007e]" />
              <h1 className="text-2xl font-bold">Nexus Wave Browser Documentation</h1>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <h2>Getting Started</h2>
              <p>
                Welcome to the Nexus Wave Browser! This documentation will guide you through the
                basic features and functionalities of the browser.
              </p>

              <h3>Installation</h3>
              <p>
                To install Nexus Wave Browser, download the latest version from our{" "}
                <a href="https://platodata.io" target="_blank" rel="noopener noreferrer">
                  official website
                </a>
                . Follow the installation instructions provided for your operating system.
              </p>

              <h3>Basic Usage</h3>
              <p>
                Once installed, launch the browser. You will be greeted with a clean and
                intuitive interface.
              </p>

              <ul>
                <li>
                  <strong>Address Bar:</strong> Use the address bar to enter website URLs or search
                  terms.
                </li>
                <li>
                  <strong>Navigation Buttons:</strong> Use the back, forward, and refresh buttons
                  to navigate between pages.
                </li>
                <li>
                  <strong>Tabs:</strong> Open multiple websites in separate tabs for easy
                  access.
                </li>
              </ul>

              <h2>Features</h2>

              <Accordion type="single" collapsible>
                <AccordionItem value="security">
                  <AccordionTrigger>Security Features</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Nexus Wave Browser is equipped with advanced security features to protect
                      your online privacy.
                    </p>
                    <ul>
                      <li>
                        <strong>Built-in Ad Blocker:</strong> Blocks unwanted ads and trackers.
                      </li>
                      <li>
                        <strong>Anti-Phishing:</strong> Detects and blocks phishing attempts.
                      </li>
                      <li>
                        <strong>Secure Browsing:</strong> Warns you about potentially harmful
                        websites.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="customization">
                  <AccordionTrigger>Customization Options</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Customize Nexus Wave Browser to suit your preferences.
                    </p>
                    <ul>
                      <li>
                        <strong>Themes:</strong> Choose from a variety of themes to change the
                        browser's appearance.
                      </li>
                      <li>
                        <strong>Extensions:</strong> Add extensions to enhance functionality.
                      </li>
                      <li>
                        <strong>Settings:</strong> Configure various settings to optimize your
                        browsing experience.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="troubleshooting">
                  <AccordionTrigger>Troubleshooting</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      If you encounter any issues, refer to the troubleshooting guide below.
                    </p>
                    <ul>
                      <li>
                        <strong>Page Loading Issues:</strong> Check your internet connection and
                        try again.
                      </li>
                      <li>
                        <strong>Browser Crashing:</strong> Restart the browser or reinstall it.
                      </li>
                      <li>
                        <strong>Extension Conflicts:</strong> Disable extensions one by one to
                        identify the conflicting extension.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <h2>FAQ</h2>
              <Accordion type="single" collapsible>
                <AccordionItem value="faq-1">
                  <AccordionTrigger>How do I update the browser?</AccordionTrigger>
                  <AccordionContent>
                    To update the browser, go to Settings and click on "About Nexus Wave Browser".
                    The browser will automatically check for updates and install them.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-2">
                  <AccordionTrigger>How do I clear my browsing data?</AccordionTrigger>
                  <AccordionContent>
                    To clear your browsing data, go to Settings and click on "Privacy and
                    security". Then, click on "Clear browsing data" and select the data you want
                    to clear.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="faq-3">
                  <AccordionTrigger>How do I install extensions?</AccordionTrigger>
                  <AccordionContent>
                    To install extensions, go to the Chrome Web Store and search for the extension
                    you want to install. Then, click on "Add to Chrome" and follow the
                    instructions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <h2>Contact Us</h2>
              <p>
                If you have any further questions or need assistance, please don't hesitate to
                contact our support team.
              </p>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="flex justify-between p-4 border-t border-border bg-card">
        <div className="flex space-x-2">
          <Button asChild 
            className="bg-[#e5007e] hover:bg-[#e5007e]/80 text-white"
          >
            <Link to="/settings">Return to Settings</Link>
          </Button>
          
          <SupportTicketDialog buttonText="Get Support" />
        </div>
        
        <Button asChild 
          className="bg-[#e5007e] hover:bg-[#e5007e]/80 text-white"
        >
          <Link to="/">Return to Browser</Link>
        </Button>
      </div>
    </div>
  );
};

export default Documentation;
