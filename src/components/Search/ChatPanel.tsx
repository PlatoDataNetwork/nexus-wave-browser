
import React from 'react';
import { SidebarOpen, SidebarClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConversationDisplay from './ConversationDisplay';
import ChatInput from './ChatInput';

interface ChatPanelProps {
  showSidebar: boolean;
  toggleSidebar: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  showSidebar,
  toggleSidebar
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex items-center justify-between border-b bg-background sticky top-0 z-10">
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
        <ConversationDisplay />
        
        {/* Input area - fixed positioned at the bottom */}
        <ChatInput />
      </div>
    </div>
  );
};

export default ChatPanel;
