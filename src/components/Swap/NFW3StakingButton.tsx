
import React from 'react';
import { Button } from "@/components/ui/button";
import { PiggyBank } from "lucide-react";
import confetti from 'canvas-confetti';
import { useToast } from "@/hooks/use-toast";

interface NFW3StakingButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const NFW3StakingButton: React.FC<NFW3StakingButtonProps> = ({ 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  const { toast } = useToast();

  const handleClick = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#3B82F6', '#1D4ED8', '#2563EB', '#1E40AF']
    });
    
    toast({
      title: "NFW3 Staking",
      description: "Staking feature coming soon!",
    });
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className={`${className} bg-blue-600 hover:bg-blue-700 text-white transition-colors`}
      onClick={handleClick}
    >
      <PiggyBank className="mr-2 h-4 w-4" />
      NFW3 Staking
    </Button>
  );
};

export default NFW3StakingButton;
