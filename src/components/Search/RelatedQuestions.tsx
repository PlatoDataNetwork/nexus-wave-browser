
import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
}

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({ questions, onQuestionClick }) => {
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 text-xs font-medium mb-2">
        <MessageSquarePlus className="h-3 w-3" />
        <span>Related Questions:</span>
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="justify-start text-xs h-auto py-1.5 text-left"
            onClick={() => onQuestionClick && onQuestionClick(question)}
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RelatedQuestions;
