
import React from 'react';
import MessageContent from './MessageContent';
import MessageSourcesList from './MessageSourcesList';
import RelatedQuestions from './RelatedQuestions';
import MessageActions from './MessageActions';
import AlternativeResponses from './AlternativeResponses';

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
  isLoading?: boolean;
  isStreaming?: boolean;
  streamProgress?: number;
  processingStage?: 'initializing' | 'classifying' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  progressPercentage?: number;
  stageDetails?: string;
}

const ConversationMessage: React.FC<ConversationMessageProps> = ({ 
  role, 
  content, 
  sources = [],
  hasRealTimeData = false,
  messageId,
  onRegenerateMessage,
  alternativeResponses = [],
  currentResponseIndex = 0,
  onSelectAlternative,
  relatedQuestions = [],
  onRelatedQuestionClick,
  isLoading = false,
  isStreaming = false,
  streamProgress = 0,
  processingStage = 'classifying',
  progressPercentage = 0
}) => {
  const hasAlternatives = alternativeResponses.length > 0;

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
          <>
            <MessageContent 
              content={content}
              hasRealTimeData={hasRealTimeData}
              isLoading={isLoading}
              isStreaming={isStreaming}
              streamProgress={streamProgress}
              processingStage={processingStage}
              progressPercentage={progressPercentage}
            />
            
            <MessageSourcesList sources={sources || []} />
            
            <RelatedQuestions 
              questions={relatedQuestions || []} 
              onQuestionClick={onRelatedQuestionClick} 
            />
            
            {/* Message controls - only show when not loading */}
            {!isLoading && (
              <>
                <MessageActions 
                  content={content}
                  messageId={messageId}
                  onRegenerateMessage={onRegenerateMessage}
                  isStreaming={isStreaming}
                  isLoading={isLoading}
                />
                
                <AlternativeResponses 
                  hasAlternatives={hasAlternatives}
                  currentResponseIndex={currentResponseIndex}
                  alternativeResponsesCount={alternativeResponses.length}
                  onPrevious={handlePreviousResponse}
                  onNext={handleNextResponse}
                  isDisabled={isLoading || isStreaming}
                />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ConversationMessage;
