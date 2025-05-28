
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { SearchPrompt } from "@/data/searchCategories";

interface PromptCardProps {
  categoryId: string;
  prompt: SearchPrompt;
  onClick: (prompt: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ categoryId, prompt, onClick }) => {
  const { t } = useTranslation('categories');
  
  const translatedTitle = t(`${categoryId}.prompts.${prompt.id}.title`, { defaultValue: prompt.title });
  const translatedPrompt = t(`${categoryId}.prompts.${prompt.id}.prompt`, { defaultValue: prompt.prompt });

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all" 
      onClick={() => onClick(translatedPrompt)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-1">{translatedTitle}</h3>
        <div className="mt-2 text-sm text-nexus-purple italic">
          "{translatedPrompt}..."
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
