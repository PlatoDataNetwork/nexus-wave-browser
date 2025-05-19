
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Zap, Bot, CheckCircle2 } from "lucide-react";

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
    icon: <Loader2 className="h-4 w-4 animate-spin text-nexus-purple" />
  },
  searching: {
    id: 'searching',
    label: 'Searching web',
    description: 'Finding relevant real-time information',
    icon: <Search className="h-4 w-4 animate-pulse text-nexus-purple" />
  },
  processing: {
    id: 'processing',
    label: 'Processing data',
    description: 'Preparing information for your answer',
    icon: <Zap className="h-4 w-4 animate-pulse text-nexus-purple" />
  },
  generating: {
    id: 'generating',
    label: 'Generating response',
    description: 'Crafting a comprehensive answer',
    icon: <Bot className="h-4 w-4 animate-spin text-nexus-purple" />
  },
  complete: {
    id: 'complete',
    label: 'Complete',
    description: 'Response fully generated',
    icon: <CheckCircle2 className="h-4 w-4 text-green-500" />
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

  const isCurrentStage = (stageId: ProgressStage['id']) => stageId === stage;

  return (
    <div className="w-full space-y-3 bg-secondary/30 p-3 rounded-lg animate-fade-in" 
         role="region" 
         aria-label="Response progress">
      {/* Enhanced progress bar with subtle animation and better colors */}
      <Progress 
        value={percentage} 
        className="h-1.5 bg-secondary overflow-hidden" 
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      
      {/* Stage indicators with improved layout */}
      {showDetails && (
        <div className="grid grid-cols-4 gap-1 sm:gap-2 text-xs text-muted-foreground mt-1 overflow-x-hidden">
          {Object.values(STAGES).slice(0, -1).map((s) => (
            <div 
              key={s.id} 
              className={`flex flex-col items-center transition-all duration-300 ${
                isCurrentStage(s.id) 
                  ? "opacity-100 scale-105" 
                  : isComplete(s.id) 
                    ? "opacity-80" 
                    : "opacity-50"
              }`}
              aria-current={isCurrentStage(s.id) ? "step" : undefined}
            >
              <div className="flex items-center justify-center mb-1">
                {isCurrentStage(s.id) ? (
                  <div className="animate-pulse-glow">{currentStage.icon}</div>
                ) : isComplete(s.id) ? (
                  <div className="h-4 w-4 rounded-full bg-nexus-purple flex items-center justify-center">
                    <span className="text-white text-[8px]">✓</span>
                  </div>
                ) : (
                  <div className="h-4 w-4 rounded-full bg-gray-200 dark:bg-gray-700" />
                )}
              </div>
              <span className="text-center text-[10px] font-medium line-clamp-1">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      )}
      
      {/* Current stage details with improved styling */}
      <div className="flex items-center gap-2 px-2 py-1.5 bg-background/50 rounded-md border border-border/30 shadow-sm">
        <div className="bg-secondary rounded-full p-1.5">
          {currentStage.icon}
        </div>
        <div className="flex-1">
          <p className="text-xs font-semibold">{currentStage.label}</p>
          <p className="text-[11px] text-muted-foreground">{currentStage.description}</p>
        </div>
        <div className="text-xs font-mono text-muted-foreground">{percentage}%</div>
      </div>
    </div>
  );
};

export default ResponseProgress;
