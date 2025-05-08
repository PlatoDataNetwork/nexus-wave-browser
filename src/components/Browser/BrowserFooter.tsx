
import React from "react";
import { Chrome, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const BrowserFooter: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleActionClick = (action: string) => {
    toast({
      title: `${action} clicked`,
      description: `This would open the ${action.toLowerCase()} in a real browser`,
    });
  };

  const handleSettingsClick = () => {
    navigate('/settings-docs');
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-t border-border text-xs text-muted-foreground">
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7"
          onClick={() => handleActionClick("Extensions")}
        >
          <Chrome className="h-3 w-3 mr-1" />
          <span>Extensions</span>
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-7"
          onClick={() => handleActionClick("Settings")}
        >
          <Settings className="h-3 w-3 mr-1" />
          <span>Settings</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <span>Nexus Wave Browser Web3 V2.1</span>
        <Button 
          onClick={handleSettingsClick}
          size="sm" 
          className="bg-[#D946EF] hover:bg-[#D946EF]/80 text-white font-medium px-3 py-1 rounded-md"
        >
          Nexus Bridget
        </Button>
      </div>
    </div>
  );
};

export default BrowserFooter;
