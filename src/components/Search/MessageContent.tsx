
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, Clock } from 'lucide-react';
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
  dataTimestamp?: Date | string | null;
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
  webResults,
  dataTimestamp = null
}) => {
  // If there's no content and it's not loading/streaming, avoid rendering
  if (!content && !isLoading && !isStreaming) {
    return null;
  }
  
  // Check if data is actually recent (within the last week)
  const isDataActuallyRecent = () => {
    if (!dataTimestamp) return false;
    
    const timestamp = dataTimestamp instanceof Date 
      ? dataTimestamp 
      : new Date(dataTimestamp);
    
    if (isNaN(timestamp.getTime())) return false;
    
    // Data is considered recent if it's less than a week old
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return timestamp > oneWeekAgo;
  };
  
  const formatDataAge = () => {
    if (!dataTimestamp) return "Unknown date";
    
    const timestamp = dataTimestamp instanceof Date 
      ? dataTimestamp 
      : new Date(dataTimestamp);
    
    if (isNaN(timestamp.getTime())) return "Date unavailable";
    
    // Format the date
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - timestamp.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffDays / 365)} years ago`;
    }
  };
  
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
                  // Use proper type checking for inline property
                  const isInline = !!(props && typeof props === 'object' && 'inline' in props && props.inline);
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
  
  // Data freshness checks for real-time banner
  const dataIsRecent = isDataActuallyRecent();
  const shouldShowRealTimeBanner = hasRealTimeData && webResults && webResults.length > 0;
  
  // Show web search data banner
  if (shouldShowRealTimeBanner) {
    return (
      <div className="space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border p-2 rounded-lg flex items-center space-x-2 text-xs ${
            dataIsRecent 
              ? 'bg-gradient-to-r from-green-50 to-teal-50 border-green-100 text-green-800' 
              : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100 text-amber-800'
          }`}
        >
          {dataIsRecent ? (
            <>
              <Search className="h-3 w-3 text-green-600" />
              <span>Enhanced with real-time information from the web</span>
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 text-amber-600" />
              <span>Enhanced with web information from {formatDataAge()}</span>
            </>
          )}
        </motion.div>
        
        <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none break-words">
          <ReactMarkdown
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                // Use proper type checking for inline property
                const isInline = !!(props && typeof props === 'object' && 'inline' in props && props.inline);
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
            // Use proper type checking for inline property
            const isInline = !!(props && typeof props === 'object' && 'inline' in props && props.inline);
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
