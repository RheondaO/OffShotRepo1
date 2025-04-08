import { forwardRef, useState } from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import XpAnimation from '@/components/animations/XpAnimation';
import useXpAnimation from '@/hooks/use-xp-animation';

interface XpButtonProps extends ButtonProps {
  xpAmount: number;
  xpText?: string;
  onXpEarned?: (amount: number) => void;
}

const XpButton = forwardRef<HTMLButtonElement, XpButtonProps>(
  ({ children, xpAmount, xpText, onXpEarned, onClick, className, ...props }, ref) => {
    const { animationState, triggerAnimation, hideAnimation } = useXpAnimation();
    const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger animation when button is clicked
      if (buttonRef) {
        const rect = buttonRef.getBoundingClientRect();
        const position = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
        };
        triggerAnimation(xpAmount, position);
      } else {
        triggerAnimation(xpAmount);
      }

      // Call the original onClick handler
      if (onClick) {
        onClick(event);
      }

      // Call the onXpEarned callback
      if (onXpEarned) {
        onXpEarned(xpAmount);
      }
    };

    const handleRefSet = (element: HTMLButtonElement | null) => {
      setButtonRef(element);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    };

    // Create the displayed text for XP
    const xpDisplayText = xpText || `+${xpAmount} XP`;

    return (
      <div className="relative">
        <Button
          ref={handleRefSet}
          onClick={handleClick}
          className={`${className || ''} relative`}
          {...props}
        >
          <span className="flex items-center gap-1">
            {children}
            <span className="ml-1 text-xs px-1.5 py-0.5 bg-primary/20 rounded-full text-primary-foreground/80 font-medium">
              {xpDisplayText}
            </span>
          </span>
        </Button>

        <XpAnimation
          xpAmount={xpAmount}
          isVisible={animationState.isVisible}
          onComplete={hideAnimation}
        />
      </div>
    );
  }
);

XpButton.displayName = 'XpButton';

export { XpButton };