
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import ConversationMessage from './ConversationMessage';
import WelcomeMessage from './WelcomeMessage';
import { useConversationContext } from '@/contexts/ConversationContext';

interface ConversationDisplayProps {
  className?: string;
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  className = "",
}) => {
  const { 
    messages, 
    setCurrentMessage, 
    handleRegenerateMessage, 
    handleSelectAlternative, 
    handleRelatedQuestionClick 
  } = useConversationContext();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={`h-full overflow-hidden ${className}`}>
      <ScrollArea className="h-full" style={{ overscrollBehavior: 'contain' }}> 
        <div className="p-4 space-y-4 pb-32">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <p className="text-muted-foreground text-center">
                No conversation started yet. Ask a question or select a prompt to begin.
              </p>
            </div>
          ) : (
            messages.map((message) => (
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
                processingStage={message.processingStage}
                progressPercentage={message.progressPercentage}
                stageDetails={message.stageDetails}
              />
            ))
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationDisplay;
