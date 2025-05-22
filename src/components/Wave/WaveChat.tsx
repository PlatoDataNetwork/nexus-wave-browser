
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from 'lucide-react';
import WaveMessage from './WaveMessage';
import { toast } from 'sonner';

interface WaveChatProps {
  query?: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const WaveChat: React.FC<WaveChatProps> = ({ query = '' }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize chat with query if provided
  useEffect(() => {
    if (query && messages.length === 0) {
      handleInitialQuery(query);
    }
  }, [query]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle the initial search query
  const handleInitialQuery = async (queryText: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: queryText,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages([userMessage]);
    setIsLoading(true);
    
    // Simulate API response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(queryText),
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Show a toast when the response is ready
      toast.success("Response ready");
    }, 1500);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsLoading(true);
    
    // Simulate API response delay
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateResponse(currentMessage),
        role: 'assistant',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      
      // Show a toast when the response is ready
      toast.success("Response ready");
    }, 1500);
  };

  // Mock response generator - enhanced with more context-aware responses
  const generateResponse = (input: string): string => {
    const responses = [
      `Based on your query about "${input}", I can provide you with the latest information from the blockchain. The current consensus is that distributed ledger technologies are revolutionizing traditional finance through smart contracts and decentralized applications.`,
      `Regarding "${input}", recent developments in the Web3 space have shown significant advancements. Several major projects have launched new features that address previous scalability concerns while maintaining decentralization principles.`,
      `Your question about "${input}" touches on the core of blockchain technology. The key innovation lies in creating trustless systems that don't require central authorities, instead relying on cryptographic proofs and consensus mechanisms to ensure security and integrity.`,
      `When examining "${input}" from a technical perspective, it's important to understand the trade-offs between different consensus algorithms. Proof of Work provides strong security but at environmental costs, while Proof of Stake offers efficiency but introduces different economic incentives.`,
      `"${input}" is a fascinating topic in the blockchain ecosystem. The evolution from basic cryptocurrencies to complex DeFi protocols demonstrates the versatility and potential of this technology to create entirely new financial primitives.`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b bg-background">
        <h3 className="text-sm font-medium">Nexus Wave Chat</h3>
      </div>
      
      <div className="flex-grow relative">
        {/* Messages area */}
        <div className="h-full overflow-auto p-4 pb-20">
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center p-6 text-muted-foreground">
                <p>Start a conversation with Nexus Wave</p>
              </div>
            ) : (
              messages.map(message => (
                <WaveMessage 
                  key={message.id} 
                  role={message.role}
                  content={message.content}
                />
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary p-3 rounded-lg max-w-[80%] flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Nexus Wave is thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-sm border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              placeholder="Ask a follow-up question..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-[60px] bg-nexus-purple hover:bg-nexus-deep-purple"
              disabled={isLoading || !currentMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WaveChat;
