
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { SearchPrompt } from "@/data/searchCategories";

interface PromptCardProps {
  prompt: SearchPrompt;
  onClick: (prompt: string) => void;
  categoryId?: string;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick, categoryId }) => {
  const { t } = useTranslation('categories');
  
  // Try to get translated prompt, fallback to original
  const getTranslatedPrompt = () => {
    if (categoryId) {
      const translatedPrompts = t(`${categoryId}.prompts`, { returnObjects: true, defaultValue: [] }) as string[];
      if (Array.isArray(translatedPrompts) && translatedPrompts.length > 0) {
        // Find the corresponding prompt by index or content matching
        const promptIndex = Number(prompt.id) - 1; // Ensure prompt.id is treated as number
        return translatedPrompts[promptIndex] || prompt.prompt;
      }
    }
    return prompt.prompt;
  };

  const translatedPrompt = getTranslatedPrompt();

  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all" 
      onClick={() => onClick(translatedPrompt)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-1">{prompt.title}</h3>
        <div className="mt-2 text-sm text-nexus-purple italic">
          "{translatedPrompt}..."
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
