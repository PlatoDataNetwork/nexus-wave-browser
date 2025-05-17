
import React, { useState, useRef, useEffect } from 'react';
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
  Pencil,
  History,
  ChevronRight,
  Check,
  X,
  GitBranch
} from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from "@/components/ui/textarea";
import { format } from 'date-fns';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";

interface Source {
  title: string;
  url: string;
}

interface EditHistoryItem {
  id: string;
  content: string;
  timestamp: Date;
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
  isEdited?: boolean;
  editHistory?: EditHistoryItem[];
  onToggleEditHistory?: () => void;
  isRegeneratingChain?: boolean;
  // In-place editing props
  isActivelyEditing?: boolean;
  onInPlaceEdit?: (messageId: string, content: string, isInPlace: boolean) => void;
  onCancelEdit?: (messageId: string) => void;
  onSaveEdit?: (messageId: string, newContent: string) => void;
  editHistoryIndex?: number;
  editVersionCount?: number;
  onNavigateEditHistory?: (messageId: string, direction: "prev" | "next") => void;
  // New props for branching conversations
  questionVersion?: number;
  branchId?: string;
  onSwitchQuestionVersion?: (version: number) => void;
  availableQuestionVersions?: number[]; // Available versions of this question
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
  onEditMessage,
  isEdited,
  editHistory = [],
  onToggleEditHistory,
  isRegeneratingChain = false,
  // In-place editing props
  isActivelyEditing = false,
  onInPlaceEdit,
  onCancelEdit,
  onSaveEdit,
  editHistoryIndex = 0,
  editVersionCount = 1,
  onNavigateEditHistory,
  // Branching conversation props
  questionVersion,
  branchId,
  onSwitchQuestionVersion,
  availableQuestionVersions = [],
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect to focus the textarea when entering edit mode
  useEffect(() => {
    if (isActivelyEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Place cursor at the end
      textareaRef.current.selectionStart = textareaRef.current.value.length;
    }
  }, [isActivelyEditing]);
  
  // Effect to update textarea content when content changes externally (like version navigation)
  useEffect(() => {
    setEditContent(content);
  }, [content]);

  // Only show alternative navigation controls when there are actual alternatives
  const hasAlternatives = alternativeResponses && alternativeResponses.length > 0;
  const canGoBack = hasAlternatives && currentResponseIndex > 0;
  const canGoForward = hasAlternatives && currentResponseIndex < alternativeResponses.length;
  const hasEditHistory = isEdited && editHistory && editHistory.length > 0;

  // Version navigation controls
  const canGoPrevVersion = editHistoryIndex > 0;
  const canGoNextVersion = editHistoryIndex < editVersionCount - 1;
  
  // Determine if this message is part of a branch (a question with multiple versions)
  const hasMultipleVersions = questionVersion !== undefined && questionVersion > 0;

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
    if (messageId && onInPlaceEdit) {
      onInPlaceEdit(messageId, content, true);
    }
  };

  const handleCancelEdit = () => {
    if (messageId && onCancelEdit) {
      setEditContent(content); // Restore original content
      onCancelEdit(messageId);
    }
  };

  const handleSaveEdit = () => {
    if (messageId && onSaveEdit && editContent.trim()) {
      onSaveEdit(messageId, editContent);
    }
  };

  const handlePreviousVersion = () => {
    if (messageId && onNavigateEditHistory && canGoPrevVersion) {
      onNavigateEditHistory(messageId, "prev");
    }
  };

  const handleNextVersion = () => {
    if (messageId && onNavigateEditHistory && canGoNextVersion) {
      onNavigateEditHistory(messageId, "next");
    }
  };

  const handleSwitchQuestionVersion = (version: number) => {
    if (onSwitchQuestionVersion) {
      onSwitchQuestionVersion(version);
    }
  };

  const handleToggleEditHistory = () => {
    setShowEditHistory(!showEditHistory);
    if (onToggleEditHistory) {
      onToggleEditHistory();
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
  
  // For user messages, render either the message content or the edit interface
  if (role === "user") {
    if (isActivelyEditing) {
      // Render the in-place editing interface for user messages
      return (
        <div className="flex justify-end">
          <div className="max-w-3/4 rounded-lg p-4 bg-nexus-purple text-white">
            <div className="flex flex-col space-y-3">
              {hasMultipleVersions && (
                <Badge className="self-start bg-nexus-deep-purple text-white mb-1">
                  <GitBranch className="h-3 w-3 mr-1" /> Version {questionVersion}
                </Badge>
              )}
              
              <Textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px] bg-nexus-deep-purple border-nexus-deep-purple text-white placeholder:text-white/50"
                placeholder="Edit your message..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.ctrlKey) {
                    handleSaveEdit();
                  }
                }}
              />
              
              <div className="flex justify-between items-center">
                {/* Version navigation for edited messages */}
                {isEdited && (
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full border-white/20 bg-transparent text-white hover:bg-nexus-deep-purple hover:text-white"
                      onClick={handlePreviousVersion}
                      disabled={!canGoPrevVersion}
                    >
                      <ArrowLeft className="h-3 w-3" />
                    </Button>
                    
                    <span className="text-xs text-white/70">
                      Version {editHistoryIndex + 1} of {editVersionCount}
                    </span>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 w-7 p-0 rounded-full border-white/20 bg-transparent text-white hover:bg-nexus-deep-purple hover:text-white"
                      onClick={handleNextVersion}
                      disabled={!canGoNextVersion}
                    >
                      <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                <div className="flex gap-2 ml-auto">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-white/20 bg-transparent text-white hover:bg-nexus-deep-purple hover:text-white"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-7 text-xs"
                    onClick={handleSaveEdit}
                    disabled={!editContent.trim() || editContent === content}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Save
                  </Button>
                </div>
              </div>
              
              {/* Note about edit consequences */}
              <p className="text-xs text-white/70 mt-2">
                Editing this message will create a new version and generate a new response.
              </p>
            </div>
          </div>
        </div>
      );
    }
    
    // Regular display of user message (not in edit mode)
    return (
      <div className="flex justify-end">
        <div className="max-w-3/4 rounded-lg p-4 bg-nexus-purple text-white">
          <div className="whitespace-pre-wrap">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1 pr-6">
                {/* Show version badge if this is a versioned question */}
                {hasMultipleVersions && (
                  <Badge className="bg-nexus-deep-purple text-white mb-2">
                    <GitBranch className="h-3 w-3 mr-1" /> Version {questionVersion}
                  </Badge>
                )}
                
                {/* Show edited indicator and version navigation if message has been edited */}
                {isEdited && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-white/70">(edited)</span>
                    
                    {/* Version navigation controls */}
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-nexus-deep-purple rounded-full"
                        onClick={handlePreviousVersion}
                        disabled={!canGoPrevVersion}
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </Button>
                      
                      <span className="text-xs text-white/70">
                        {editHistoryIndex + 1}/{editVersionCount}
                      </span>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-nexus-deep-purple rounded-full"
                        onClick={handleNextVersion}
                        disabled={!canGoNextVersion}
                      >
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {hasEditHistory && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-nexus-deep-purple"
                        onClick={handleToggleEditHistory}
                      >
                        <History className="h-3 w-3" />
                        <span className="sr-only">Show edit history</span>
                      </Button>
                    )}
                  </div>
                )}
                <p>{content}</p>
                
                {/* Show edit history in a collapsible section */}
                {hasEditHistory && showEditHistory && (
                  <Collapsible 
                    className="mt-2 border-t border-white/20 pt-2"
                    open={showEditHistory}
                  >
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-between p-1 h-auto text-white/70 hover:text-white hover:bg-nexus-deep-purple"
                      >
                        <span className="text-xs flex items-center gap-1">
                          <History className="h-3 w-3" /> 
                          Edit History
                        </span>
                        <ChevronRight className="h-3 w-3" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="space-y-2 mt-1">
                      {editHistory.map((edit, index) => (
                        <div key={index} className="border-l-2 border-white/40 pl-2 text-white/90">
                          <div className="text-xs text-white/60 mb-1">
                            {format(edit.timestamp, 'MMM d, yyyy h:mm a')}
                          </div>
                          <div className="text-sm">{edit.content}</div>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                )}
              </div>
              
              {onEditMessage && messageId && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-nexus-deep-purple -mt-1"
                  onClick={handleEditMessage}
                  disabled={isRegeneratingChain || isActivelyEditing}
                >
                  <Pencil className="h-3 w-3" />
                  <span className="sr-only">Edit message</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // For assistant messages
  return (
    <div className="flex justify-start">
      <div className="max-w-3/4 rounded-lg p-4 bg-secondary border border-border">
        <div className="conversation-markdown">
          {hasRealTimeData && (
            <div className="mb-3 text-xs flex items-center gap-1 text-nexus-purple">
              <Globe className="h-3 w-3" />
              <span>Enhanced with real-time web data</span>
            </div>
          )}
          
          {/* If this response is part of a versioned question, show the version badge */}
          {hasMultipleVersions && questionVersion !== undefined && (
            <div className="mb-3">
              <Badge className="bg-nexus-purple/20 text-nexus-purple">
                <GitBranch className="h-3 w-3 mr-1" /> Response to Question v{questionVersion}
              </Badge>
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
          {relatedQuestions && relatedQuestions.length > 0 && (
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
                    disabled={isRegeneratingChain}
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
                    disabled={isRegeneratingChain}
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${isRegeneratingChain ? 'animate-spin' : ''}`} />
                    {isRegeneratingChain ? 'Regenerating...' : 'Regenerate'}
                  </Button>
                )}
              </div>
            </div>
            
            {/* Only show navigation controls when there are actual alternatives */}
            {hasAlternatives && (
              <div className="flex items-center justify-center gap-3 mt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 w-7 p-0 rounded-full"
                  onClick={handlePreviousResponse}
                  disabled={!canGoBack || isRegeneratingChain}
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
                  disabled={!canGoForward || isRegeneratingChain}
                >
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationMessage;
