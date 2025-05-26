
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SearchPrompt } from "@/data/searchCategories";
import { useTranslation } from 'react-i18next';

interface PromptCardProps {
  prompt: SearchPrompt;
  onClick: (prompt: string) => void;
  categoryId: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick, categoryId }) => {
  const { t } = useTranslation('search');

  // Get the translated title for this prompt
  const translatedTitle = t(`prompts.${categoryId}.${prompt.id}`, { defaultValue: prompt.title });

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all" 
      onClick={() => onClick(prompt.prompt)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-1">{translatedTitle}</h3>
        <div className="mt-2 text-sm text-nexus-purple italic">
          "{prompt.prompt}..."
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
