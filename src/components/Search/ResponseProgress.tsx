
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Database, Brain, CheckCircle } from 'lucide-react';

interface ProcessingStageInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ResponseProgressProps {
  stage: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  percentage: number;
  showDetails?: boolean;
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({
  stage = 'classifying',
  percentage = 0,
  showDetails = false
}) => {
  // Define information for each processing stage
  const stageInfo: Record<string, ProcessingStageInfo> = {
    initializing: {
      title: "Initializing",
      description: "Starting the response process...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    },
    classifying: {
      title: "Analyzing",
      description: "Understanding your query...",
      icon: <Brain className="h-4 w-4" />
    },
    searching: {
      title: "Searching",
      description: "Looking up real-time information...",
      icon: <Search className="h-4 w-4" />
    },
    processing: {
      title: "Processing",
      description: "Processing information from multiple sources...",
      icon: <Database className="h-4 w-4" />
    },
    generating: {
      title: "Generating",
      description: "Creating your response...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    },
    streaming: {
      title: "Streaming",
      description: "Displaying real-time response...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    },
    finalizing: {
      title: "Finalizing",
      description: "Putting everything together...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />
    },
    complete: {
      title: "Complete",
      description: "Response is ready",
      icon: <CheckCircle className="h-4 w-4" />
    }
  };

  // Default to 'classifying' info if stage is not found
  const currentInfo = stageInfo[stage] || stageInfo.classifying;

  return (
    <div className="w-full space-y-1">
      <Progress value={percentage} className="h-1" />
      
      {showDetails && (
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {currentInfo.icon}
            <span>{currentInfo.title}</span>
          </div>
          <span className="text-right">{percentage.toFixed(0)}%</span>
        </div>
      )}
    </div>
  );
};

export default ResponseProgress;
