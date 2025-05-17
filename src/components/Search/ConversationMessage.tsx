import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  Clock, 
  Globe, 
  Copy, 
  Download, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  MessageSquarePlus,
  Pencil
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar } from '@/components/ui/avatar';

interface Source {
  title: string;
  url: string;
}

interface ConversationMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  hasRealTimeData?: boolean;
  messageId?: string;
  onRegenerateMessage?: (messageId: string) => void;
  alternativeResponses?: string[];
  currentResponseIndex?: number;
  onSelectAlternative?: (index: number) => void;
  relatedQuestions?: string[];
  onRelatedQuestionClick?: (question: string) => void;
  onEditMessage?: (messageId: string, content: string) => void;
}

// Define a proper type for the code component props
interface CodeProps {
  node: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

const ConversationMessage: React.FC<ConversationMessageProps> = ({ 
  role, 
  content, 
  sources,
  hasRealTimeData,
  messageId,
  onRegenerateMessage,
  alternativeResponses = [],
  currentResponseIndex = 0,
  onSelectAlternative,
  relatedQuestions = [],
  onRelatedQuestionClick,
  onEditMessage
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  
  const hasAlternatives = alternativeResponses.length > 0;
  const canGoBack = hasAlternatives && currentResponseIndex > 0;
  const canGoForward = hasAlternatives && currentResponseIndex < alternativeResponses.length;

  const handleCopy = () => {
    // Copy the content to clipboard
    navigator.clipboard.writeText(content)
      .then(() => {
        toast.success("Content copied to clipboard");
      })
      .catch((error) => {
        console.error('Failed to copy: ', error);
        toast.error("Failed to copy content");
      });
  };

  const handleDownloadText = () => {
    // Download as plain text
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-conversation-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as text file");
  };

  const handleDownloadWord = () => {
    // Create simple Word-compatible HTML
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head>
        <meta charset="utf-8">
        <title>Nexus AI Conversation</title>
      </head>
      <body>
        <div>
          ${content.replace(/\n/g, '<br>')}
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-conversation-${new Date().toISOString().split('T')[0]}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Word document");
  };

  const handleLike = () => {
    setLiked(true);
    setDisliked(false);
    toast.success("Response marked as helpful");
  };

  const handleDislike = () => {
    setLiked(false);
    setDisliked(true);
    toast.success("Response marked as not helpful");
  };

  const handleRegenerate = () => {
    if (messageId && onRegenerateMessage) {
      onRegenerateMessage(messageId);
    }
  };

  const handlePreviousResponse = () => {
    if (onSelectAlternative && currentResponseIndex > 0) {
      onSelectAlternative(currentResponseIndex - 1);
    }
  };

  const handleNextResponse = () => {
    if (onSelectAlternative && currentResponseIndex < alternativeResponses.length) {
      onSelectAlternative(currentResponseIndex + 1);
    }
  };

  const handleEditMessage = () => {
    if (messageId && onEditMessage) {
      onEditMessage(messageId, content);
    }
  };

  // Extract domain from URL for favicon
  const getDomainFromUrl = (url: string): string => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.hostname;
    } catch (e) {
      return url.split('/')[0];
    }
  };

  // Get favicon URL from domain
  const getFaviconUrl = (domain: string): string => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  };
  
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-3/4 rounded-lg p-4 ${
          role === "user"
            ? "bg-nexus-purple text-white"
            : "bg-secondary border border-border"
        }`}
      >
        {role === "user" ? (
          <div className="whitespace-pre-wrap">
            <div className="flex justify-between items-start">
              <p className="pr-6">{content}</p>
              {onEditMessage && messageId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-nexus-deep-purple -mt-1"
                  onClick={handleEditMessage}
                >
                  <Pencil className="h-3 w-3" />
                  <span className="sr-only">Edit message</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="conversation-markdown">
            {hasRealTimeData && (
              <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
                <Globe className="h-3 w-3" />
                <span>Enhanced with real-time web data</span>
              </div>
            )}
            
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
            
            {sources && sources.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs font-medium mb-2">
                  <Clock className="h-3 w-3" />
                  <span>Sources:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sources.map((source, index) => {
                    const domain = getDomainFromUrl(source.url);
                    const faviconUrl = getFaviconUrl(domain);
                    
                    return (
                      <a 
                        key={index} 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-1 px-2 py-1 bg-background rounded-full text-xs hover:bg-muted transition-colors group"
                      >
                        <img src={faviconUrl} alt={domain} className="h-4 w-4 rounded-full" />
                        <span className="truncate max-w-[150px]">{domain}</span>
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Related Questions Section */}
            {role === "assistant" && relatedQuestions && relatedQuestions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-1 text-xs font-medium mb-2">
                  <MessageSquarePlus className="h-3 w-3" />
                  <span>Related Questions:</span>
                </div>
                <div className="flex flex-col gap-2">
                  {relatedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs h-auto py-1.5 text-left"
                      onClick={() => onRelatedQuestionClick && onRelatedQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-2 mt-4 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs"
                    onClick={handleCopy}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="end">
                      <div className="flex flex-col gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="justify-start h-7 px-2 text-xs"
                          onClick={handleDownloadText}
                        >
                          As Text (.txt)
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="justify-start h-7 px-2 text-xs"
                          onClick={handleDownloadWord}
                        >
                          As Word (.doc)
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-7 px-2 text-xs ${liked ? 'text-green-500' : ''}`}
                    onClick={handleLike}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    Helpful
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-7 px-2 text-xs ${disliked ? 'text-red-500' : ''}`}
                    onClick={handleDislike}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    Not helpful
                  </Button>
                  
                  {onRegenerateMessage && messageId && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs"
                      onClick={handleRegenerate}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Regenerate
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Navigation controls for alternative responses moved to bottom */}
              {hasAlternatives && (
                <div className="flex items-center justify-center gap-3 mt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={handlePreviousResponse}
                    disabled={!canGoBack}
                  >
                    <ArrowLeft className="h-3 w-3" />
                  </Button>
                  
                  <span className="text-xs text-muted-foreground">
                    Response {currentResponseIndex + 1} of {alternativeResponses.length + 1}
                  </span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0 rounded-full"
                    onClick={handleNextResponse}
                    disabled={!canGoForward}
                  >
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationMessage;
