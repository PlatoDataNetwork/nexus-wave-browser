
import React from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Globe } from "lucide-react";
import { useConversationContext } from '@/contexts/ConversationContext';

interface ChatInputProps {
  placeholder?: string;
  className?: string;
  onFocus?: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({
  placeholder = "Ask Nexus anything...",
  className = "",
  onFocus
}) => {
  const {
    currentMessage,
    setCurrentMessage,
    handleSubmit,
    isLoading,
    isClassifying,
    isFetchingRealTimeData,
  } = useConversationContext();

  const onSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    handleSubmit();
  };

  return (
    <div className={`p-4 w-full bg-background/95 backdrop-blur-sm border-t fixed bottom-0 left-0 right-0 z-50 ${className}`}>
      <form onSubmit={onSubmit} className="flex gap-2">
        <Textarea
          placeholder={placeholder}
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="flex-1 min-h-12 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSubmit();
            }
          }}
          onFocus={onFocus}
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
