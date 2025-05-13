
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon, Download, Globe, ArrowRight } from "lucide-react";
import { ThemeToggle, DateTime } from "@/components/Browser/BrowserHeader";

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-black/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo area */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-lg font-semibold bg-gradient-to-r from-nexus-purple to-nexus-light-purple bg-clip-text text-transparent">
                Nexus Wave
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-nexus-purple dark:hover:text-nexus-light-purple transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-nexus-purple dark:hover:text-nexus-light-purple transition-colors">
              Pricing
            </Link>
            <Link to="/community" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-nexus-purple dark:hover:text-nexus-light-purple transition-colors">
              Community
            </Link>
            <Link to="/app" className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-nexus-purple dark:hover:text-nexus-light-purple transition-colors">
              App
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <Link to="/app">
              <Button variant="macos" size="macos-sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
