
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, MessageCircle } from "lucide-react";
import ConversationMessage from './ConversationMessage';
import SearchSuggestions from './SearchSuggestions';

interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: {
    title: string;
    url: string;
  }[];
}

interface ConversationalSearchProps {
  onSearch?: (query: string) => void;
}

const ConversationalSearch: React.FC<ConversationalSearchProps> = ({ onSearch }) => {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentMessage.trim()) return;
    
    // Add user message to conversation
    const userMessage: ConversationMessage = {
      id: Date.now().toString(),
      role: "user",
      content: currentMessage,
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    
    if (onSearch) {
      onSearch(currentMessage);
    }
    
    setCurrentMessage("");
    setIsLoading(true);
    
    // Simulate AI response time
    setTimeout(() => {
      // Generate mock AI response
      const aiResponse = generateAIResponse(currentMessage);
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    setCurrentMessage(suggestion);
    // Auto-submit after a brief delay to show the suggestion in the input field
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  const generateAIResponse = (query: string): ConversationMessage => {
    // This is a mock function that would be replaced with actual API call
    const responses = [
      `Based on my search, ${query} is a topic with several interesting aspects. Let me break it down for you.`,
      `I found some information about ${query}. According to recent sources, there have been significant developments in this area.`,
      `${query} is trending right now. Here's what I found from reliable sources across the web.`,
      `Looking at the most recent information about ${query}, I can see several key points worth noting.`
    ];
    
    // Sample sources
    const sources = [
      {
        title: `${query} - Official Documentation`,
        url: `https://docs.${query.toLowerCase().replace(/\s+/g, '')}.com`
      },
      {
        title: `Latest Research on ${query}`,
        url: `https://research.nexus.wave/${query.toLowerCase().replace(/\s+/g, '-')}`
      },
      {
        title: `${query} Analysis`,
        url: `https://analysis.crypto.com/${query.toLowerCase().replace(/\s+/g, '-')}`
      }
    ];
    
    return {
      id: Date.now().toString(),
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
      timestamp: new Date(),
      sources: sources.slice(0, Math.floor(Math.random() * 3) + 1) // Random number of sources (1-3)
    };
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-4">
          {messages.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-nexus-purple/10 flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-nexus-purple" />
              </div>
              <h2 className="text-xl font-medium mb-2">Ask me anything</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                I'm your AI assistant powered by Nexus. I can search the web, analyze data, and answer complex questions.
              </p>
              
              <SearchSuggestions onSelectSuggestion={handleSelectSuggestion} />
            </div>
          ) : (
            messages.map((message) => (
              <ConversationMessage 
                key={message.id}
                role={message.role}
                content={message.content}
                sources={message.sources}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            placeholder="Ask me anything..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            className="flex-1 min-h-12 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />
          <Button 
            type="submit" 
            className="h-full bg-nexus-purple hover:bg-nexus-deep-purple"
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ConversationalSearch;
