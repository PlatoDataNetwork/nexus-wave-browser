
import React, { memo, useState } from 'react';
import { MessageSquarePlus, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
}

// Using memo to prevent unnecessary re-renders
const RelatedQuestions: React.FC<RelatedQuestionsProps> = memo(({ questions, onQuestionClick }) => {
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState<number | null>(null);
  
  if (!questions || questions.length === 0) {
    return null;
  }

  const handleQuestionClick = (question: string, index: number) => {
    setClickedQuestionIndex(index);
    
    // Add a small delay to ensure clean state transition before invoking the callback
    setTimeout(() => {
      if (onQuestionClick) {
        onQuestionClick(question);
      }
      // Reset the clicked state after a brief period
      setTimeout(() => setClickedQuestionIndex(null), 1000);
    }, 100);
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-1 text-xs font-medium mb-2">
        <MessageSquarePlus className="h-3 w-3" />
        <span>Ask follow-up questions:</span>
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            className="justify-start text-xs h-auto py-1.5 text-left hover:bg-nexus-purple/10"
            onClick={() => handleQuestionClick(question, index)}
            disabled={clickedQuestionIndex !== null}
          >
            {clickedQuestionIndex === index ? (
              <div className="flex items-center gap-1.5">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              question
            )}
          </Button>
        ))}
      </div>
    </div>
  );
});

// Add display name for React Dev Tools
RelatedQuestions.displayName = 'RelatedQuestions';

export default RelatedQuestions;
