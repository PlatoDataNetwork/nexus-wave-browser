
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WaveMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface WaveContextType {
  messages: WaveMessage[];
  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  clearMessages: () => void;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
}

const WaveContext = createContext<WaveContextType | undefined>(undefined);

export const WaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<WaveMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addUserMessage = (content: string) => {
    const newMessage: WaveMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addAssistantMessage = (content: string) => {
    const newMessage: WaveMessage = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const value = {
    messages,
    addUserMessage,
    addAssistantMessage,
    clearMessages,
    isProcessing,
    setIsProcessing
  };

  return (
    <WaveContext.Provider value={value}>
      {children}
    </WaveContext.Provider>
  );
};

export const useWave = (): WaveContextType => {
  const context = useContext(WaveContext);
  if (context === undefined) {
    throw new Error('useWave must be used within a WaveProvider');
  }
  return context;
};
