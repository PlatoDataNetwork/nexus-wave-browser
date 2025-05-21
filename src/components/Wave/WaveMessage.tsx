
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface WaveMessageProps {
  message: ChatMessage;
}

export const WaveMessage: React.FC<WaveMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'} gap-2`}>
        <Avatar className="h-8 w-8">
          {isUser ? (
            <>
              <AvatarFallback>U</AvatarFallback>
              <AvatarImage src="/user-avatar.png" />
            </>
          ) : (
            <>
              <AvatarFallback>AI</AvatarFallback>
              <AvatarImage src="/lovable-uploads/43781a1e-b320-4a1b-aeb4-6cae375ea2f8.png" />
            </>
          )}
        </Avatar>
        
        <div className={`rounded-lg p-3 ${
          isUser 
            ? 'bg-nexus-purple text-white' 
            : 'bg-muted border border-border'
        }`}>
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    </div>
  );
};
