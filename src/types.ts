
// Search and chat related types
export interface EditHistoryItem {
  id: string;
  timestamp: Date;
  content: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
  hasRealTimeData?: boolean;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
  // Progress tracking properties
  processingStage?: 'classifying' | 'searching' | 'processing' | 'generating' | 'complete'; 
  progressPercentage?: number;
  stageDetails?: string;
  // Additional streaming and loading state properties
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
}
