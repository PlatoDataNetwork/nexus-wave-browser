
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { categories } from '@/lib/categoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Image, Clock, Shield, Zap, Sparkles, Video } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [userInput, setUserInput] = useState('');
  
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Category not found</h2>
        <Button onClick={() => navigate('/search?tab=wave')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Categories
        </Button>
      </div>
    );
  }
  
  const Icon = category.icon;
  
  // Get 6 random prompts from the category
  const randomPrompts = useMemo(() => {
    const shuffled = [...category.prompts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 6);
  }, [category.prompts]);
  
  const handlePromptClick = (promptText: string) => {
    setUserInput(promptText);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) {
      toast.error("Please enter a prompt");
      return;
    }
    
    toast.success("Processing your prompt");
    // In a real implementation, this would send the prompt to an API
    console.log("Submitted prompt:", userInput);
  };

  // Navigation buttons for the top bar
  const handleTabChange = (tab: string) => {
    navigate(`/search?tab=${tab}`);
  };
  
  // Split prompts into rows
  const firstRow = randomPrompts.slice(0, 3);
  const secondRow = randomPrompts.slice(3, 6);
  
  return (
    <div className="flex flex-col h-screen bg-background dark:bg-nexus-space-black">
      {/* Top navigation bar similar to the home screen */}
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
                    variant="secondary"
                    size="sm"
                    className="text-white"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Search</span>
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
                    <Image className="mr-1 h-4 w-4" />
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
        {/* Tabs and search controls */}
        <div className="flex items-center justify-between mt-4">
          <Tabs value="wave" onValueChange={handleTabChange} className="w-full">
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
                <TabsTrigger value="nexus" className="data-[state=active]:bg-nexus-purple data-[state=active]:text-white">
                  <Zap className="h-4 w-4 mr-1" /> Nexus Search
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
      
      {/* Main content area with padding at the bottom to account for fixed input */}
      <ScrollArea className="flex-1 p-6 pb-32 overflow-auto">
        {/* Header with Back Button and Category Info */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" onClick={() => navigate('/search?tab=wave')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="p-2 rounded-full bg-nexus-purple bg-opacity-20">
            <Icon className="h-6 w-6 text-nexus-purple" />
          </div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
        </div>
        
        {/* Prompts Grid - Modified to show two rows with fixed width cards */}
        <div className="max-w-6xl mx-auto">
          {/* First row */}
          <div className="flex justify-center gap-4 mb-4">
            {firstRow.map((prompt) => (
              <Card 
                key={prompt.id} 
                className="w-[300px] cursor-pointer hover:shadow-md transition-all"
                onClick={() => handlePromptClick(prompt.text)}
              >
                <CardContent className="p-4">
                  <p>{prompt.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Second row */}
          <div className="flex justify-center gap-4">
            {secondRow.map((prompt) => (
              <Card 
                key={prompt.id} 
                className="w-[300px] cursor-pointer hover:shadow-md transition-all"
                onClick={() => handlePromptClick(prompt.text)}
              >
                <CardContent className="p-4">
                  <p>{prompt.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
      
      {/* Input Area - Fixed to bottom of screen */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t shadow-md z-50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-3">
          <Textarea 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Write or select a prompt..."
            className="min-h-[100px] resize-none"
          />
          <Button type="submit" className="ml-auto">
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategoryDetail;
