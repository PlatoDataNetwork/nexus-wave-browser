
import React from 'react';
import { Loader2, Search, Code, Zap } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface ResponseProgressProps {
  stage: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  percentage: number;
  showDetails?: boolean;
  stageDetails?: string;
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({ 
  stage, 
  percentage,
  showDetails = true,
  stageDetails
}) => {
  const getStageIcon = () => {
    switch (stage) {
      case 'initializing':
        return <Loader2 className="h-4 w-4 animate-spin text-nexus-purple" />;
      case 'classifying':
        return <Code className="h-4 w-4 animate-pulse text-nexus-purple" />;
      case 'searching':
        return <Search className="h-4 w-4 animate-pulse text-nexus-purple" />;
      case 'processing':
      case 'generating':
        return <Zap className="h-4 w-4 animate-pulse text-nexus-purple" />;
      case 'streaming':
        return <Loader2 className="h-4 w-4 animate-spin text-nexus-purple" />;
      case 'finalizing':
        return <Loader2 className="h-4 w-4 animate-spin text-nexus-purple" />;
      default:
        return null;
    }
  };

  const getStageLabel = () => {
    if (stageDetails) return stageDetails;
    
    switch (stage) {
      case 'initializing':
        return 'Initializing...';
      case 'classifying':
        return 'Analyzing your query...';
      case 'searching':
        return 'Searching for information...';
      case 'processing':
        return 'Processing data...';
      case 'generating':
        return 'Generating response...';
      case 'streaming':
        return 'Streaming response...';
      case 'finalizing':
        return 'Finalizing...';
      default:
        return '';
    }
  };

  // Don't show anything if complete
  if (stage === 'complete') return null;

  return (
    <div className="space-y-2">
      <Progress value={percentage} className="h-1" />
      {showDetails && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {getStageIcon()}
          <span>{getStageLabel()}</span>
        </div>
      )}
    </div>
  );
};

export default ResponseProgress;
