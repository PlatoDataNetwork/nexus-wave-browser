
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { SearchPrompt } from "@/data/searchCategories";

interface PromptCardProps {
  prompt: SearchPrompt;
  onClick: (prompt: string) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-all" 
      onClick={() => onClick(prompt.prompt)}
    >
      <CardContent className="p-4">
        <h3 className="font-medium text-base mb-1">{prompt.title}</h3>
        <div className="mt-2 text-sm text-nexus-purple italic">
          "{prompt.prompt}..."
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
