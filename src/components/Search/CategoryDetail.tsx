
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MessageSquare, Grid3X3 } from "lucide-react";
import { categories } from './CategoryCubes';
import * as Icons from 'lucide-react';
import { useConversationContext } from '@/contexts/ConversationContext';
import ConversationDisplay from './ConversationDisplay';
import ChatInput from './ChatInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';

// Enhanced category-specific prompts
const categoryPrompts: Record<string, string[]> = {
  // Default prompts - will only be used as fallback
  default: [
    "What are the latest developments in this field?",
    "Explain the fundamentals of this category to a beginner",
    "What are the top companies in this sector?",
    "What are the biggest challenges facing this industry?",
    "What are the most promising opportunities in this area?",
    "How has this field evolved over the past decade?"
  ],
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
  finance: [
    "What are the most promising fintech innovations today?",
    "How is blockchain changing traditional finance?",
    "Explain decentralized finance (DeFi) and its potential",
    "What are the biggest risks in cryptocurrency investing?",
    "How do stablecoins work and what are their use cases?",
    "What regulations are impacting the finance sector?"
  ],
  healthcare: [
    "How is AI transforming healthcare diagnostics?",
    "What are the latest medical technology breakthroughs?",
    "Explain the concept of precision medicine",
    "How are wearable devices changing healthcare monitoring?",
    "What are the ethical considerations in genetic testing?",
    "How is telemedicine evolving post-pandemic?"
  ],
  aerospace: [
    "What are the latest developments in commercial space travel?",
    "How are satellites being used for global communications?",
    "Explain the challenges of Mars exploration",
    "What innovations are making aircraft more fuel-efficient?",
    "How is AI being applied in aviation safety?",
    "What's the future of supersonic air travel?"
  ],
  sustainability: [
    "What are the most promising renewable energy technologies?",
    "How can blockchain improve supply chain sustainability?",
    "Explain carbon capture technologies and their potential",
    "What innovations are helping reduce plastic waste?",
    "How is AI being used to address climate change?",
    "What are the biggest challenges in transitioning to sustainable energy?"
  ],
  education: [
    "How is AI changing personalized learning?",
    "What are the pros and cons of online education platforms?",
    "Explain the concept of microlearning and its benefits",
    "How are AR and VR being used in educational settings?",
    "What skills will be most important in the future job market?",
    "How can education systems better prepare students for technological change?"
  ]
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
  const [showPrompts, setShowPrompts] = useState(true);
  
  // Use the shared conversation context
  const {
    messages,
    currentMessage,
    setCurrentMessage,
    handleSubmit,
    setCategoryContext
  } = useConversationContext();
  
  // Find the selected category
  const selectedCategory = categories.find((cat) => cat.slug === slug);
  
  // Auto-hide prompts when there are messages or user is typing
  useEffect(() => {
    if (messages.length > 0 || currentMessage.trim().length > 0) {
      setShowPrompts(false);
    }
  }, [messages, currentMessage]);
  
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
  
  // Reset to show prompts when category changes
  useEffect(() => {
    setShowPrompts(true);
  }, [slug]);
  
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
  }, [slug, rawPrompts.length, categoryPromptsOrder, setCategoryPromptsOrder]);
  
  // Get the ordered prompts based on saved order
  const prompts = categoryPromptsOrder[slug || ''] 
    ? categoryPromptsOrder[slug || ''].map(index => rawPrompts[index < rawPrompts.length ? index : 0])
    : rawPrompts;

  const handlePromptClick = (prompt: string) => {
    setCurrentMessage(prompt);
    setShowPrompts(false);  // Hide prompts when selecting one
    
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

  // Toggle between prompts and conversation view
  const toggleView = () => {
    setShowPrompts(!showPrompts);
  };

  return (
    <div className="p-6 pb-20 w-full flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
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
        
        {/* Toggle button between prompts and conversation */}
        {messages.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleView} 
            className="flex items-center gap-1"
          >
            {showPrompts ? (
              <>
                <MessageSquare className="h-4 w-4" />
                <span>Show Conversation</span>
              </>
            ) : (
              <>
                <Grid3X3 className="h-4 w-4" />
                <span>Show Prompts</span>
              </>
            )}
          </Button>
        )}
      </div>
      
      <div className="flex items-center mb-6">
        <div className={`p-3 rounded-full bg-nexus-purple mr-3`}>
          {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
        </div>
        <h2 className="text-2xl font-bold">{selectedCategory.name}</h2>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        {/* Prompt suggestions - shown only when showPrompts is true */}
        <div 
          className={`transition-all duration-300 ${showPrompts ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}
          style={{ height: showPrompts ? 'auto' : '0' }}
        >
          <h3 className="text-lg font-medium mb-3">
            Suggested Questions About {selectedCategory.name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {prompts.map((prompt, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:bg-secondary/50 transition-colors hover:shadow-md"
                onClick={() => handlePromptClick(prompt)}
              >
                <CardContent className="p-3">
                  <p>{prompt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Conversation view - shown when showPrompts is false */}
        <div 
          className={`transition-all duration-300 flex flex-col ${showPrompts ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}
          style={{ height: showPrompts ? '0' : '100%' }}
        >
          <div className="flex-1 overflow-auto mb-4 min-h-[200px] relative">
            <ConversationDisplay />
          </div>
        </div>
      </div>
      
      {/* Fixed chat input at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <ChatInput 
          placeholder={`Ask about ${selectedCategory.name}...`} 
          onFocus={() => setShowPrompts(false)}
        />
      </div>
    </div>
  );
};

export default CategoryDetail;
