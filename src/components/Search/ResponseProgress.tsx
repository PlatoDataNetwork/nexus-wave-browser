
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Zap, 
  Network, 
  Loader2, 
  Brain, 
  Database,
  Globe 
} from 'lucide-react';

interface ResponseProgressProps {
  stage: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  percentage: number;
  showDetails?: boolean;
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({ 
  stage,
  percentage,
  showDetails = true
}) => {
  // Get stage description and icon
  let stageDescription = '';
  let StageIcon = Loader2;
  let stageDetails = '';
  
  switch (stage) {
    case 'initializing':
      stageDescription = 'Initializing';
      StageIcon = Loader2;
      stageDetails = 'Setting up the response framework';
      break;
    case 'classifying':
      stageDescription = 'Analyzing Query';
      StageIcon = Brain;
      stageDetails = 'Classifying your request to determine optimal response strategy';
      break;
    case 'searching':
      stageDescription = 'Gathering Data';
      StageIcon = Search;
      stageDetails = 'Searching for real-time information from reliable sources';
      break;
    case 'processing':
      stageDescription = 'Processing';
      StageIcon = Database;
      stageDetails = 'Analyzing and synthesizing collected information';
      break;
    case 'generating':
      stageDescription = 'Formulating';
      StageIcon = Zap;
      stageDetails = 'Generating comprehensive response based on all data';
      break;
    case 'streaming':
      stageDescription = 'Responding';
      StageIcon = Network;
      stageDetails = 'Delivering response with latest information';
      break;
    case 'finalizing':
      stageDescription = 'Finalizing';
      StageIcon = Globe;
      stageDetails = 'Polishing response with final details and sources';
      break;
    case 'complete':
      stageDescription = 'Complete';
      StageIcon = Zap;
      stageDetails = 'Response completed with all available information';
      break;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1">
          <StageIcon className="h-3.5 w-3.5 text-nexus-purple animate-pulse" />
          <span className="font-medium">{stageDescription}</span>
        </div>
        <span className="text-muted-foreground">{percentage}%</span>
      </div>
      
      <Progress value={percentage} className="h-1.5" />
      
      {showDetails && (
        <p className="text-xs text-muted-foreground mt-1">{stageDetails}</p>
      )}
    </div>
  );
};

export default ResponseProgress;
