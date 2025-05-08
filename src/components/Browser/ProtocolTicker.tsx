
import React from "react";
import { topProtocols, Protocol } from "@/lib/protocolData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";

interface ProtocolTickerProps {
  onNavigate: (url: string) => void;
}

const ProtocolTicker: React.FC<ProtocolTickerProps> = ({ onNavigate }) => {
  const { toast } = useToast();
  
  const handleProtocolClick = (protocol: Protocol) => {
    toast({
      title: `Navigating to ${protocol.name}`,
      description: `Opening ${protocol.url}`,
      duration: 2000,
    });
    onNavigate(protocol.url);
  };

  return (
    <div className="w-full bg-card border-t border-border py-1">
      <ScrollArea className="w-full">
        <div className="flex space-x-3 px-3 py-1 animate-marquee-slower">
          {topProtocols.map((protocol) => (
            <div 
              key={protocol.id}
              onClick={() => handleProtocolClick(protocol)}
              className="flex items-center space-x-2 px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
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
    </div>
  );
};

export default ProtocolTicker;
