
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
import { categories, CategoryItem } from './CategoryCubes';
import * as Icons from 'lucide-react';
import { useConversation } from '@/hooks/useConversation';
import { ChatMessage } from '@/types';
import ConversationDisplay from './ConversationDisplay';
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
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [categoryPromptsOrder, setCategoryPromptsOrder] = useLocalStorage<Record<string, number[]>>('categoryPromptsOrder', {});
  
  // Use the conversation hook to manage chat state
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    isLoading,
    handleSubmit: handleConversationSubmit,
    handleRegenerateMessage,
    handleSelectAlternative,
    handleRelatedQuestionClick,
  } = useConversation({});
  
  // Find the selected category
  const selectedCategory = categories.find((cat) => cat.slug === slug);
  
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
    handleConversationSubmit(undefined, prompt);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      setCurrentMessage(message);
      handleConversationSubmit(e, message);
      setMessage("");
    }
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
        <div className={`p-3 rounded-full ${selectedCategory.color} mr-3`}>
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
      <div className="flex-1 overflow-auto mb-4 min-h-[200px]">
        {messages.length > 0 && (
          <ConversationDisplay 
            messages={messages}
            setCurrentMessage={setCurrentMessage}
            handleRegenerateMessage={handleRegenerateMessage}
            handleSelectAlternative={handleSelectAlternative}
            handleRelatedQuestionClick={handleRelatedQuestionClick}
          />
        )}
      </div>
      
      {/* Chat input at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <Textarea
            placeholder={`Ask about ${selectedCategory.name}...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 min-h-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            className="h-12 bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
            disabled={isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategoryDetail;
