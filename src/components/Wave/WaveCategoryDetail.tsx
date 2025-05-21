
import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '@/lib/categoryData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WaveChat } from './WaveChat';
import { useWave } from '@/hooks/useWave';

export const WaveCategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const { addUserMessage } = useWave();
  
  const category = categories.find(cat => cat.id === categoryId);
  
  if (!category) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Category not found</h2>
        <Button onClick={() => navigate('/wave')}>
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
    // Use the context to add the user message
    addUserMessage(promptText);
  };
  
  return (
    <div className="flex flex-col h-screen bg-background dark:bg-nexus-space-black">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 border-b p-4">
          <Button variant="outline" size="icon" onClick={() => navigate('/wave')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="p-2 rounded-full bg-nexus-purple bg-opacity-20">
            <Icon className="h-6 w-6 text-nexus-purple" />
          </div>
          <h1 className="text-2xl font-bold">{category.name}</h1>
        </div>
        
        <div className="flex h-full">
          {/* Prompts sidebar */}
          <div className="hidden md:block w-72 border-r p-4 overflow-auto">
            <h2 className="text-lg font-semibold mb-4">Suggested Prompts</h2>
            <div className="space-y-3">
              {category.prompts.map((prompt) => (
                <Card 
                  key={prompt.id} 
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => handlePromptClick(prompt.text)}
                >
                  <CardContent className="p-3">
                    <p className="text-sm">{prompt.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            {/* Mobile view prompt suggestions */}
            <ScrollArea className="md:hidden p-4">
              <h2 className="text-lg font-semibold mb-2">Suggested Prompts</h2>
              <div className="grid grid-cols-1 gap-3 mb-4">
                {randomPrompts.map((prompt) => (
                  <Card 
                    key={prompt.id} 
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handlePromptClick(prompt.text)}
                  >
                    <CardContent className="p-3">
                      <p className="text-sm">{prompt.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
            
            {/* Wave Chat Component */}
            <div className="flex-1 overflow-hidden">
              <WaveChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
