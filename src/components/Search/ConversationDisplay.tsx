
import React, { useRef, useEffect, useCallback } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationMessage from './ConversationMessage';
import WelcomeMessage from './WelcomeMessage';
import { ChatMessage } from '@/types';

interface ConversationDisplayProps {
  messages: ChatMessage[];
  setCurrentMessage: (message: string) => void;
  handleRegenerateMessage: (messageId: string) => void;
  handleSelectAlternative: (messageId: string, index: number) => void;
  handleRelatedQuestionClick: (question: string) => void;
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  searchResults?: Array<{title: string, url: string, snippet: string}>;
  currentQuery?: string;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  setCurrentMessage,
  handleRegenerateMessage,
  handleSelectAlternative,
  handleRelatedQuestionClick,
  processingStage = 'classifying',
  searchResults = [],
  currentQuery = ''
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastMessageLengthRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Add debug logging
  const debugScrollRef = useRef<boolean>(false);
  
  // More robust scroll handling with debounce to prevent constant jumping
  const scrollToBottom = useCallback(() => {
    // Clear any pending scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Debounce scrolling to avoid constant jumps
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current && !isUserScrollingRef.current) {
        // Debug first scroll event only
        if (!debugScrollRef.current) {
          console.log('Scrolling to bottom in ConversationDisplay');
          debugScrollRef.current = true;
        }
        
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100); // Small delay to batch scroll events
  }, []);

  // Only scroll when new messages are added or the last message content changes significantly
  useEffect(() => {
    const currentMessagesLength = messages.length;
    const lastMessage = messages[messages.length - 1];
    const lastMessageContent = lastMessage?.content || '';
    
    // Determine if we should scroll based on various conditions
    const hasNewMessage = currentMessagesLength > 0 && currentMessagesLength !== lastMessageLengthRef.current;
    const isLastMessageStreaming = lastMessage?.isStreaming;
    const hasSignificantChange = lastMessageContent.length > lastMessageLengthRef.current + 50; // Only scroll on significant additions
    
    if (hasNewMessage || (isLastMessageStreaming && hasSignificantChange)) {
      scrollToBottom();
      lastMessageLengthRef.current = lastMessageContent.length;
    }
  }, [messages, scrollToBottom]);
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Add event listeners to detect user scrolling
  useEffect(() => {
    const scrollAreaElement = scrollAreaRef.current;
    
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      
      // Reset after some inactivity to allow auto-scrolling again
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1000);
    };
    
    if (scrollAreaElement) {
      scrollAreaElement.addEventListener('wheel', handleScroll);
      scrollAreaElement.addEventListener('touchmove', handleScroll);
    }
    
    return () => {
      if (scrollAreaElement) {
        scrollAreaElement.removeEventListener('wheel', handleScroll);
        scrollAreaElement.removeEventListener('touchmove', handleScroll);
      }
    };
  }, []);

  return (
    <div className="h-full overflow-hidden" ref={scrollAreaRef}>
      <ScrollArea className="h-full" style={{ overscrollBehavior: 'contain' }}> 
        <div className="p-4 space-y-4 pb-32">
          {messages.length === 0 ? (
            <WelcomeMessage setCurrentMessage={setCurrentMessage} />
          ) : (
            messages.map((message) => {
              return (
                <ConversationMessage 
                  key={message.id}
                  role={message.role}
                  content={message.content}
                  sources={message.sources}
                  hasRealTimeData={message.hasRealTimeData}
                  messageId={message.id}
                  onRegenerateMessage={message.role === 'assistant' ? handleRegenerateMessage : undefined}
                  alternativeResponses={message.alternativeResponses || []}
                  currentResponseIndex={message.currentResponseIndex || 0}
                  onSelectAlternative={(index) => handleSelectAlternative(message.id, index)}
                  relatedQuestions={message.relatedQuestions}
                  onRelatedQuestionClick={handleRelatedQuestionClick}
                  isLoading={message.isLoading}
                  isStreaming={message.isStreaming}
                  streamProgress={message.streamProgress}
                  processingStage={message.processingStage || processingStage}
                  progressPercentage={message.progressPercentage}
                  stageDetails={message.stageDetails}
                  searchQuery={message.role === "assistant" ? currentQuery : undefined}
                  webResults={message.role === "assistant" ? searchResults : undefined}
                />
              );
            })
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationDisplay;
