
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import SwapModal from './SwapModal';
import confetti from 'canvas-confetti';

interface BuyNFW3ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const BuyNFW3Button: React.FC<BuyNFW3ButtonProps> = ({ 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  const [showSwapModal, setShowSwapModal] = useState(false);

  const handleClick = () => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#A855F7', '#9333EA', '#7C3AED']
    });
    
    setShowSwapModal(true);
  };

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={`${className} bg-nexus-purple hover:bg-nexus-deep-purple text-white transition-colors`}
        onClick={handleClick}
      >
        <Coins className="mr-2 h-4 w-4" />
        Buy $NFW3
      </Button>
      
      <SwapModal 
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
      />
    </>
  );
};

export default BuyNFW3Button;
