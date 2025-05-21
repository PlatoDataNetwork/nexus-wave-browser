
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { categories } from './CategoryCubes';
import * as Icons from 'lucide-react';
import { useConversationContext } from '@/contexts/ConversationContext';
import ConversationDisplay from './ConversationDisplay';
import ChatInput from './ChatInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Sample prompts organized by category
const categoryPrompts: Record<string, string[]> = {
  // Default prompts for each category
  default: [
    "What are the latest developments in this field?",
    "Explain the fundamentals of this category to a beginner",
    "What are the top companies in this sector?",
    "What are the biggest challenges facing this industry?",
    "What are the most promising opportunities in this area?",
    "How has this field evolved over the past decade?"
  ],
  // Custom prompts for specific categories
  ai: [
    "Explain the differences between machine learning, deep learning, and AI",
    "What are the ethical implications of artificial intelligence?",
    "How is AI being used in healthcare today?",
    "What are the latest breakthroughs in natural language processing?",
    "How can businesses implement AI solutions effectively?",
    "What skills are needed to work in the AI industry?"
  ],
  blockchain: [
    "Explain how blockchain technology works",
    "What are the differences between Bitcoin and Ethereum?",
    "How is blockchain being used outside of cryptocurrency?",
    "What is the environmental impact of blockchain technology?",
    "What are smart contracts and how do they work?",
    "What regulations are affecting blockchain development?"
  ],
  // Add more category-specific prompts as needed
};

// Utility function to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CategoryDetail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [categoryPromptsOrder, setCategoryPromptsOrder] = useLocalStorage<Record<string, number[]>>('categoryPromptsOrder', {});
  
  // Use the shared conversation context
  const {
    setCurrentMessage,
    handleSubmit,
    setCategoryContext
  } = useConversationContext();
  
  // Find the selected category
  const selectedCategory = categories.find((cat) => cat.slug === slug);
  
  useEffect(() => {
    // Set the category context when component mounts
    if (selectedCategory) {
      setCategoryContext(selectedCategory.name);
    }
    
    // Clear the category context when component unmounts
    return () => {
      setCategoryContext(null);
    };
  }, [selectedCategory, setCategoryContext]);
  
  if (!selectedCategory) {
    return <div className="p-6">Category not found</div>;
  }

  // Get the actual icon component from lucide-react
  const IconComponent = Icons[selectedCategory.icon as keyof typeof Icons] as React.ElementType;
  
  // Get prompts for this category or use default prompts
  const rawPrompts = categoryPrompts[slug || ''] || categoryPrompts.default;
  
  // Get or create the order for this category's prompts
  useEffect(() => {
    if (!slug) return;
    
    if (!categoryPromptsOrder[slug]) {
      // Create initial shuffled order
      const initialOrder = Array.from({ length: rawPrompts.length }, (_, i) => i);
      const shuffledOrder = shuffleArray(initialOrder);
      setCategoryPromptsOrder({
        ...categoryPromptsOrder,
        [slug]: shuffledOrder
      });
    }
  }, [slug, rawPrompts.length]);
  
  // Get the ordered prompts based on saved order
  const prompts = categoryPromptsOrder[slug || ''] 
    ? categoryPromptsOrder[slug || ''].map(index => rawPrompts[index < rawPrompts.length ? index : 0])
    : rawPrompts;

  const handlePromptClick = (prompt: string) => {
    setCurrentMessage(prompt);
    
    // Rotate prompts for this category
    if (slug && categoryPromptsOrder[slug]) {
      const currentOrder = [...categoryPromptsOrder[slug]];
      const rotated = [...currentOrder.slice(1), currentOrder[0]]; // Move first to end
      
      setCategoryPromptsOrder({
        ...categoryPromptsOrder,
        [slug]: rotated
      });
    }
    
    // Submit the prompt to conversation
    handleSubmit();
  };

  return (
    <div className="p-6 pb-20 w-full flex flex-col h-full">
      <div className="flex items-center gap-2 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={() => navigate("/search")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Categories</span>
        </Button>
      </div>
      
      <div className="flex items-center mb-6">
        <div className={`p-3 rounded-full bg-nexus-purple mr-3`}>
          {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
        </div>
        <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3">Suggested Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {prompts.map((prompt, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:bg-secondary/50 transition-colors"
              onClick={() => handlePromptClick(prompt)}
            >
              <CardContent className="p-3">
                <p>{prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Chat conversation display */}
      <div className="flex-1 overflow-auto mb-4 min-h-[200px] relative">
        <ConversationDisplay />
        <ChatInput placeholder={`Ask about ${selectedCategory.name}...`} />
      </div>
    </div>
  );
};

export default CategoryDetail;
