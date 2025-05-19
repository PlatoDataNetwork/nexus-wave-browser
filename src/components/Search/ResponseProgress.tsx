
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Zap, Bot } from "lucide-react";

export interface ProgressStage {
  id: 'classifying' | 'searching' | 'processing' | 'generating' | 'complete';
  label: string;
  description: string;
  icon: JSX.Element;
}

export interface ResponseProgressProps {
  stage: ProgressStage['id'];
  percentage: number;
  showDetails?: boolean;
}

// Define all possible stages with their details
const STAGES: Record<ProgressStage['id'], ProgressStage> = {
  classifying: {
    id: 'classifying',
    label: 'Analyzing query',
    description: 'Determining if real-time data is needed',
    icon: <Loader2 className="h-4 w-4 animate-spin" />
  },
  searching: {
    id: 'searching',
    label: 'Searching web',
    description: 'Finding relevant real-time information',
    icon: <Search className="h-4 w-4 animate-pulse" />
  },
  processing: {
    id: 'processing',
    label: 'Processing data',
    description: 'Preparing information for your answer',
    icon: <Zap className="h-4 w-4 animate-pulse" />
  },
  generating: {
    id: 'generating',
    label: 'Generating response',
    description: 'Crafting a comprehensive answer',
    icon: <Bot className="h-4 w-4 animate-spin" />
  },
  complete: {
    id: 'complete',
    label: 'Complete',
    description: 'Response fully generated',
    icon: <Zap className="h-4 w-4" />
  }
};

const ResponseProgress: React.FC<ResponseProgressProps> = ({ 
  stage, 
  percentage,
  showDetails = true 
}) => {
  const currentStage = STAGES[stage];
  
  // Calculate which stages are complete
  const isComplete = (stageId: ProgressStage['id']) => {
    const stageOrder = ['classifying', 'searching', 'processing', 'generating', 'complete'];
    const currentIndex = stageOrder.indexOf(stage);
    const checkIndex = stageOrder.indexOf(stageId);
    
    return checkIndex < currentIndex;
  };

  return (
    <div className="w-full space-y-2">
      <Progress value={percentage} className="h-2" />
      
      {showDetails && (
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          {Object.values(STAGES).slice(0, -1).map((s) => (
            <div 
              key={s.id} 
              className={`flex flex-col items-center transition-opacity ${
                s.id === stage 
                  ? "opacity-100" 
                  : isComplete(s.id) 
                    ? "opacity-70" 
                    : "opacity-40"
              }`}
              style={{ maxWidth: '80px' }}
            >
              <div className="flex items-center justify-center mb-1">
                {s.id === stage ? currentStage.icon : (isComplete(s.id) ? (
                  <div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-white text-[8px]">✓</span>
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                ))}
              </div>
              <span className="text-center text-[10px] font-medium line-clamp-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-center gap-2 mt-1">
        {currentStage.icon}
        <div>
          <p className="text-xs font-medium">{currentStage.label}</p>
          <p className="text-xs text-muted-foreground">{currentStage.description}</p>
        </div>
      </div>
    </div>
  );
};

export default ResponseProgress;
