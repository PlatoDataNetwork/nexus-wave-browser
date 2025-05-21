
import React, { useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2, Brain, Network, Search } from "lucide-react";

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading?: boolean;
  isClassifying?: boolean;
  isFetchingRealTimeData?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  currentMessage, 
  setCurrentMessage, 
  handleSubmit,
  isLoading = false,
  isClassifying = false,
  isFetchingRealTimeData = false
}) => {
  const getStatusIndicator = () => {
    if (isClassifying) {
      return (
        <div className="flex items-center gap-1 text-xs text-nexus-purple animate-pulse">
          <Brain className="h-3 w-3" />
          <span>Analyzing query</span>
        </div>
      );
    } else if (isFetchingRealTimeData) {
      return (
        <div className="flex items-center gap-1 text-xs text-nexus-purple animate-pulse">
          <Search className="h-3 w-3" />
          <span>Searching for real-time data</span>
        </div>
      );
    } else if (isLoading) {
      return (
        <div className="flex items-center gap-1 text-xs text-nexus-purple animate-pulse">
          <Network className="h-3 w-3" />
          <span>Processing response</span>
        </div>
      );
    }
    return null;
  };

  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }} 
      className="flex flex-col gap-2 relative"
    >
      {getStatusIndicator() && (
        <div className="absolute -top-6 left-0 right-0">
          {getStatusIndicator()}
        </div>
      )}
      
      <div className="flex gap-2">
        <Textarea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          placeholder="Ask a question or describe what you need..."
          className="min-h-12 resize-none"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button
          className="h-full bg-nexus-purple hover:bg-nexus-deep-purple"
          disabled={isLoading || !currentMessage.trim()}
          type="submit"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
