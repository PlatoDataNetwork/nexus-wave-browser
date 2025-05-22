
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Loader2, Search, Database, Brain, CheckCircle, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProcessingStageInfo {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface ResponseProgressProps {
  stage: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  percentage: number;
  showDetails?: boolean;
  stageDetails?: string;
}

const ResponseProgress: React.FC<ResponseProgressProps> = ({
  stage = 'classifying',
  percentage = 0,
  showDetails = false,
  stageDetails
}) => {
  // Define information for each processing stage
  const stageInfo: Record<string, ProcessingStageInfo> = {
    initializing: {
      title: "Initializing",
      description: "Starting the response process...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      color: "text-blue-400"
    },
    classifying: {
      title: "Analyzing",
      description: "Understanding your query...",
      icon: <Brain className="h-4 w-4" />,
      color: "text-purple-400"
    },
    searching: {
      title: "Searching",
      description: "Looking up real-time information...",
      icon: <Search className="h-4 w-4" />,
      color: "text-green-400"
    },
    processing: {
      title: "Processing",
      description: "Processing information from multiple sources...",
      icon: <Database className="h-4 w-4" />,
      color: "text-amber-400"
    },
    generating: {
      title: "Generating",
      description: "Creating your response...",
      icon: <Zap className="h-4 w-4" />,
      color: "text-orange-400"
    },
    streaming: {
      title: "Streaming",
      description: "Displaying real-time response...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      color: "text-nexus-purple"
    },
    finalizing: {
      title: "Finalizing",
      description: "Putting everything together...",
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      color: "text-blue-500"
    },
    complete: {
      title: "Complete",
      description: "Response is ready",
      icon: <CheckCircle className="h-4 w-4" />,
      color: "text-green-500"
    }
  };

  // Default to 'classifying' info if stage is not found
  const currentInfo = stageInfo[stage] || stageInfo.classifying;
  
  // Create timeline steps
  const timelineSteps = ['classifying', 'searching', 'processing', 'generating', 'complete'];
  const currentStepIndex = timelineSteps.indexOf(stage);
  
  return (
    <motion.div 
      className="w-full space-y-3"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Progress 
        value={percentage} 
        className="h-1.5" 
      />
      
      {showDetails && (
        <div className="space-y-2">
          <motion.div 
            className={`flex items-center justify-between text-xs ${currentInfo.color}`}
            key={stage} // This forces a re-render and animation when stage changes
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-1">
              {currentInfo.icon}
              <span>{currentInfo.title}</span>
            </div>
            <span className="text-right font-medium">{percentage.toFixed(0)}%</span>
          </motion.div>
          
          {stageDetails && (
            <motion.p 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {stageDetails}
            </motion.p>
          )}
          
          {/* Timeline visualization */}
          <div className="flex items-center justify-between pt-1">
            {timelineSteps.map((step, index) => (
              <motion.div 
                key={step}
                className={`flex flex-col items-center`}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ 
                  scale: currentStepIndex >= index ? 1 : 0.8,
                  opacity: currentStepIndex >= index ? 1 : 0.6
                }}
              >
                <div 
                  className={`h-2 w-2 rounded-full mb-1 ${
                    currentStepIndex > index 
                      ? 'bg-green-500' 
                      : currentStepIndex === index 
                        ? 'bg-nexus-purple animate-pulse' 
                        : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                />
                {index < timelineSteps.length - 1 && (
                  <div className="h-[1px] w-12 bg-gray-200 dark:bg-gray-700 -mt-1.5"></div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ResponseProgress;
