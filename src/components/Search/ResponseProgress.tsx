
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Zap, 
  Network, 
  Loader2, 
  Brain, 
  Database,
  Globe,
  Timer
} from 'lucide-react';

interface ResponseProgressProps {
  stage: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  percentage: number;
  showDetails?: boolean;
  stageDetails?: string;
  timeElapsed?: number; // Time elapsed in milliseconds
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({ 
  stage,
  percentage,
  showDetails = true,
  stageDetails,
  timeElapsed
}) => {
  // Get stage description and icon
  let stageDescription = '';
  let StageIcon = Loader2;
  let defaultStageDetails = '';
  
  switch (stage) {
    case 'initializing':
      stageDescription = 'Initializing';
      StageIcon = Loader2;
      defaultStageDetails = 'Setting up the response framework';
      break;
    case 'classifying':
      stageDescription = 'Analyzing Query';
      StageIcon = Brain;
      defaultStageDetails = 'Classifying your request to determine optimal response strategy';
      break;
    case 'searching':
      stageDescription = 'Gathering Data';
      StageIcon = Search;
      defaultStageDetails = 'Searching for real-time information from reliable sources';
      break;
    case 'processing':
      stageDescription = 'Processing';
      StageIcon = Database;
      defaultStageDetails = 'Analyzing and synthesizing collected information';
      break;
    case 'generating':
      stageDescription = 'Formulating';
      StageIcon = Zap;
      defaultStageDetails = 'Generating comprehensive response based on all data';
      break;
    case 'streaming':
      stageDescription = 'Responding';
      StageIcon = Network;
      defaultStageDetails = 'Delivering response with latest information';
      break;
    case 'finalizing':
      stageDescription = 'Finalizing';
      StageIcon = Globe;
      defaultStageDetails = 'Polishing response with final details and sources';
      break;
    case 'complete':
      stageDescription = 'Complete';
      StageIcon = Zap;
      defaultStageDetails = 'Response completed with all available information';
      break;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <StageIcon className="h-3.5 w-3.5 text-nexus-purple animate-pulse" />
          <span className="font-medium">{stageDescription}</span>
          
          {/* Show elapsed time if provided */}
          {timeElapsed && (
            <div className="flex items-center gap-0.5 ml-2 text-muted-foreground">
              <Timer className="h-3 w-3" />
              <span>{(timeElapsed / 1000).toFixed(1)}s</span>
            </div>
          )}
        </div>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-1.5" />
      
      {showDetails && (
        <p className="text-xs text-muted-foreground mt-1">
          {stageDetails || defaultStageDetails}
        </p>
      )}
    </div>
  );
};

export default ResponseProgress;
