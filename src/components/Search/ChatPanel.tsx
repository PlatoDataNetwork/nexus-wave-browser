
import React from 'react';
import { SidebarOpen, SidebarClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationDisplay from './ConversationDisplay';
import ChatInput from './ChatInput';
import { ChatMessage } from '@/types';

interface ChatPanelProps {
  messages: ChatMessage[];
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  isClassifying: boolean;
  isFetchingRealTimeData: boolean;
  showSidebar: boolean;
  toggleSidebar: () => void;
  handleRegenerateMessage: (messageId: string) => void;
  handleSelectAlternative: (messageId: string, index: number) => void;
  handleRelatedQuestionClick: (question: string) => void;
  isAutoSubmitEnabled?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  currentMessage,
  setCurrentMessage,
  handleSubmit,
  isLoading,
  isClassifying,
  isFetchingRealTimeData,
  showSidebar,
  toggleSidebar,
  handleRegenerateMessage,
  handleSelectAlternative,
  handleRelatedQuestionClick,
  isAutoSubmitEnabled = false
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex items-center justify-between border-b bg-background">
        <h3 className="text-sm font-medium">Nexus Chat</h3>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8"
          onClick={toggleSidebar}
        >
          {showSidebar ? <SidebarClose className="h-4 w-4" /> : <SidebarOpen className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Content area with relative positioning to contain absolute elements */}
      <div className="flex-grow relative overflow-hidden">
        {/* Messages area fills the space with padding for the fixed input */}
        <ConversationDisplay 
          messages={messages}
          setCurrentMessage={setCurrentMessage}
          handleRegenerateMessage={handleRegenerateMessage}
          handleSelectAlternative={handleSelectAlternative}
          handleRelatedQuestionClick={handleRelatedQuestionClick}
        />
        
        {/* Input area - absolutely positioned at the bottom */}
        <ChatInput 
          currentMessage={currentMessage}
          setCurrentMessage={setCurrentMessage}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          isClassifying={isClassifying}
          isFetchingRealTimeData={isFetchingRealTimeData}
          isAutoSubmitEnabled={isAutoSubmitEnabled}
        />
      </div>
    </div>
  );
};

export default ChatPanel;
