
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";
import SwapModal from './SwapModal';

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

  return (
    <>
      <Button 
        variant={variant}
        size={size}
        className={`${className} bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600`}
        onClick={() => setShowSwapModal(true)}
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
