
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Globe } from "lucide-react";

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  isClassifying: boolean;
  isFetchingRealTimeData: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  setCurrentMessage,
  handleSubmit,
  isLoading,
  isClassifying,
  isFetchingRealTimeData,
}) => {
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          placeholder="Ask Nexus anything..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="flex-1 min-h-12 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <Button 
          type="submit" 
          className="h-12 bg-nexus-purple hover:bg-nexus-deep-purple flex-shrink-0"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center gap-1">
              {isClassifying ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Analyzing</span>
                </>
              ) : isFetchingRealTimeData ? (
                <>
                  <Globe className="h-4 w-4 animate-pulse" />
                  <span className="text-xs">Searching</span>
                </>
              ) : (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-xs">Thinking</span>
                </>
              )}
            </div>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
