
import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageStreamProps {
  content: string;
  isLoading?: boolean;
  isStreaming: boolean;
  progress?: number;
  streamingText?: string;
}

const MessageStream: React.FC<MessageStreamProps> = ({ 
  content, 
  isLoading = false,
  isStreaming,
  progress = 0,
  streamingText = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [cursor, setCursor] = useState(true);
  const cursorTimerRef = useRef<NodeJS.Timeout | null>(null);
  const previousContentRef = useRef<string>('');
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const [typingSpeed, setTypingSpeed] = useState<'slow' | 'medium' | 'fast'>('medium');
  
  // Adjust typing speed based on content complexity
  useEffect(() => {
    if (isStreaming && streamingText) {
      // Detect code blocks to slow down typing
      if (streamingText.includes('```')) {
        setTypingSpeed('slow');
      } 
      // Detect lists to use medium speed
      else if (streamingText.includes('- ') || streamingText.includes('1. ')) {
        setTypingSpeed('medium');
      }
      // Use fast speed for simple text
      else {
        setTypingSpeed('fast');
      }
    }
  }, [isStreaming, streamingText]);
  
  // Blink cursor effect
  useEffect(() => {
    if (isStreaming) {
      // Make cursor blink faster when typing is faster
      const blinkInterval = typingSpeed === 'fast' ? 300 : typingSpeed === 'medium' ? 400 : 500;
      
      cursorTimerRef.current = setInterval(() => {
        setCursor(prev => !prev);
      }, blinkInterval);
    } else {
      setCursor(false);
    }
    
    return () => {
      if (cursorTimerRef.current) {
        clearInterval(cursorTimerRef.current);
      }
    };
  }, [isStreaming, typingSpeed]);
  
  // Handle content updates - prioritize streamingText if provided
  useEffect(() => {
    // Only update if content/streamingText has changed to avoid unnecessary re-renders
    if (isStreaming && streamingText && streamingText !== previousContentRef.current) {
      setDisplayText(streamingText);
      previousContentRef.current = streamingText;
    } else if (content && content !== previousContentRef.current) {
      // When we have final content and we're no longer streaming
      setDisplayText(content);
      previousContentRef.current = content;
    }
  }, [content, streamingText, isStreaming]);
  
  // When streaming stops or component unmounts, clear the cursor timer
  useEffect(() => {
    return () => {
      if (cursorTimerRef.current) {
        clearInterval(cursorTimerRef.current);
        cursorTimerRef.current = null;
      }
    };
  }, []);
  
  // Reset the display text when switching to a new streaming session
  useEffect(() => {
    if (!isStreaming && content) {
      previousContentRef.current = content;
      setDisplayText(content);
    }
  }, [isStreaming, content]);
  
  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (isStreaming && contentContainerRef.current) {
      contentContainerRef.current.scrollTop = contentContainerRef.current.scrollHeight;
    }
  }, [displayText, isStreaming]);
  
  if (!displayText && !isStreaming && !isLoading) {
    return null;
  }
  
  // Cursor style based on typing speed
  const getCursorStyle = () => {
    switch(typingSpeed) {
      case 'fast': 
        return "inline-block h-4 w-1 ml-0.5 bg-current animate-pulse";
      case 'slow':
        return "inline-block h-4 w-1.5 ml-0.5 bg-current";
      default:
        return "inline-block h-4 w-1 ml-0.5 bg-current";
    }
  };
  
  return (
    <div 
      className="relative whitespace-pre-wrap break-words"
      ref={contentContainerRef}
    >
      {displayText}
      {isStreaming && (
        <span className={`${getCursorStyle()} ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}></span>
      )}
      {isStreaming && !displayText && (
        <motion.div 
          className="flex items-center text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          <span>Generating response...</span>
        </motion.div>
      )}
    </div>
  );
};

export default MessageStream;
