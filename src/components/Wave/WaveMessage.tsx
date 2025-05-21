
import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WaveMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const WaveMessage: React.FC<WaveMessageProps> = ({ role, content }) => {
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          role === 'user'
            ? 'bg-nexus-purple text-white'
            : 'bg-secondary border border-border'
        }`}
      >
        {role === 'assistant' && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MessageCircle className="h-3 w-3" />
            <span>Nexus Wave</span>
          </div>
        )}
        <p className="whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};

export default WaveMessage;
