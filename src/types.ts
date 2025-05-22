
export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'streaming' | 'processing' | 'generating' | 'finalizing' | 'complete';
  progressPercentage?: number;
  stageDetails?: string;
  isLoading?: boolean;
  isStreaming?: boolean;
  hasRealTimeData?: boolean;
  sources?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
}
