
import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface AlternativeResponsesProps {
  hasAlternatives: boolean;
  currentResponseIndex: number;
  alternativeResponsesCount: number;
  onPrevious: () => void;
  onNext: () => void;
  isDisabled: boolean;
}

const AlternativeResponses: React.FC<AlternativeResponsesProps> = ({ 
  hasAlternatives,
  currentResponseIndex,
  alternativeResponsesCount,
  onPrevious,
  onNext,
  isDisabled
}) => {
  if (!hasAlternatives) {
    return null;
  }

  const canGoBack = currentResponseIndex > 0;
  const canGoForward = currentResponseIndex < alternativeResponsesCount;

  return (
    <div className="flex items-center justify-center gap-3 mt-1">
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 rounded-full"
        onClick={onPrevious}
        disabled={!canGoBack || isDisabled}
      >
        <ArrowLeft className="h-3 w-3" />
      </Button>
      
      <span className="text-xs text-muted-foreground">
        Response {currentResponseIndex + 1} of {alternativeResponsesCount + 1}
      </span>
      
      <Button
        size="sm"
        variant="outline"
        className="h-7 w-7 p-0 rounded-full"
        onClick={onNext}
        disabled={!canGoForward || isDisabled}
      >
        <ArrowRight className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default AlternativeResponses;
