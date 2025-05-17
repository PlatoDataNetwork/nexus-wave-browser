
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
  // Added fields to track branches and versioning
  questionId?: string;            // ID of the question this message responds to (for assistant messages)
  questionVersion?: number;       // Version number of the question
  branchId?: string;              // ID of the branch this message belongs to
  alternativeResponses?: string[]; // Alternative responses (only for primary responses)
  currentResponseIndex?: number;   // Current index in alternativeResponses array
  isEdited?: boolean;              // Whether this message has been edited
  editHistory?: EditHistoryItem[]; // History of edits for this message
}

export interface ConversationBranch {
  id: string;
  questionId: string;          // ID of the question that started this branch
  questionVersion: number;     // Version number of the question
  messageIds: string[];        // IDs of messages in this branch
  parentBranchId?: string;     // ID of the parent branch (if branched from another conversation)
}
