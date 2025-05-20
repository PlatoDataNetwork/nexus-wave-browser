
import React, { useEffect, useState, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface MessageStreamProps {
  content: string;
  isLoading?: boolean; // Added isLoading prop
  isStreaming: boolean;
  progress?: number;
  streamingText?: string; // Added streamingText prop to support the MessageContent usage
}

const MessageStream: React.FC<MessageStreamProps> = ({ 
  content, 
  isLoading = false, // Default value
  isStreaming,
  progress = 0,
  streamingText = '' // Default value 
}) => {
  const [displayText, setDisplayText] = useState('');
  const [cursor, setCursor] = useState(true);
  const cursorTimerRef = useRef<NodeJS.Timeout | null>(null);
  
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
    setDisplayText(streamingText || content);
  }, [content, streamingText]);
  
  if (!displayText && !isStreaming && !isLoading) {
    return null;
  }
  
  return (
    <div className="relative">
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
