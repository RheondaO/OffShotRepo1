import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface XpAnimationProps {
  xpAmount: number;
  isVisible: boolean;
  onComplete?: () => void;
}

const XpAnimation = ({ xpAmount, isVisible, onComplete }: XpAnimationProps) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setAnimationComplete(false);
    }
  }, [isVisible]);

  const getAnimationProps = () => {
    // Different animations based on XP amount
    if (xpAmount >= 50) {
      // Firework animation for high XP (50+)
      return {
        className: "text-yellow-400 font-bold text-2xl",
        variants: {
          initial: { scale: 0.5, opacity: 0 },
          animate: { 
            scale: 1.5, 
            opacity: 1,
            transition: { 
              duration: 0.5,
              type: "spring",
              stiffness: 300
            }
          },
          exit: { 
            scale: 2, 
            opacity: 0,
            transition: { duration: 0.5 }
          }
        },
        particles: Array(12).fill(0).map((_, i) => ({
          id: i,
          angle: (i * 30) % 360,
          distance: 80,
          size: Math.random() * 10 + 5
        }))
      };
    } else if (xpAmount >= 10) {
      // Sparkle animation for medium XP (10-49)
      return {
        className: "text-purple-500 font-bold text-xl",
        variants: {
          initial: { y: 20, opacity: 0 },
          animate: { 
            y: -20, 
            opacity: 1,
            transition: { 
              duration: 0.7,
              ease: "easeOut"
            }
          },
          exit: { 
            y: -40, 
            opacity: 0,
            transition: { duration: 0.3 }
          }
        },
        particles: Array(6).fill(0).map((_, i) => ({
          id: i,
          angle: (i * 60) % 360,
          distance: 40,
          size: Math.random() * 6 + 3
        }))
      };
    } else {
      // Simple pop animation for low XP (1-9)
      return {
        className: "text-blue-400 font-bold text-lg",
        variants: {
          initial: { scale: 0.8, opacity: 0 },
          animate: { 
            scale: 1.2, 
            opacity: 1,
            transition: { 
              duration: 0.4,
              type: "spring",
              stiffness: 200
            }
          },
          exit: { 
            scale: 1.4, 
            opacity: 0,
            transition: { duration: 0.3 }
          }
        },
        particles: Array(3).fill(0).map((_, i) => ({
          id: i,
          angle: (i * 120) % 360,
          distance: 25,
          size: Math.random() * 4 + 2
        }))
      };
    }
  };

  const animProps = getAnimationProps();

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    if (onComplete) {
      setTimeout(onComplete, 200);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && !animationComplete && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            className={`relative ${animProps.className}`}
            variants={animProps.variants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={handleAnimationComplete}
          >
            +{xpAmount} XP
            
            {/* Particle effects */}
            {animProps.particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute rounded-full bg-current"
                style={{
                  width: particle.size,
                  height: particle.size,
                  top: "50%",
                  left: "50%",
                }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: Math.cos(particle.angle * (Math.PI / 180)) * particle.distance,
                  y: Math.sin(particle.angle * (Math.PI / 180)) * particle.distance,
                  opacity: 0,
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default XpAnimation;