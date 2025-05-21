
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
    date?: string;
  }[];
  hasRealTimeData?: boolean;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
  // Progress tracking properties
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete'; 
  progressPercentage?: number;
  stageDetails?: string;
  // Additional streaming and loading state properties
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
  // New property for tracking processing time
  timeToProcess?: number;
}

// New interface for OpenAI streaming options
export interface StreamingOptions {
  systemPrompt?: string;
  incorporateWebContent?: boolean;
}
