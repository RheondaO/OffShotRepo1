import { useState } from 'react';

export function useXpAnimation() {
  const [animationState, setAnimationState] = useState<{
    isVisible: boolean;
    xpAmount: number;
    position?: { x: number; y: number };
  }>({
    isVisible: false,
    xpAmount: 0,
  });

  const triggerAnimation = (xpAmount: number, position?: { x: number; y: number }) => {
    // Hide any existing animation first
    setAnimationState(prev => ({ ...prev, isVisible: false }));
    
    // Set new animation after a small delay
    setTimeout(() => {
      setAnimationState({
        isVisible: true,
        xpAmount,
        position,
      });
    }, 50);
  };

  const hideAnimation = () => {
    setAnimationState(prev => ({ ...prev, isVisible: false }));
  };

  return {
    animationState,
    triggerAnimation,
    hideAnimation,
  };
}

export default useXpAnimation;