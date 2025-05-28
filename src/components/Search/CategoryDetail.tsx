
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { SearchCategory, getCategoryById } from '@/data/searchCategories';
import PromptCard from './PromptCard';
import { Textarea } from "@/components/ui/textarea";

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
  const { t } = useTranslation('categories');
  const [customPrompt, setCustomPrompt] = useState('');
  const category: SearchCategory | undefined = getCategoryById(categoryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onSelectPrompt(customPrompt);
      setCustomPrompt('');
    }
  };

  if (!category) {
    return (
      <div className="p-4 text-center">
        <p>Category not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> {t('backToCategories')}
        </Button>
      </div>
    );
  }

  // Get translated category data
  const translatedTitle = t(`categories.${category.id}.title`);
  const translatedDescription = t(`categories.${category.id}.description`);

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-6">
        <Button onClick={onBack} variant="outline" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <category.icon className={`mr-2 h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
            {translatedTitle}
          </h2>
          <p className="text-muted-foreground">{translatedDescription}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-grow overflow-auto mb-4">
        {category.prompts.map((prompt) => (
          <PromptCard 
            key={prompt.id} 
            prompt={prompt}
            categoryId={categoryId}
            onClick={onSelectPrompt}
          />
        ))}
      </div>
      
      {/* Custom Prompt Input Area */}
      <div className="mt-auto pt-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder={t('askCustomQuestion', { category: translatedTitle })}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="flex-1 min-h-12 resize-none focus:border-nexus-purple transition-colors"
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
            disabled={!customPrompt.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CategoryDetail;
