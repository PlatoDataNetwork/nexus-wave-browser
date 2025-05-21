
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";
import { WaveMessage as WaveMessageType } from './WaveChat';
import { Progress } from "@/components/ui/progress";

interface WaveMessageProps {
  message: WaveMessageType;
  onRelatedQuestionClick: (question: string) => void;
}

const WaveMessage: React.FC<WaveMessageProps> = ({ message, onRelatedQuestionClick }) => {
  const { role, content, isLoading, isStreaming, streamProgress, relatedQuestions } = message;
  
  return (
    <div className={`flex gap-4 ${role === 'assistant' ? 'bg-primary-foreground/50 p-4 rounded-lg' : ''}`}>
      <Avatar className={role === 'assistant' ? 'bg-nexus-purple text-white' : 'bg-secondary'}>
        {role === 'assistant' ? (
          <AvatarImage src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" alt="Nexus AI" />
        ) : null}
        <AvatarFallback>
          {role === 'assistant' ? 'AI' : 'You'}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 space-y-2">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Generating response...</span>
            </div>
            {isStreaming && <Progress value={streamProgress} className="h-1" />}
          </div>
        ) : (
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <ReactMarkdown>{content}</ReactMarkdown>
            
            {relatedQuestions && relatedQuestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="text-sm font-medium mb-2">Related questions</h4>
                <div className="flex flex-col gap-2">
                  {relatedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start gap-2 h-auto py-1 text-left"
                      onClick={() => onRelatedQuestionClick(question)}
                    >
                      <ArrowRight className="h-3 w-3 flex-shrink-0" />
                      <span className="text-xs">{question}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaveMessage;
