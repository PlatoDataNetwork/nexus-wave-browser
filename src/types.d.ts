
// Define application-wide types
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  progressPercentage?: number;
  stageDetails?: string;
  hasRealTimeData?: boolean;
  sources?: Array<{ title: string; url: string }>;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
}
