
import React, { useState } from "react";
import { topProtocols, Protocol } from "@/lib/protocolData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtocolTickerProps {
  onNavigate: (url: string) => void;
}

const ProtocolTicker: React.FC<ProtocolTickerProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  
  const handleProtocolClick = (protocol: Protocol) => {
    toast({
      title: `Navigating to ${protocol.name}`,
      description: `Opening ${protocol.url}`,
      duration: 2000,
    });
    onNavigate(protocol.url);
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200; // Adjust scroll amount as needed
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      
      setScrollPosition(newPosition);
    }
  };

  return (
    <div className="w-full bg-muted border-b border-border py-2 flex items-center">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleScroll('left')}
        className="flex-shrink-0 hover:bg-primary/20 transition-all mx-1"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-7 w-7 text-primary" />
      </Button>
      
      <ScrollArea className="w-full" scrollHideDelay={0}>
        <div 
          ref={scrollRef}
          className="flex space-x-3 px-3 py-1 overflow-x-auto"
          style={{ scrollBehavior: 'smooth' }}
        >
          {topProtocols.map((protocol) => (
            <div 
              key={protocol.id}
              onClick={() => handleProtocolClick(protocol)}
              className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer transition-colors flex-shrink-0"
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white font-semibold text-xs"
                style={{ backgroundColor: protocol.color }}
              >
                {protocol.name.charAt(0)}
              </div>
              <span className="text-xs whitespace-nowrap">{protocol.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleScroll('right')}
        className="flex-shrink-0 hover:bg-primary/20 transition-all mx-1"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-7 w-7 text-primary" />
      </Button>
    </div>
  );
};

export default ProtocolTicker;
