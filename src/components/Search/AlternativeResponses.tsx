
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface AlternativeResponsesProps {
  hasAlternatives: boolean;
  currentResponseIndex: number;
  alternativeResponsesCount: number;
  onPrevious: () => void;
  onNext: () => void;
  isDisabled?: boolean;
}

const AlternativeResponses: React.FC<AlternativeResponsesProps> = ({
  hasAlternatives,
  currentResponseIndex,
  alternativeResponsesCount,
  onPrevious,
  onNext,
  isDisabled = false
}) => {
  if (!hasAlternatives) return null;

  return (
    <div className="flex items-center justify-end gap-2 mt-3">
      <div className="text-xs text-muted-foreground">
        {currentResponseIndex + 1} / {alternativeResponsesCount + 1} responses
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        disabled={currentResponseIndex === 0 || isDisabled}
        onClick={onPrevious}
      >
        <ChevronLeft className="h-3.5 w-3.5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="h-6 w-6"
        disabled={currentResponseIndex >= alternativeResponsesCount || isDisabled}
        onClick={onNext}
      >
        <ChevronRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default AlternativeResponses;
