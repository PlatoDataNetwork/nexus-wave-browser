
// Types for the conversation chat system
export interface Source {
  title: string;
  url: string;
}

export interface EditHistoryItem {
  id: string;
  content: string;
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: Source[];
  hasRealTimeData?: boolean;
  
  // Simplified versioning and editing fields
  isEdited?: boolean;
  editHistory?: EditHistoryItem[];
  isActivelyEditing?: boolean;
  
  // Simplified alternative responses handling
  alternativeResponses?: string[];
  currentResponseIndex?: number;
}

// Simplified conversation branch structure
export interface ConversationGroup {
  id: string;
  messageIds: string[];
}
