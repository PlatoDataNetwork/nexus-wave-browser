
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Globe, Loader2, Zap, Sparkles } from 'lucide-react';
import MessageStream from './MessageStream';
import ResponseProgress from './ResponseProgress';
import { motion } from 'framer-motion';
import WebResearchCard from './WebResearchCard';

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
  stageDetails?: string;
  searchQuery?: string;
  webResults?: Array<{title: string, url: string, snippet: string}>;
}

const MessageContent: React.FC<MessageContentProps> = ({
  content,
  hasRealTimeData = false,
  isLoading = false,
  isStreaming = false,
  streamProgress = 0,
  processingStage = 'classifying',
  progressPercentage = 0,
  stageDetails,
  searchQuery,
  webResults = []
}) => {
  // Determine if we should show the progress indicator
  const showProgressIndicator = isLoading && processingStage !== 'complete';
  
  // Determine if we should show web research card
  const showWebResearch = (processingStage === 'searching' || webResults.length > 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="conversation-markdown"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {hasRealTimeData && (
        <motion.div 
          className="mb-3 text-xs flex items-center gap-1 text-nexus-purple"
          variants={itemVariants}
        >
          <Sparkles className="h-3 w-3" />
          <span className="flex items-center">
            Enhanced with real-time web data
            <Zap className="h-3 w-3 ml-1 animate-pulse" />
          </span>
        </motion.div>
      )}
      
      {/* Show web research card during search phase or when we have results */}
      {showWebResearch && processingStage === 'searching' && (
        <motion.div 
          variants={itemVariants}
          className="mb-4"
        >
          <WebResearchCard 
            query={searchQuery || ''} 
            isSearching={processingStage === 'searching'}
            results={webResults}
          />
        </motion.div>
      )}
      
      {/* Show improved progress indicator when loading */}
      {showProgressIndicator && (
        <motion.div 
          className="mb-4"
          variants={itemVariants}
        >
          <ResponseProgress 
            stage={processingStage} 
            percentage={progressPercentage}
            showDetails={true}
            stageDetails={stageDetails}
          />
        </motion.div>
      )}
      
      {/* Improved streaming display */}
      {isStreaming ? (
        <motion.div variants={itemVariants}>
          <MessageStream 
            isStreaming={isStreaming} 
            content={content} 
            isLoading={isLoading} 
            progress={streamProgress}
            streamingText={content}
          />
          
          {isLoading && streamProgress > 0 && (
            <div className="flex items-center gap-2 mt-2 text-xs text-nexus-purple">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Generating response {streamProgress.toFixed(0)}%</span>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div 
          variants={itemVariants}
          className={isLoading ? "animate-pulse opacity-80" : ""}
        >
          <ReactMarkdown
            components={{
              code: ({ node, inline, className, children, ...props }: CodeProps) => {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <SyntaxHighlighter
                      language={match[1]}
                      style={atomDark}
                      PreTag="div"
                      className="rounded-md my-3 overflow-hidden"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  </motion.div>
                ) : (
                  <code className="bg-gray-800 text-gray-200 px-1 py-0.5 rounded" {...props}>
                    {children}
                  </code>
                )
              },
              p: ({children}) => <p className="mb-3 leading-relaxed">{children}</p>,
              ul: ({children}) => <ul className="list-disc ml-6 mb-4 space-y-1">{children}</ul>,
              ol: ({children}) => <ol className="list-decimal ml-6 mb-4 space-y-1">{children}</ol>,
              li: ({children}) => <li className="mb-1">{children}</li>,
              h1: ({children}) => <h1 className="text-xl font-bold mb-3 pb-1 border-b border-gray-200 dark:border-gray-700">{children}</h1>,
              h2: ({children}) => <h2 className="text-lg font-bold mb-2 mt-4">{children}</h2>,
              h3: ({children}) => <h3 className="text-md font-bold mb-2 mt-3">{children}</h3>,
              a: ({href, children}) => (
                <a 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-nexus-purple underline hover:text-nexus-deep-purple transition-colors"
                >
                  {children}
                </a>
              ),
              img: ({src, alt}) => (
                <img 
                  src={src} 
                  alt={alt || ''} 
                  className="max-w-full h-auto rounded-md my-4 border border-gray-200 dark:border-gray-700 shadow-sm" 
                />
              ),
              blockquote: ({children}) => (
                <blockquote className="border-l-4 border-nexus-purple pl-4 italic my-4 text-gray-700 dark:text-gray-300">
                  {children}
                </blockquote>
              )
            }}
          >
            {content}
          </ReactMarkdown>
        </motion.div>
      )}
      
      {/* Display improved loading state - show only if not streaming and not showing progress indicator */}
      {isLoading && !isStreaming && !showProgressIndicator && (
        <div className="flex items-center justify-center gap-2 py-6 text-nexus-purple">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="animate-pulse-glow">Generating response...</span>
        </div>
      )}
      
      {/* Show web search results at the bottom of complete messages when applicable */}
      {!isLoading && !isStreaming && webResults.length > 0 && (
        <motion.div 
          variants={itemVariants}
          className="mt-4 pt-4 border-t border-border/30"
        >
          <div className="text-xs text-muted-foreground mb-2 flex items-center">
            <Globe className="h-3 w-3 mr-1 text-nexus-purple" />
            <span>Search results used for this answer:</span>
          </div>
          <div className="space-y-2">
            {webResults.slice(0, 3).map((result, idx) => (
              <div key={idx} className="text-xs">
                <a 
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-nexus-purple hover:underline font-medium"
                >
                  {result.title}
                </a>
                <p className="text-muted-foreground line-clamp-1">{result.snippet}</p>
              </div>
            ))}
            {webResults.length > 3 && (
              <div className="text-xs text-muted-foreground">
                + {webResults.length - 3} more sources
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageContent;
