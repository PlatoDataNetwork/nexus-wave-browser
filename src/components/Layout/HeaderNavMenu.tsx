
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const HeaderNavMenu: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header
      className={cn(
        "fixed w-full top-0 z-50 transition-all duration-300 py-4 px-4 md:px-8",
        isScrolled
          ? "bg-nexus-space-black/90 backdrop-blur-lg shadow-md"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-nexus-light-purple to-nexus-purple bg-clip-text text-transparent">Nexus Wave</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-white hover:text-nexus-light-purple bg-transparent hover:bg-nexus-purple/10">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {[
                      {
                        title: "Privacy & Security",
                        href: "#security-features",
                        description: "Enhanced privacy features and security protocols"
                      },
                      {
                        title: "Web3 Integration",
                        href: "#web3-connectivity",
                        description: "Seamless blockchain and dApp connectivity"
                      },
                      {
                        title: "AI Assistant",
                        href: "#ai-integration",
                        description: "Intelligent browsing assistance powered by AI"
                      },
                      {
                        title: "Cross-Device Sync",
                        href: "#cross-device",
                        description: "Access your browsing data across all devices"
                      },
                    ].map((item) => (
                      <li key={item.title}>
                        <a
                          href={item.href}
                          onClick={(e) => {
                            e.preventDefault();
                            const element = document.querySelector(item.href);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                        >
                          <NavigationMenuLink
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-nexus-purple/10 hover:text-nexus-light-purple"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
                              {item.description}
                            </p>
                          </NavigationMenuLink>
                        </a>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <a href="#testimonials" 
                  className={cn(navigationMenuTriggerStyle(), "text-white hover:text-nexus-light-purple bg-transparent hover:bg-nexus-purple/10")}
                  onClick={(e) => {
                    e.preventDefault();
                    const testimonials = document.querySelector("#testimonials");
                    if (testimonials) {
                      testimonials.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Testimonials
                </a>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link
                  to="/extension-store"
                  className={cn(navigationMenuTriggerStyle(), "text-white hover:text-nexus-light-purple bg-transparent hover:bg-nexus-purple/10")}
                >
                  Extensions
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/app">
            <Button variant="outline" className="border-nexus-purple text-nexus-light-purple hover:bg-nexus-purple/10">
              Try Browser
            </Button>
          </Link>
          <Link to="/app">
            <Button className="bg-nexus-purple hover:bg-nexus-deep-purple">
              Launch App
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-white hover:text-nexus-light-purple transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-nexus-dark-blue/95 backdrop-blur-lg py-4 px-6 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <div className="border-b border-gray-700 pb-2">
              <div className="flex justify-between items-center py-2">
                <span className="text-white font-medium">Features</span>
                <ChevronDown className="h-5 w-5 text-nexus-purple" />
              </div>
              <div className="pl-4 pb-2 space-y-2">
                {[
                  { label: "Privacy & Security", href: "#security-features" },
                  { label: "Web3 Integration", href: "#web3-connectivity" },
                  { label: "AI Assistant", href: "#ai-integration" },
                  { label: "Cross-Device Sync", href: "#cross-device" },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block py-1 text-gray-300 hover:text-nexus-light-purple"
                    onClick={(e) => {
                      e.preventDefault();
                      const element = document.querySelector(item.href);
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            
            <a
              href="#testimonials"
              className="block py-2 text-white hover:text-nexus-light-purple"
              onClick={(e) => {
                e.preventDefault();
                const testimonials = document.querySelector("#testimonials");
                if (testimonials) {
                  testimonials.scrollIntoView({ behavior: 'smooth' });
                  setMobileMenuOpen(false);
                }
              }}
            >
              Testimonials
            </a>
            
            <Link
              to="/extension-store"
              className="block py-2 text-white hover:text-nexus-light-purple"
              onClick={() => setMobileMenuOpen(false)}
            >
              Extensions
            </Link>
            
            <div className="pt-3 flex flex-col space-y-3">
              <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full border-nexus-purple text-nexus-light-purple hover:bg-nexus-purple/10">
                  Try Browser
                </Button>
              </Link>
              <Link to="/app" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-nexus-purple hover:bg-nexus-deep-purple">
                  Launch App
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default HeaderNavMenu;
