
import React from "react";
import { Chrome, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const BrowserFooter: React.FC = () => {
  const { toast } = useToast();
  
  const handleActionClick = (action: string) => {
    toast({
      title: `${action} clicked`,
      description: `This would open the ${action.toLowerCase()} in a real browser`,
    });
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
      </div>
      
      <div className="flex items-center space-x-3">
        <span>Nexus Wave Browser Web3 V2.1</span>
        <Button
          variant="ghost"
          size="sm"
          className="bg-pink-600 hover:bg-pink-700 text-white h-7"
          asChild
        >
          <Link to="/settings">Settings</Link>
        </Button>
      </div>
    </div>
  );
};

export default BrowserFooter;
