
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
    if (streamingText && streamingText !== previousContentRef.current) {
      setDisplayText(streamingText);
      previousContentRef.current = streamingText;
    } else if (content && content !== previousContentRef.current) {
      setDisplayText(content);
      previousContentRef.current = content;
    }
  }, [content, streamingText]);
  
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
    if (!isStreaming) {
      previousContentRef.current = content;
    }
  }, [isStreaming, content]);
  
  if (!displayText && !isStreaming && !isLoading) {
    return null;
  }
  
  return (
    <div className="relative whitespace-pre-wrap break-words">
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
