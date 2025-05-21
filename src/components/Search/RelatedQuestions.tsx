
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
}

const RelatedQuestions: React.FC<RelatedQuestionsProps> = ({ 
  questions, 
  onQuestionClick 
}) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <h4 className="text-sm font-medium text-muted-foreground">Related Questions</h4>
      <div className="grid gap-1.5">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="ghost"
            size="sm"
            className="justify-start h-auto py-1.5 px-2 text-left text-sm font-normal hover:bg-muted hover:text-foreground transition-colors"
            onClick={() => onQuestionClick && onQuestionClick(question)}
          >
            <ArrowRight className="h-3 w-3 mr-1.5 flex-shrink-0 text-nexus-purple" />
            <span className="truncate">{question}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RelatedQuestions;
