
import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile } from 'lucide-react';

const SmileAnimation = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  useEffect(() => {
    if (showConfetti) {
      const end = Date.now() + (3 * 1000); // Animation runs for 3 seconds
      
      const snowfallConfetti = () => {
        confetti({
          particleCount: 2,
          startVelocity: 0,
          ticks: 300,
          origin: {
            x: Math.random(),
            y: Math.random() - 0.2
          },
          colors: ['#9b87f5', '#D6BCFA', '#E5DEFF', '#8B5CF6', '#33C3F0'],
          gravity: 0.3,
          shapes: ['circle'],
          scalar: 0.8
        });
        
        if (Date.now() < end) {
          requestAnimationFrame(snowfallConfetti);
        }
      };
      
      snowfallConfetti();
    }
  }, [showConfetti]);
  
  const triggerAnimation = () => {
    setShowAnimation(true);
    
    // After 1 second, trigger the explosion
    setTimeout(() => {
      // Explode the smile face
      confetti({
        particleCount: 100,
        spread: 150,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#9b87f5', '#D6BCFA', '#E5DEFF', '#8B5CF6', '#33C3F0']
      });
      
      // Set show confetti to true to start the snowfall effect
      setShowConfetti(true);
      
      // Hide the smile face after explosion
      setShowAnimation(false);
    }, 1000);
  };
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <button 
        onClick={triggerAnimation}
        className="px-8 py-4 text-xl font-bold text-white rounded-full bg-gradient-to-r from-purple-500 via-nexus-purple to-nexus-light-purple hover:opacity-90 transition"
      >
        Click for a surprise!
      </button>
      
      <AnimatePresence>
        {showAnimation && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50"
            initial={{ scale: 0 }}
            animate={{ scale: [1, 1.5, 2, 2.5] }}
            exit={{ scale: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Smile className="text-nexus-purple" size={200} strokeWidth={1.5} fill="#E5DEFF" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SmileAnimation;
