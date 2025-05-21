
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '@/lib/categoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Image, Clock, Shield, Zap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
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
  const handleTabClick = (tab: string) => {
    navigate(`/search?tab=${tab}`);
  };
  
  return (
    <div className="p-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => navigate('/search?tab=wave')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="p-2 rounded-full bg-nexus-purple bg-opacity-20">
          <Icon className="h-6 w-6 text-nexus-purple" />
        </div>
        <h1 className="text-2xl font-bold">{category.name}</h1>
      </div>
      
      {/* Navigation buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => handleTabClick('web')}
        >
          <Image className="h-4 w-4" /> Web
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => handleTabClick('images')}
        >
          <Image className="h-4 w-4" /> Images
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => handleTabClick('news')}
        >
          <Clock className="h-4 w-4" /> News
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => handleTabClick('nexus')}
        >
          <Zap className="h-4 w-4" /> Nexus
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 bg-nexus-purple text-white"
          onClick={() => handleTabClick('wave')}
        >
          <Sparkles className="h-4 w-4" /> Wave
        </Button>
      </div>
      
      {/* Prompts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {randomPrompts.map((prompt) => (
          <Card 
            key={prompt.id} 
            className="cursor-pointer hover:shadow-md transition-all"
            onClick={() => handlePromptClick(prompt.text)}
          >
            <CardContent className="p-4">
              <p>{prompt.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-3">
          <Textarea 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Write or select a prompt..."
            className="min-h-[100px]"
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
