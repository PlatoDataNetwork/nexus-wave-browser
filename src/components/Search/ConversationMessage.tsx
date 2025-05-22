
import React from 'react';
import { motion } from 'framer-motion';
import MessageContent from './MessageContent';
import MessageSourcesList from './MessageSourcesList';
import RelatedQuestions from './RelatedQuestions';
import MessageActions from './MessageActions';
import AlternativeResponses from './AlternativeResponses';

interface Source {
  title: string;
  url: string;
  snippet?: string;
  timestamp?: string;
}

interface ConversationMessageProps {
  role: "user" | "assistant" | "system";
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
  processingStage?: 'initializing' | 'classifying' | 'context-analysis' | 'searching' | 'processing' | 'generating' | 'streaming' | 'finalizing' | 'complete';
  processingType?: 'individual' | 'contextual';
  progressPercentage?: number;
  stageDetails?: string;
  searchQuery?: string;
  webResults?: Array<{title: string, url: string, snippet: string}>;
  clickedQuestionsHistory?: Set<string>;
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
  processingStage = 'classifying',
  progressPercentage = 0,
  stageDetails,
  searchQuery,
  webResults,
  clickedQuestionsHistory = new Set()
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

  // Animation variants
  const messageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  // Only render user and assistant messages
  if (role === "system") {
    return null;
  }
  
  return (
    <motion.div 
      className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={messageVariants}
      layout
    >
      <motion.div
        className={`max-w-3/4 rounded-lg p-4 ${
          role === "user"
            ? "bg-nexus-purple text-white"
            : "bg-secondary border border-border"
        }`}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
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
              processingStage={processingStage}
              progressPercentage={progressPercentage}
              stageDetails={stageDetails}
              searchQuery={searchQuery}
              webResults={webResults}
            />
            
            {/* Ensure sources are displayed, even if empty array is passed */}
            <MessageSourcesList sources={sources || []} />
            
            <RelatedQuestions 
              questions={relatedQuestions || []} 
              onQuestionClick={onRelatedQuestionClick}
              alreadyClickedQuestions={clickedQuestionsHistory}
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
      </motion.div>
    </motion.div>
  );
};

export default ConversationMessage;
