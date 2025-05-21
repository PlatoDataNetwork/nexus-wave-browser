
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Loader2 } from 'lucide-react';
import { WaveMessage } from './WaveMessage';
import { useWave } from '@/hooks/useWave';

export const WaveChat: React.FC = () => {
  const { messages, addUserMessage, addAssistantMessage, isProcessing, setIsProcessing } = useWave();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Use the context to add the user message
    addUserMessage(inputValue.trim());
    setInputValue('');
    setIsProcessing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      addAssistantMessage(`I received your message: "${inputValue.trim()}". This is a simulated response as we're still developing the Wave chat functionality.`);
      setIsProcessing(false);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-2">Welcome to Nexus Wave</h3>
              <p className="text-muted-foreground">
                Ask me anything about the categories or provide a custom prompt to get started.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <WaveMessage key={message.id} message={message} />
          ))
        )}
        
        {isProcessing && (
          <div className="flex items-center space-x-2 p-4 bg-muted/50 rounded-lg">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p className="text-sm text-muted-foreground">Processing your request...</p>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button type="submit" size="icon" disabled={isProcessing || !inputValue.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
