
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Database, Lightbulb, Sparkles, CheckCircle2 } from "lucide-react";

interface ResponseProgressProps {
  processingStage?: 'initializing' | 'classifying' | 'context-analysis' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  processingType?: 'individual' | 'contextual';
  progressPercentage?: number;
  stageDetails?: string;
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({ 
  processingStage = 'generating',
  processingType = 'individual',
  progressPercentage = 50,
  stageDetails = 'Processing your request...'
}) => {
  // Get icon and color based on the current stage
  const getStageInfo = () => {
    switch (processingStage) {
      case 'initializing':
        return { icon: <Loader2 className="h-4 w-4 animate-spin" />, colorClass: "bg-blue-400" };
      case 'classifying':
        return { icon: <Lightbulb className="h-4 w-4" />, colorClass: "bg-amber-400" };
      case 'context-analysis':
        return { icon: <Database className="h-4 w-4" />, colorClass: "bg-purple-400" };
      case 'searching':
        return { icon: <Search className="h-4 w-4" />, colorClass: "bg-green-400" };
      case 'processing':
        return { icon: <Loader2 className="h-4 w-4 animate-spin" />, colorClass: "bg-blue-400" };
      case 'generating':
      case 'streaming':
        return { icon: <Sparkles className="h-4 w-4" />, colorClass: "bg-nexus-purple" };
      case 'finalizing':
        return { icon: <Loader2 className="h-4 w-4 animate-spin" />, colorClass: "bg-teal-400" };
      case 'complete':
        return { icon: <CheckCircle2 className="h-4 w-4" />, colorClass: "bg-green-400" };
      default:
        return { icon: <Loader2 className="h-4 w-4 animate-spin" />, colorClass: "bg-nexus-purple" };
    }
  };

  const { icon, colorClass } = getStageInfo();

  return (
    <div className="space-y-1 mb-3 animate-in fade-in-50 duration-300">
      <div className="flex items-center space-x-2 mb-1">
        <div className="bg-muted rounded-full p-1">
          {icon}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-medium text-gray-700">
            {processingStage === 'complete' ? 'Complete' : 'Processing'}
          </span>
          {processingType === 'contextual' && (
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
              Using context
            </span>
          )}
        </div>
      </div>
      
      <Progress 
        value={progressPercentage} 
        className="h-1.5" 
        indicatorClassName={colorClass}
      />
      
      <p className="text-xs text-muted-foreground">
        {stageDetails}
      </p>
    </div>
  );
};

export default ResponseProgress;
