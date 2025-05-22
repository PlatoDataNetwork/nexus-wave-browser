export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  sources?: { title: string; url: string; snippet?: string }[];
  hasRealTimeData?: boolean;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
  isLoading?: boolean;
  isStreaming?: boolean;
  processingStage?: 'initializing' | 'classifying' | 'context-analysis' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  processingType?: 'individual' | 'contextual';
  progressPercentage?: number;
  stageDetails?: string;
}
