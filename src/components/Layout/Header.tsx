
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/Browser/BrowserHeader";
import { Shield, Torus, Puzzle, Home, Search } from "lucide-react";

const Header: React.FC = () => {
  const location = useLocation();
  const isAppRoute = location.pathname.startsWith('/app');
  
  // Determine if the current path is active
  const isActive = (path: string) => {
    return location.pathname === path || 
           (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-nexus-header-blue shadow-sm backdrop-blur-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo and Brand */}
        <div className="mr-4 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-nexus-purple flex items-center justify-center">
              <Torus className="h-5 w-5 text-white" />
            </div>
            <span className="hidden text-xl font-bold text-white sm:inline-block">
              Nexus Wave
            </span>
          </Link>
        </div>
        
        {/* Main Navigation */}
        <nav className="flex-1">
          <ul className="flex gap-1 md:gap-2">
            <li>
              <Link to="/">
                <Button
                  variant={isActive('/') ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Home className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Home</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/app">
                <Button
                  variant={isActive('/app') ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Search className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Browser</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/extension-store">
                <Button
                  variant={isActive('/extension-store') ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Puzzle className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Extensions</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/settings">
                <Button
                  variant={isActive('/settings') ? "secondary" : "ghost"}
                  size="sm"
                  className="text-white"
                >
                  <Shield className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">Settings</span>
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link to="/profile">
            <Button
              variant={isActive('/profile') ? "secondary" : "ghost"}
              size="sm"
              className="text-white"
            >
              Profile
            </Button>
          </Link>

          {!isAppRoute && (
            <Link to="/app">
              <Button variant="macos" size="sm">
                Launch App
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
