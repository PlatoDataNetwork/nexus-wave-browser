
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import confetti from 'canvas-confetti';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'macOS' | 'Windows';
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, platform }) => {
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowCountdown(true);
      setCountdown(3);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(timer);
            
            // Trigger confetti explosion
            setTimeout(() => {
              confetti({
                particleCount: 150,
                spread: 180,
                origin: { x: 0.5, y: 0.5 },
                colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#8B5CF6', '#D946EF']
              });
              
              // Close modal after confetti
              setTimeout(() => {
                setShowCountdown(false);
                onClose();
              }, 2000);
            }, 300);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-nexus-header-blue to-nexus-space-black border-nexus-purple/20">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white mb-4">
            Coming Soon
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">
              Nexus Wave for {platform}
            </h3>
            <p className="text-gray-300 max-w-sm">
              We're putting the finishing touches on the {platform} version. 
              Get ready for the future of Web3 browsing!
            </p>
          </div>
          
          {showCountdown && countdown > 0 && (
            <div className="flex flex-col items-center space-y-4">
              <div className="text-6xl font-bold text-nexus-purple animate-pulse">
                {countdown}
              </div>
              <div className="text-sm text-gray-400">
                Launching excitement in...
              </div>
            </div>
          )}
          
          {countdown === 0 && (
            <div className="text-4xl font-bold text-nexus-purple animate-bounce">
              🎉 BOOM! 🎉
            </div>
          )}
          
          <div className="text-center text-sm text-gray-400">
            <p>Want to be notified when it's ready?</p>
            <p className="text-nexus-purple">Sign up for updates on our website!</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;
