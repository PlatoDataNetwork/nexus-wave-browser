
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Copy, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from 'sonner';

interface MessageActionsProps {
  content: string;
  messageId?: string;
  onRegenerateMessage?: (messageId: string) => void;
  isStreaming?: boolean;
  isLoading?: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({ 
  content, 
  messageId,
  onRegenerateMessage,
  isStreaming = false,
  isLoading = false
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard");
  };
  
  const handleRegenerate = () => {
    if (messageId && onRegenerateMessage) {
      onRegenerateMessage(messageId);
    }
  };
  
  const handleFeedback = (type: 'like' | 'dislike') => {
    toast.success(`Thank you for your ${type === 'like' ? 'positive' : 'negative'} feedback`);
    // In a real app, this would send the feedback to your analytics or logging system
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 text-xs">
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-7 text-xs gap-1"
        onClick={handleCopy}
        disabled={isLoading || isStreaming}
      >
        <Copy className="h-3 w-3" />
        Copy
      </Button>
      
      {onRegenerateMessage && messageId && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 text-xs gap-1"
          onClick={handleRegenerate}
          disabled={isLoading || isStreaming}
        >
          <RefreshCw className="h-3 w-3" />
          Regenerate
        </Button>
      )}
      
      <div className="flex items-center gap-1 ml-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0"
          onClick={() => handleFeedback('like')}
          disabled={isLoading || isStreaming}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7 w-7 p-0"
          onClick={() => handleFeedback('dislike')}
          disabled={isLoading || isStreaming}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
};

export default MessageActions;
