
import React from 'react';
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import confetti from 'canvas-confetti';
import { useToast } from "@/hooks/use-toast";

interface NFW3RewardsButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const NFW3RewardsButton: React.FC<NFW3RewardsButtonProps> = ({ 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  const { toast } = useToast();

  const handleClick = () => {
    console.log('NFW3 Rewards button clicked - triggering confetti');
    
    // Trigger confetti with enhanced settings
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#059669', '#047857', '#065F46'],
      startVelocity: 30,
      gravity: 0.8,
      drift: 0,
      ticks: 200
    });
    
    toast({
      title: "NFW3 Rewards",
      description: "Rewards program coming soon!",
    });
  };

  return (
    <Button 
      variant={variant}
      size={size}
      className={`${className} bg-green-600 hover:bg-green-700 text-white transition-colors`}
      onClick={handleClick}
    >
      <Gift className="mr-2 h-4 w-4" />
      NFW3 Rewards
    </Button>
  );
};

export default NFW3RewardsButton;
