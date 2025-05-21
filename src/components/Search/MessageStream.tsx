
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Define a proper type for the code component props
interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

interface MessageStreamProps {
  content: string;
  isStreaming: boolean;
  isLoading: boolean;
  progress?: number;
}

const MessageStream: React.FC<MessageStreamProps> = ({
  content,
  isStreaming,
  isLoading,
  progress = 0
}) => {
  const [cursorBlink, setCursorBlink] = useState(true);
  
  // Blinking cursor effect
  useEffect(() => {
    if (!isStreaming || !isLoading) return;
    
    const interval = setInterval(() => {
      setCursorBlink(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isStreaming, isLoading]);
  
  return (
    <div className="relative">
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
          a: ({href, children}) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-nexus-purple underline hover:text-nexus-deep-purple">{children}</a>,
          img: ({src, alt}) => <img src={src} alt={alt || ''} className="max-w-full h-auto rounded-md my-2" />
        }}
      >
        {content}
      </ReactMarkdown>
      
      {/* Show cursor only when streaming */}
      {isStreaming && isLoading && (
        <span className={`inline-block h-4 w-0.5 ml-1 ${cursorBlink ? 'bg-nexus-purple' : 'bg-transparent'} transition-colors duration-300`}></span>
      )}
    </div>
  );
};

export default MessageStream;
