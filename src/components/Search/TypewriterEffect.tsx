import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { Button } from '@/components/ui/button';
import { Loader2, Square } from 'lucide-react';

interface TypewriterEffectProps {
  content: string;
  isStreaming: boolean;
  onStreamingComplete: () => void;
  onSkipAnimation?: () => void;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  content,
  isStreaming,
  onStreamingComplete,
  onSkipAnimation
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep up with the latest content
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedContent]);

  // Update the displayed content as new chunks come in
  useEffect(() => {
    setDisplayedContent(content);
    
    // If streaming has completed, remove the cursor
    if (!isStreaming && content.length > 0) {
      setTimeout(() => {
        setShowCursor(false);
        onStreamingComplete();
      }, 500);
    }
  }, [content, isStreaming, onStreamingComplete]);

  // Blinking cursor effect
  useEffect(() => {
    if (!isStreaming) return;
    
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, [isStreaming]);

  return (
    <div className="relative">
      <div 
        ref={containerRef}
        className="prose dark:prose-invert max-w-none break-words"
      >
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '');
              return !inline && match ? (
                <SyntaxHighlighter
                  language={match[1]}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {displayedContent}
        </ReactMarkdown>
        {isStreaming && showCursor && <span className="animate-blink">▌</span>}
      </div>
      
      {isStreaming && (
        <div className="mt-2 flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onSkipAnimation}
            className="flex items-center space-x-1"
          >
            <Square className="h-3 w-3" />
            <span>Stop streaming</span>
          </Button>
          <div className="text-xs text-muted-foreground flex items-center">
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            <span>Streaming response...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TypewriterEffect;
