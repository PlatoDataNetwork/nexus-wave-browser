
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Globe, Coins, LineChart, Download } from "lucide-react";
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation('common');
  const isAppRoute = location.pathname.startsWith('/app');
  const isSearchRoute = location.pathname.startsWith('/search');
  const isExtensionStoreRoute = location.pathname.startsWith('/extension-store');
  const isHistoryRoute = location.pathname.startsWith('/history');
  
  // Don't display header on app routes that have their own browser chrome
  const shouldHideHeader = isAppRoute || isSearchRoute || isExtensionStoreRoute || isHistoryRoute;
  
  if (shouldHideHeader) {
    return null;
  }
  
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
            <div className="h-8 w-8 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" 
                alt="Nexus Wave Logo" 
                className="h-full w-full object-cover"
              />
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
              <Link to="/search">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Search className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('navigation.search')}</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/app">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Globe className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('navigation.browser')}</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/token">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <Coins className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('navigation.token')}</span>
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/staking">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white"
                >
                  <LineChart className="mr-1 h-4 w-4" />
                  <span className="hidden sm:inline">{t('navigation.staking')}</span>
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link to="/profile">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
            >
              {t('navigation.signup')}
            </Button>
          </Link>
          <Link to="/downloads">
            <Button variant="macos" size="sm">
              {t('navigation.downloads')}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
