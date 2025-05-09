
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Smile } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const SmileAnimation: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [blinkEyes, setBlinkEyes] = useState(false);
  const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Manage blinking animation
  useEffect(() => {
    const startBlinking = () => {
      // Close eyes (blink) every 3 seconds
      blinkTimerRef.current = setInterval(() => {
        setBlinkEyes(true);
        
        // Open eyes after 200ms
        setTimeout(() => {
          setBlinkEyes(false);
        }, 200);
      }, 3000);
    };
    
    if (showAnimation && !countdown) {
      startBlinking();
    }
    
    // Clear interval when component unmounts or animation state changes
    return () => {
      if (blinkTimerRef.current) {
        clearInterval(blinkTimerRef.current);
      }
    };
  }, [showAnimation, countdown]);

  // Handle confetti snow effect
  useEffect(() => {
    if (showConfetti) {
      const end = Date.now() + 5 * 1000; // Animation runs for 5 seconds
      
      const snowfallConfetti = () => {
        confetti({
          particleCount: 3,
          startVelocity: 0,
          ticks: 300,
          origin: { 
            x: Math.random(),
            y: Math.random() - 0.2
          },
          // Rainbow colors for confetti
          colors: [
            '#FF0000', // Red
            '#FF7F00', // Orange
            '#FFFF00', // Yellow
            '#00FF00', // Green
            '#0000FF', // Blue
            '#4B0082', // Indigo
            '#9400D3'  // Violet
          ],
          gravity: 0.3,
          shapes: ['circle', 'square'],
          scalar: 0.8
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(snowfallConfetti);
        } else {
          setShowConfetti(false);
        }
      };
      
      snowfallConfetti();
    }
  }, [showConfetti]);

  const triggerAnimation = () => {
    // Clear any existing blink timer
    if (blinkTimerRef.current) {
      clearInterval(blinkTimerRef.current);
    }
    
    // Start countdown
    setCountdown(3);
    
    // Create countdown sequence
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          
          // When countdown reaches 0, explode
          setTimeout(() => {
            // Explosion at center of screen
            confetti({
              particleCount: 200,
              spread: 180,
              origin: { x: 0.5, y: 0.5 },
              colors: [
                '#FF0000', // Red
                '#FF7F00', // Orange
                '#FFFF00', // Yellow
                '#00FF00', // Green
                '#0000FF', // Blue
                '#4B0082', // Indigo
                '#9400D3'  // Violet
              ]
            });
            
            // Set show confetti to true to start the snowfall effect
            setShowConfetti(true);
            
            // Hide countdown and smiley
            setCountdown(null);
            setShowAnimation(false);
          }, 300);
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      {!showAnimation && !showConfetti && !countdown && (
        <Card className="w-[350px] h-[350px] bg-gradient-to-br from-nexus-purple to-nexus-deep-purple shadow-xl rounded-2xl border-2 border-nexus-light-purple/30">
          <CardContent className="flex items-center justify-center h-full p-6">
            <button
              onClick={() => setShowAnimation(true)}
              className="px-8 py-4 text-xl font-bold text-white rounded-full bg-gradient-to-r from-nexus-light-purple via-nexus-purple to-purple-700 hover:opacity-90 transition-all shadow-lg hover:shadow-nexus-purple/50 animate-pulse-glow"
            >
              Click for a surprise!
            </button>
          </CardContent>
        </Card>
      )}
      
      {showAnimation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="animate-[scale_0.8s_ease-out] cursor-pointer"
            onClick={triggerAnimation}
          >
            <div className="relative">
              {/* Realistic smiley face using the uploaded image */}
              <div className="relative">
                <img 
                  src="/lovable-uploads/f21a20cb-deaf-4c60-86e2-3cd54f540dce.png" 
                  alt="Smiley Face" 
                  className="w-[300px] h-[300px]"
                  style={{
                    filter: "drop-shadow(0 0 15px rgba(255,255,0,0.7))"
                  }}
                />
                
                {/* Eyes that can blink - overlaid on the image */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-48 h-24 mt-[-40px]">
                    {/* Left eye */}
                    <div className={`absolute left-6 top-6 w-10 h-[18px] rounded-full ${blinkEyes ? 'h-1 bg-black' : ''}`}>
                    </div>
                    
                    {/* Right eye */}
                    <div className={`absolute right-6 top-6 w-10 h-[18px] rounded-full ${blinkEyes ? 'h-1 bg-black' : ''}`}>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Countdown text */}
              {countdown !== null && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-white drop-shadow-lg countdown-animation">
                  {countdown === 0 ? "BOOM!" : countdown}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmileAnimation;
