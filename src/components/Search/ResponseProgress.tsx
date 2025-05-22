
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { motion } from 'framer-motion';
import { Brain, Globe, Cpu, Sparkles, Loader2, Bot } from 'lucide-react';

interface ResponseProgressProps {
  stage: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  percentage?: number;
  showDetails?: boolean;
  stageDetails?: string;
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({ 
  stage, 
  percentage = 0,
  showDetails = false,
  stageDetails
}) => {
  
  // Helper function to get progress bar variant based on stage
  const getProgressClass = () => {
    switch(stage) {
      case 'searching':
        return "bg-nexus-purple/60";
      case 'processing':
        return "bg-nexus-deep-purple/70";
      case 'generating':
        return "bg-nexus-deep-purple";
      case 'streaming':
        return "bg-nexus-deep-purple";
      default:
        return "bg-nexus-purple/50";
    }
  };
  
  // Helper function to get icon based on stage
  const getIcon = () => {
    switch(stage) {
      case 'initializing':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'classifying':
        return <Brain className="h-4 w-4 animate-pulse" />;
      case 'searching':
        return <Globe className="h-4 w-4 animate-pulse" />;
      case 'processing':
        return <Cpu className="h-4 w-4 animate-pulse" />;
      case 'generating':
        return <Sparkles className="h-4 w-4 animate-pulse" />;
      case 'streaming':
        return <Bot className="h-4 w-4 animate-pulse" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin" />;
    }
  };
  
  // Helper function to get stage description
  const getStageName = () => {
    switch(stage) {
      case 'initializing':
        return "Initializing";
      case 'classifying':
        return "Analyzing your request";
      case 'searching':
        return "Searching the web";
      case 'processing':
        return "Processing information";
      case 'generating':
        return "Generating response";
      case 'streaming':
        return "Streaming response";
      case 'finalizing':
        return "Finalizing";
      default:
        return "Processing";
    }
  };

  // Calculate estimated step percentage
  const getStepPercentage = () => {
    switch(stage) {
      case 'initializing':
        return 5 + (percentage * 0.1);
      case 'classifying':
        return 10 + (percentage * 0.1);
      case 'searching':
        return 20 + (percentage * 0.3);
      case 'processing':
        return 50 + (percentage * 0.2);
      case 'generating':
        return 70 + (percentage * 0.25);
      case 'streaming':
        return 95 + (percentage * 0.05);
      case 'finalizing':
        return 100;
      case 'complete':
        return 100;
      default:
        return percentage;
    }
  };

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          {getIcon()}
          <span>{getStageName()}</span>
        </div>
        <span className="text-muted-foreground">{Math.round(getStepPercentage())}%</span>
      </div>
      
      <Progress value={getStepPercentage()} max={100} className="h-1.5" indicatorClassName={getProgressClass()} />
      
      {showDetails && stageDetails && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xs text-muted-foreground mt-1"
        >
          {stageDetails}
        </motion.p>
      )}
      
      {stage === 'searching' && (
        <motion.div 
          className="flex items-center justify-center gap-1 text-xs text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Globe className="h-3 w-3 text-nexus-purple" />
          <span>Finding the latest information for you</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ResponseProgress;
