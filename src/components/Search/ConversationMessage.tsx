
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
  ArrowRight 
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

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
  onSelectAlternative
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
          <p className="whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="conversation-markdown">
            {hasAlternatives && (
              <div className="flex items-center justify-end gap-1 mb-3">
                <span className="text-xs text-muted-foreground">
                  Version {currentResponseIndex + 1} of {alternativeResponses.length + 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={handlePreviousResponse}
                  disabled={!canGoBack}
                >
                  <ArrowLeft className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                  onClick={handleNextResponse}
                  disabled={!canGoForward}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            )}
            
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
            
            {role === "assistant" && (
              <div className="flex items-center justify-end gap-1 mt-4 pt-2 border-t border-border">
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
            )}
          </div>
        )}
        
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-1 text-xs font-medium mb-1">
              <Clock className="h-3 w-3" />
              <span>Sources:</span>
            </div>
            <ul className="space-y-1">
              {sources.map((source, index) => (
                <li key={index} className="text-xs">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-nexus-purple underline hover:text-nexus-deep-purple">
                    {source.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationMessage;
