
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/components/ui/button";
import { MessageCircle, Globe, Zap } from "lucide-react";

interface WelcomeMessageProps {
  setCurrentMessage: (message: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ setCurrentMessage }) => {
  const { t } = useTranslation('search');

  return (
    <div className="text-center py-10">
      <div className="w-16 h-16 rounded-full bg-nexus-purple/10 flex items-center justify-center mx-auto mb-4">
        <MessageCircle className="h-8 w-8 text-nexus-purple" />
      </div>
      <h2 className="text-xl font-medium mb-2">{t('welcome.title')}</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-6">
        {t('welcome.subtitle')}
      </p>
      <div className="flex gap-2 flex-wrap justify-center max-w-lg mx-auto">
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setCurrentMessage("What's the weather in New York today?")}
          className="flex items-center gap-1"
        >
          <Globe className="h-3 w-3" /> Weather in New York
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setCurrentMessage("Current USD to EUR exchange rate")}
          className="flex items-center gap-1"
        >
          <Zap className="h-3 w-3" /> USD to EUR rate
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setCurrentMessage("Latest news about SpaceX")}
          className="flex items-center gap-1"
        >
          <Globe className="h-3 w-3" /> SpaceX news
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setCurrentMessage("Show me a chart of Bitcoin price trends")}
          className="flex items-center gap-1"
        >
          <Zap className="h-3 w-3" /> Bitcoin price chart
        </Button>
      </div>
    </div>
  );
};

export default WelcomeMessage;
