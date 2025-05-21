
import React, { useState } from 'react';
import { Copy, Download, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface MessageActionsProps {
  content: string;
  messageId?: string;
  onRegenerateMessage?: (messageId: string) => void;
  isStreaming?: boolean;
  isLoading?: boolean;
}

const MessageActions: React.FC<MessageActionsProps> = ({ 
  content, 
  messageId, 
  onRegenerateMessage,
  isStreaming = false,
  isLoading = false
}) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleCopy = () => {
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

  return (
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
            disabled={isStreaming || isLoading}
          >
            <ThumbsUp className="h-3 w-3 mr-1" />
            Helpful
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className={`h-7 px-2 text-xs ${disliked ? 'text-red-500' : ''}`}
            onClick={handleDislike}
            disabled={isStreaming || isLoading}
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
              disabled={isStreaming || isLoading}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Regenerate
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageActions;
