
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Clock, Shield, Zap, Sparkles, Image, Video } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WaveSearchResults from '@/components/Wave/WaveSearchResults';
import WaveChat from '@/components/Wave/WaveChat';
import CategoryGrid from '@/components/Search/CategoryGrid';

const WaveSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('wave');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      setIsSearching(true);
      // In a real app, this would trigger an API search
      console.log("Searching for:", searchQuery);
      setTimeout(() => setIsSearching(false), 1000); // Simulate search delay
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background dark:bg-nexus-space-black">
      {/* Top navigation bar */}
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
                <Link to="/app">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white"
                  >
                    <Zap className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Browser</span>
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
                    <Zap className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Token</span>
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
                    <Zap className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Staking</span>
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
          
          {/* Right side actions */}
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button
                variant="ghost"
                size="sm"
                className="text-white"
              >
                Signup
              </Button>
            </Link>
            <Link to="/downloads">
              <Button variant="macos" size="sm">
                Download
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Search interface */}
      <div className="p-4 border-b border-border nexus-gradient-bg">
        {/* Search form */}
        <form onSubmit={handleSearch} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search or ask Nexus Wave anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background/80 backdrop-blur-sm"
            />
            <Button type="submit" disabled={isSearching}>
              {isSearching ? (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4 animate-pulse" />
                  Searching...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </span>
              )}
            </Button>
          </div>
        </form>
        
        {/* Tabs */}
        <div className="flex items-center justify-between mt-4">
          <Tabs value={activeTab} className="w-full">
            <div className="flex justify-between items-center">
              <TabsList className="bg-secondary/50">
                <TabsTrigger value="web" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Image className="h-4 w-4 mr-1" /> Web
                </TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Image className="h-4 w-4 mr-1" /> Images
                </TabsTrigger>
                <TabsTrigger value="videos" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Video className="h-4 w-4 mr-1" /> Videos
                </TabsTrigger>
                <TabsTrigger value="news" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Clock className="h-4 w-4 mr-1" /> News
                </TabsTrigger>
                <TabsTrigger value="wave" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Sparkles className="h-4 w-4 mr-1" /> Nexus Wave
                </TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1"
                  type="button"
                >
                  <Clock className="h-4 w-4" />
                  <span className="text-xs">Past 24h</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-1 text-green-500"
                  type="button"
                >
                  <Shield className="h-4 w-4 text-green-500" />
                  <span className="text-xs">Safe Search On</span>
                </Button>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Main content area */}
      <div className="flex-grow overflow-auto">
        <div className="h-full m-0 p-0">
          {searchQuery ? (
            <div className="flex h-full">
              <div className="flex-1 h-full">
                <WaveSearchResults query={searchQuery} />
              </div>
              <div className="w-1/3 h-full border-l border-border">
                <WaveChat query={searchQuery} />
              </div>
            </div>
          ) : (
            <div className="container py-6">
              <h2 className="text-2xl font-bold mb-6">Explore Categories</h2>
              <CategoryGrid />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaveSearch;
