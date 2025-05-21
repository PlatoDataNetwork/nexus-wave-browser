import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Mail } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  // Check if we're on the search page to hide footer
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  
  // Also hide on category detail pages (prompts pages)
  const isCategoryDetailPage = location.pathname.includes("/search/category/");
  
  // If we're on the search page or category detail page, don't render the footer
  if (isSearchPage || isCategoryDetailPage) {
    return null;
  }
  
  return (
    <footer className="bg-gradient-to-tr from-nexus-header-blue to-nexus-card-dark text-white py-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nexus Wave Browser</h3>
            <p className="text-sm text-gray-300 mb-4">
              The next generation Web3 browser built for privacy, security and decentralized applications.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 rounded-full">
                <Github className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="p-2 hover:bg-white/10 rounded-full">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-nexus-purple transition-colors">Home</Link></li>
              <li><Link to="/app" className="hover:text-nexus-purple transition-colors">Browser</Link></li>
              <li><Link to="/search" className="hover:text-nexus-purple transition-colors">Search</Link></li>
              <li><Link to="/extension-store" className="hover:text-nexus-purple transition-colors">Extensions</Link></li>
              <li><Link to="/settings" className="hover:text-nexus-purple transition-colors">Settings</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/settings-docs" className="hover:text-nexus-purple transition-colors">Documentation</Link></li>
              <li><Link to="/history" className="hover:text-nexus-purple transition-colors">History</Link></li>
              <li><Link to="/downloads" className="hover:text-nexus-purple transition-colors">Downloads</Link></li>
              <li><Link to="/profile" className="hover:text-nexus-purple transition-colors">Profile</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <p className="text-sm text-gray-300 mb-2">Have questions or feedback?</p>
            <Button variant="macos-flat" size="sm" className="mb-4">
              Contact Support
            </Button>
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} Nexus Wave Browser.
              <br />All rights reserved.
            </p>
          </div>
        </div>

        <Separator className="my-6 bg-gray-700" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <div className="mb-4 md:mb-0">
            <Link to="/privacy-policy" className="hover:text-white mr-4">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-white mr-4">Terms of Service</Link>
            <Link to="/cookie-policy" className="hover:text-white">Cookie Policy</Link>
          </div>
          <div>
            <span>Nexus Wave Browser V2.1 - Building a decentralized future</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
