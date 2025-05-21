
export interface WebSearchResult {
  title: string;
  link: string;
  snippet: string;
  source?: string;
  published?: string;
  position?: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
    snippet?: string;
  }[];
  hasRealTimeData?: boolean;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  relatedQuestions?: string[];
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  progressPercentage?: number;
  stageDetails?: string;
}

export interface ConversationContextType {
  messages: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  isLoading: boolean;
  isClassifying: boolean;
  isFetchingRealTimeData: boolean;
  currentQuery: string;
  handleSubmit: (e?: React.FormEvent) => void;
  handleRelatedQuestionClick: (question: string) => void;
  handleRegenerateMessage: (messageId: string) => void;
  handleSelectAlternative: (messageId: string, index: number) => void;
  setCategoryContext: (category: string | null) => void;
  categoryContext: string | null;
  clearMessages: () => void;
}
