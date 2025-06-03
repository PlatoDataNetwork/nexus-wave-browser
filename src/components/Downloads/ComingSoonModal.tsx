
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, User } from "lucide-react";
import confetti from 'canvas-confetti';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: 'macOS' | 'Windows';
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({ isOpen, onClose, platform }) => {
  const [countdown, setCountdown] = useState(3);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupComplete, setSignupComplete] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (isOpen) {
      console.log('Coming Soon modal opened for', platform);
      setShowCountdown(true);
      setShowSignupForm(false);
      setSignupComplete(false);
      setCountdown(3);
      
      const timer = setInterval(() => {
        setCountdown(prev => {
          console.log('Countdown:', prev);
          if (prev === 1) {
            clearInterval(timer);
            
            // Trigger confetti explosion
            setTimeout(() => {
              console.log('Triggering confetti');
              confetti({
                particleCount: 150,
                spread: 180,
                origin: { x: 0.5, y: 0.5 },
                colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#8B5CF6', '#D946EF']
              });
              
              // Show signup form after confetti starts
              setTimeout(() => {
                setShowCountdown(false);
                setShowSignupForm(true);
              }, 1000);
            }, 300);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, platform]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigningUp(true);
    
    // Simulate signup process
    setTimeout(() => {
      setIsSigningUp(false);
      setSignupComplete(true);
      
      // Additional confetti for successful signup
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { x: 0.5, y: 0.6 },
        colors: ['#00D395', '#33C3F0', '#9b87f5']
      });
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 3000);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-nexus-header-blue to-nexus-space-black border border-nexus-purple/30 shadow-2xl backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white mb-4">
            {signupComplete ? "Welcome to Nexus Wave!" : "Coming Soon"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center space-y-6 py-6">
          {showCountdown && countdown > 0 && (
            <>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Nexus Wave for {platform}
                </h3>
                <p className="text-gray-300 max-w-sm">
                  We're putting the finishing touches on the {platform} version. 
                  Get ready for the future of Web3 browsing!
                </p>
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <div className="text-6xl font-bold text-nexus-purple animate-pulse">
                  {countdown}
                </div>
                <div className="text-sm text-gray-400">
                  Launching excitement in...
                </div>
              </div>
            </>
          )}
          
          {countdown === 0 && !showSignupForm && (
            <div className="text-4xl font-bold text-nexus-purple animate-bounce">
              🎉 BOOM! 🎉
            </div>
          )}

          {showSignupForm && !signupComplete && (
            <div className="w-full max-w-sm space-y-4">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Be the First to Know!
                </h3>
                <p className="text-gray-300 text-sm">
                  Sign up to get notified when Nexus Wave for {platform} is ready
                </p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-nexus-purple hover:bg-nexus-purple/90"
                  disabled={isSigningUp}
                >
                  {isSigningUp ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing up...
                    </>
                  ) : (
                    "Notify Me!"
                  )}
                </Button>
              </form>
            </div>
          )}

          {signupComplete && (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold text-white">
                You're all set, {formData.name}!
              </h3>
              <p className="text-gray-300 max-w-sm">
                We'll send you an email at <span className="text-nexus-purple">{formData.email}</span> as soon as Nexus Wave for {platform} is ready.
              </p>
              <div className="text-sm text-gray-400 mt-4">
                Closing in a moment...
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ComingSoonModal;
