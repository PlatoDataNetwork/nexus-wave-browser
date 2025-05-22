
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SearchCategory, getCategoryById } from '@/data/searchCategories';
import PromptCard from './PromptCard';

interface CategoryDetailProps {
  categoryId: string;
  onBack: () => void;
  onSelectPrompt: (prompt: string) => void;
}

const CategoryDetail: React.FC<CategoryDetailProps> = ({ 
  categoryId, 
  onBack,
  onSelectPrompt 
}) => {
  const category: SearchCategory | undefined = getCategoryById(categoryId);

  if (!category) {
    return (
      <div className="p-4 text-center">
        <p>Category not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Categories
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <category.icon className={`mr-2 h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
            {category.title}
          </h2>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {category.prompts.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt}
            onClick={onSelectPrompt}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDetail;
