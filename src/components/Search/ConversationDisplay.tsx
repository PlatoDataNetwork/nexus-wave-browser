
import React, { useRef, useEffect } from 'react';
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
}

const ConversationDisplay: React.FC<ConversationDisplayProps> = ({
  messages,
  setCurrentMessage,
  handleRegenerateMessage,
  handleSelectAlternative,
  handleRelatedQuestionClick
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="h-full">
      <ScrollArea className="h-full overscroll-none"> 
        <div className="p-4 space-y-4">
          {messages.length === 0 ? (
            <WelcomeMessage setCurrentMessage={setCurrentMessage} />
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
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationDisplay;
