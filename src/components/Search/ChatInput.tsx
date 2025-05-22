
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Globe, Brain, Zap } from "lucide-react";
import { motion } from 'framer-motion';

interface ChatInputProps {
  currentMessage: string;
  setCurrentMessage: (message: string) => void;
  handleSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  isClassifying: boolean;
  isFetchingRealTimeData: boolean;
  isAutoSubmitEnabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  currentMessage,
  setCurrentMessage,
  handleSubmit,
  isLoading,
  isClassifying,
  isFetchingRealTimeData,
  isAutoSubmitEnabled = false,
}) => {
  // Track auto-submission to prevent duplicates
  const hasAutoSubmittedRef = useRef<boolean>(false);
  
  // Reset auto-submit flag when message changes
  useEffect(() => {
    if (currentMessage === '') {
      hasAutoSubmittedRef.current = false;
    }
  }, [currentMessage]);
  
  // Animation variants
  const buttonVariants = {
    idle: { scale: 1 },
    loading: { scale: 1.05 }
  };

  // Handle key down events for Enter key submission
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Only auto-submit if explicitly enabled (for prompts and follow-up questions)
      // and we haven't already auto-submitted this message
      if (isAutoSubmitEnabled && currentMessage.trim() && !hasAutoSubmittedRef.current) {
        console.log('Auto-submitting via Enter key');
        hasAutoSubmittedRef.current = true;
        handleSubmit();
      } else if (!isAutoSubmitEnabled) {
        // For regular messages, don't auto-submit on Enter, let the button handle it
        console.log('Enter pressed, but auto-submit is disabled');
      }
    }
  };

  return (
    <motion.div 
      className="p-4 w-full bg-background/95 backdrop-blur-sm border-t absolute bottom-0 left-0 right-0 z-50"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={(e) => {
        e.preventDefault();
        if (!isLoading && currentMessage.trim()) {
          console.log('Manual submit via button');
          handleSubmit();
        }
      }} className="flex gap-2">
        <Textarea
          placeholder="Ask Nexus anything..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="flex-1 min-h-12 resize-none focus:border-nexus-purple transition-colors"
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <motion.div
          variants={buttonVariants}
          animate={isLoading ? "loading" : "idle"}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Button 
            type="submit" 
            className={`h-12 ${isLoading ? 'bg-nexus-deep-purple' : 'bg-nexus-purple'} hover:bg-nexus-deep-purple flex-shrink-0`}
            disabled={isLoading || !currentMessage.trim()}
          >
            {isLoading ? (
              <motion.div 
                className="flex items-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {isClassifying ? (
                  <>
                    <Brain className="h-4 w-4 animate-pulse" />
                    <span className="text-xs">Analyzing</span>
                  </>
                ) : isFetchingRealTimeData ? (
                  <>
                    <Globe className="h-4 w-4 animate-pulse" />
                    <span className="text-xs">Searching</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 animate-pulse" />
                    <span className="text-xs">Processing</span>
                  </>
                )}
              </motion.div>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </motion.div>
      </form>
      
      {isLoading && (
        <motion.div 
          className="mt-2 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-muted-foreground">
            {isClassifying 
              ? "Analyzing your request..."
              : isFetchingRealTimeData 
                ? "Searching the web for real-time information..." 
                : "Generating a response based on the information..."}
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatInput;
