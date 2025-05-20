
import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

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
  
  // Blink cursor effect
  useEffect(() => {
    if (isStreaming) {
      cursorTimerRef.current = setInterval(() => {
        setCursor(prev => !prev);
      }, 500);
    } else {
      setCursor(false);
    }
    
    return () => {
      if (cursorTimerRef.current) {
        clearInterval(cursorTimerRef.current);
      }
    };
  }, [isStreaming]);
  
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
  
  return (
    <div 
      className="relative whitespace-pre-wrap break-words"
      ref={contentContainerRef}
    >
      {displayText}
      {isStreaming && (
        <span className={`inline-block h-4 w-1 ml-0.5 bg-current ${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}></span>
      )}
      {isStreaming && !displayText && (
        <div className="flex items-center text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          <span>Generating response...</span>
        </div>
      )}
    </div>
  );
};

export default MessageStream;
