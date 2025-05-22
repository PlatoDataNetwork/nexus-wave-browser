
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ResponseProgress from './ResponseProgress';

interface MessageContentProps {
  content: string;
  hasRealTimeData?: boolean;
  isLoading?: boolean;
  isStreaming?: boolean;
  processingStage?: 'initializing' | 'classifying' | 'context-analysis' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  processingType?: 'individual' | 'contextual';
  progressPercentage?: number;
  stageDetails?: string;
  searchQuery?: string;
  webResults?: Array<{title: string, url: string, snippet: string}>;
}

const MessageContent: React.FC<MessageContentProps> = ({ 
  content, 
  hasRealTimeData = false,
  isLoading = false,
  isStreaming = false,
  processingStage = 'generating',
  processingType = 'individual',
  progressPercentage = 40,
  stageDetails,
  searchQuery,
  webResults
}) => {
  // If there's no content and it's not loading/streaming, avoid rendering
  if (!content && !isLoading && !isStreaming) {
    return null;
  }
  
  // Show loading states
  if (isLoading || isStreaming) {
    return (
      <>
        {/* Loading indicator should take priority */}
        {isLoading && (
          <ResponseProgress
            processingStage={processingStage}
            processingType={processingType}
            progressPercentage={progressPercentage}
            stageDetails={stageDetails || "Processing your request..."}
          />
        )}
        
        {/* Show content while streaming */}
        {(content || '').length > 0 && (
          <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none break-words">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  // Fixed: Use type checking instead of direct property access
                  const isInline = props && 'inline' in props ? props.inline : false;
                  return !isInline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </>
    );
  }
  
  // Show web search data banner
  if (hasRealTimeData && webResults && webResults.length > 0) {
    return (
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-100 p-2 rounded-lg flex items-center space-x-2 text-xs text-green-800"
        >
          <Search className="h-3 w-3 text-green-600" />
          <span>Enhanced with real-time information from the web</span>
        </motion.div>
        
        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none break-words">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                // Fixed: Use type checking instead of direct property access
                const isInline = props && 'inline' in props ? props.inline : false;
                return !isInline && match ? (
                  <SyntaxHighlighter
                    style={vscDarkPlus}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    );
  }
  
  // Default content display
  return (
    <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none break-words">
      {isLoading && (
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <ResponseProgress 
            processingStage={processingStage} 
            progressPercentage={progressPercentage}
            stageDetails={stageDetails}
            processingType={processingType}
          />
        </motion.div>
      )}
      
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            // Fixed: Use type checking instead of direct property access
            const isInline = props && 'inline' in props ? props.inline : false;
            return !isInline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MessageContent;
