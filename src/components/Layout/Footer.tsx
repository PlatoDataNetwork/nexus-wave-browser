
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  Twitter, 
  Globe, 
  MessageSquare,
  Shield, 
  HelpCircle,
  Mail
} from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Product column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Product
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/features" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/changelog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Changelog
                </Link>
              </li>
              <li>
                <Link to="/roadmap" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/docs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/api" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  API Reference
                </Link>
              </li>
              <li>
                <Link to="/community" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider">
              Connect
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="https://twitter.com/nexuswave" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  <Twitter className="h-4 w-4 mr-2" />
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://github.com/nexuswave" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  <Github className="h-4 w-4 mr-2" />
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://discord.gg/nexuswave" target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Discord
                </a>
              </li>
              <li>
                <a href="mailto:support@nexuswave.io" className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Nexus Wave. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-xs text-gray-500 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-xs text-gray-500 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
              Privacy Policy
            </Link>
            <Link to="/cookies" className="text-xs text-gray-500 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
              Cookies
            </Link>
            <Link to="/security" className="text-xs text-gray-500 dark:text-gray-400 hover:text-nexus-purple dark:hover:text-nexus-light-purple">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
