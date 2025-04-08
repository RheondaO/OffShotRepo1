import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Add event listener to close menu when clicking outside
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);
  
  if (!mounted) return null;
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-[hsl(var(--space-blue))] z-50 transition-transform duration-300 ease-in-out"
    >
      <div className="h-full flex flex-col p-6">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[hsl(var(--space-purple))] rounded-full flex items-center justify-center">
              <i className="ri-planet-line text-lg"></i>
            </div>
            <h2 className="text-xl font-bold">Really Obvious Media Lab</h2>
          </div>
          <button className="text-[hsl(var(--foreground)/90)]" onClick={onClose}>
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-6 text-xl">
            <li>
              <Link 
                href="/" 
                className="text-[hsl(var(--foreground)/90)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                href="/browse" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Browse Issues
              </Link>
            </li>
            <li>
              <Link 
                href="/submit" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Submit Issue
              </Link>
            </li>
            <li>
              <Link 
                href="/chat" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Community Chat
              </Link>
            </li>
            <li>
              <Link 
                href="/mission" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Our Mission
              </Link>
            </li>
            <li>
              <Link 
                href="/games" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Games
              </Link>
            </li>
            <li>
              <a 
                href="#"
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
              >
                Categories
              </a>
            </li>
          </ul>
        </nav>
        
        <div className="mt-auto space-y-4">
          <Link href="/auth" onClick={onClose}>
            <Button className="w-full" variant="outline">
              Log In
            </Button>
          </Link>
          <Link href="/auth?tab=register" onClick={onClose}>
            <Button className="w-full">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
