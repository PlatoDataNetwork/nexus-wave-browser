
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Globe, Loader2 } from 'lucide-react';
import MessageStream from './MessageStream';
import ResponseProgress from './ResponseProgress';

// Define a proper type for the code component props
interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

interface MessageContentProps {
  content: string;
  hasRealTimeData?: boolean;
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  progressPercentage?: number;
}

const MessageContent: React.FC<MessageContentProps> = ({
  content,
  hasRealTimeData = false,
  isLoading = false,
  isStreaming = false,
  streamProgress = 0,
  processingStage = 'classifying',
  progressPercentage = 0
}) => {
  // Determine if we should show the progress indicator
  const showProgressIndicator = isLoading && processingStage !== 'complete';

  return (
    <div className="conversation-markdown">
      {hasRealTimeData && (
        <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
          <Globe className="h-3 w-3" />
          <span>Enhanced with real-time web data</span>
        </div>
      )}
      
      {/* Show improved progress indicator when loading */}
      {showProgressIndicator && (
        <div className="mb-4">
          <ResponseProgress 
            stage={processingStage} 
            percentage={progressPercentage}
            showDetails={true}
          />
        </div>
      )}
      
      {/* Improved streaming display */}
      {isStreaming ? (
        <div>
          <MessageStream 
            isStreaming={isStreaming} 
            content={content} 
            isLoading={isLoading} 
            progress={streamProgress}
          />
          
          {isLoading && streamProgress > 0 && (
            <div className="flex items-center gap-2 mt-2 text-xs text-nexus-purple">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generating response {streamProgress.toFixed(0)}%</span>
            </div>
          )}
        </div>
      ) : (
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
      )}
      
      {/* Display improved loading state - show only if not streaming and not showing progress indicator */}
      {isLoading && !isStreaming && !showProgressIndicator && (
        <div className="flex items-center justify-center gap-2 py-6 text-nexus-purple">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="animate-pulse-glow">Generating response...</span>
        </div>
      )}
    </div>
  );
};

export default MessageContent;
