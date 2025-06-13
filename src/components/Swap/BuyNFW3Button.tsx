
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import SwapModal from './SwapModal';

interface BuyNWAVButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
}

const BuyNWAVButton: React.FC<BuyNWAVButtonProps> = ({ 
  variant = "default", 
  size = "default",
  className = ""
}) => {
  const [showSwapModal, setShowSwapModal] = useState(false);

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={`${className} bg-nexus-purple hover:bg-nexus-deep-purple text-white transition-colors`}
        onClick={() => setShowSwapModal(true)}
      >
        <Coins className="mr-2 h-4 w-4" />
        Buy $NWAV
      </Button>
      
      <SwapModal 
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
      />
    </>
  );
};

export default BuyNWAVButton;
