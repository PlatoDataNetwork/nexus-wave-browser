
import React, { memo, useState } from 'react';
import { MessageSquarePlus, Loader2, CheckCircle2, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RelatedQuestionsProps {
  questions: string[];
  onQuestionClick?: (question: string) => void;
  alreadyClickedQuestions?: Set<string>;
}

// Using memo to prevent unnecessary re-renders
const RelatedQuestions: React.FC<RelatedQuestionsProps> = memo(({ 
  questions, 
  onQuestionClick,
  alreadyClickedQuestions = new Set()
}) => {
  const [clickedQuestionIndex, setClickedQuestionIndex] = useState<number | null>(null);
  
  if (!questions || questions.length === 0) {
    return null;
  }

  const handleQuestionClick = (question: string, index: number) => {
    // Don't allow clicking again if this question was previously clicked
    if (alreadyClickedQuestions.has(question)) {
      console.log('Question was already clicked before:', question);
      return;
    }
    
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
        <span>Ask a follow-up question</span>
      </div>
      <div className="flex flex-col gap-2">
        {questions.map((question, index) => {
          const wasClickedBefore = alreadyClickedQuestions.has(question);
          
          return (
            <TooltipProvider key={index}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={wasClickedBefore ? "outline" : "outline"}
                    size="sm"
                    className={`justify-start text-xs h-auto py-1.5 text-left group
                      ${wasClickedBefore 
                        ? 'opacity-70 hover:bg-gray-100 dark:hover:bg-gray-800 border-dashed' 
                        : 'hover:bg-nexus-purple/10'}`}
                    onClick={() => handleQuestionClick(question, index)}
                    disabled={clickedQuestionIndex !== null || wasClickedBefore}
                  >
                    {clickedQuestionIndex === index ? (
                      <div className="flex items-center gap-1.5">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 w-full">
                        {wasClickedBefore && (
                          <CheckCircle2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={wasClickedBefore ? 'text-muted-foreground' : ''}>
                          {question}
                        </span>
                      </div>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center" className="text-xs">
                  {wasClickedBefore ? 'Already asked' : 'Click to ask'}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
});

// Add display name for React Dev Tools
RelatedQuestions.displayName = 'RelatedQuestions';

export default RelatedQuestions;
