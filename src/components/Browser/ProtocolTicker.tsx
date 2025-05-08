
import React, { useState, useEffect, useRef } from "react";
import { topProtocols, Protocol } from "@/lib/protocolData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProtocolTickerProps {
  onNavigate: (url: string) => void;
}

const ProtocolTicker: React.FC<ProtocolTickerProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  
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

  // Automatic scrolling animation
  useEffect(() => {
    const startScrolling = () => {
      if (scrollRef.current && !isHovering) {
        const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        
        if (scrollPosition >= maxScroll) {
          // Reset to beginning when reached the end
          setScrollPosition(0);
          scrollRef.current.scrollTo({
            left: 0,
            behavior: 'auto'
          });
        } else {
          // Continue scrolling
          const newPosition = scrollPosition + 1;
          setScrollPosition(newPosition);
          scrollRef.current.scrollTo({
            left: newPosition,
            behavior: 'auto'
          });
        }
      }
      
      animationRef.current = requestAnimationFrame(startScrolling);
    };

    // Start animation
    animationRef.current = requestAnimationFrame(startScrolling);
    
    // Cleanup animation on unmount
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [scrollPosition, isHovering]);

  return (
    <div 
      className="w-full bg-muted border-b border-border py-2 flex items-center"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => handleScroll('left')}
        className="flex-shrink-0 hover:bg-primary/20 transition-all mx-1"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-8 w-8 text-primary" />
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
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white bg-primary/80">
                <Globe className="h-4 w-4" />
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
        <ChevronRight className="h-8 w-8 text-primary" />
      </Button>
    </div>
  );
};

export default ProtocolTicker;
