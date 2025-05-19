
import React, { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Loader2 } from 'lucide-react';

interface MessageStreamProps {
  isLoading: boolean;
  streamingText: string;
  onStreamingComplete?: () => void;
}

// Define a proper type for the code component props
interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const MessageStream: React.FC<MessageStreamProps> = ({
  isLoading,
  streamingText,
  onStreamingComplete
}) => {
  const [visibleText, setVisibleText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Effect to handle typing animation
  useEffect(() => {
    // If we're still getting content, don't animate yet
    if (isLoading) {
      setIsTyping(false);
      return;
    }
    
    // New content received, start typing animation
    if (streamingText !== visibleText) {
      setIsTyping(true);
      
      // Clear any existing typing timer
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
      
      // Set a timer to finish typing after a delay
      typingTimerRef.current = setTimeout(() => {
        setVisibleText(streamingText);
        setIsTyping(false);
        
        if (onStreamingComplete) {
          onStreamingComplete();
        }
      }, 300); // Short delay to show typing indicator
    }
    
    // Cleanup
    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [streamingText, isLoading, visibleText, onStreamingComplete]);
  
  // Scroll to bottom when new content is added - improved with better timing
  useEffect(() => {
    if (contentRef.current) {
      // Use a small timeout to ensure the DOM has updated
      const scrollTimeout = setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [visibleText]);
  
  return (
    <div className="message-stream conversation-markdown" ref={contentRef}>
      <ReactMarkdown
        components={{
          code: ({ node, inline, className, children, ...props }: CodeProps) => {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={atomDark}
                PreTag="div"
                className="rounded-md my-2"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            )
          },
          p: ({children}) => <p className="mb-2">{children}</p>,
          ul: ({children}) => <ul className="list-disc ml-6 mb-3">{children}</ul>,
          ol: ({children}) => <ol className="list-decimal ml-6 mb-3">{children}</ol>,
          li: ({children}) => <li className="mb-1">{children}</li>,
          h1: ({children}) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
          h2: ({children}) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
          h3: ({children}) => <h3 className="text-md font-bold mb-2">{children}</h3>,
          a: ({href, children}) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-nexus-purple underline hover:text-nexus-deep-purple"
            >
              {children}
            </a>
          ),
          img: ({src, alt}) => (
            <img 
              src={src} 
              alt={alt || ''} 
              className="max-w-full h-auto rounded-md my-2" 
            />
          )
        }}
      >
        {visibleText || ' '} 
      </ReactMarkdown>
      {isTyping && <span className="typing-cursor">|</span>}
      {isLoading && (
        <span className="inline-flex items-center">
          <Loader2 className="h-3 w-3 animate-spin ml-1 mr-1" />
        </span>
      )}
    </div>
  );
};

export default MessageStream;
