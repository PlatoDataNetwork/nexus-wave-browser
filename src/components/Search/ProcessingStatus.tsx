
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { 
  Loader2, 
  Brain, 
  Globe, 
  FileSearch,
  Zap,
  MessageSquare,
  Activity
} from "lucide-react";

export type ProcessStage = 
  | 'idle'
  | 'classifying' 
  | 'searching' 
  | 'processing' 
  | 'generating'
  | 'streaming'
  | 'complete';

interface ProcessingStatusProps {
  stage: ProcessStage;
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ stage }) => {
  // Define progress percentages for each stage
  const progressMap = {
    idle: 0,
    classifying: 20,
    searching: 40,
    processing: 60,
    generating: 80,
    streaming: 90,
    complete: 100
  };

  // Define messages for each stage
  const messageMap = {
    idle: "Ready to search",
    classifying: "Analyzing your query...",
    searching: "Searching the web for real-time data...",
    processing: "Processing information from sources...",
    generating: "Creating your personalized response...",
    streaming: "Streaming response...",
    complete: "Response ready"
  };

  // Icon for each stage
  const getStageIcon = () => {
    switch (stage) {
      case 'classifying':
        return <Brain className="h-4 w-4 animate-pulse text-amber-500" />;
      case 'searching':
        return <Globe className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'processing':
        return <FileSearch className="h-4 w-4 animate-pulse text-green-500" />;
      case 'generating':
        return <Zap className="h-4 w-4 animate-pulse text-purple-500" />;
      case 'streaming':
        return <Activity className="h-4 w-4 animate-pulse text-indigo-500" />;
      case 'complete':
        return <MessageSquare className="h-4 w-4 text-nexus-purple" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };

  if (stage === 'idle') {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 mb-2 mt-2 w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2">
        {getStageIcon()}
        <span className="text-sm font-medium">{messageMap[stage]}</span>
      </div>
      <Progress value={progressMap[stage]} className="h-1.5" />
    </div>
  );
};

export default ProcessingStatus;
