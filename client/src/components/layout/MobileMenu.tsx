import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon, LogOut } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const { user, logoutMutation } = useAuth();
  
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
      className="fixed inset-0 bg-[hsl(var(--space-blue))] z-50 animate-in slide-in-from-right duration-300"
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
              <Link 
                href="/analytics" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Analytics
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
            {user && (
              <li>
                <Link 
                  href="/profile" 
                  className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                  onClick={onClose}
                >
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2" />
                    My Profile
                  </div>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        <div className="mt-auto space-y-4">
          <div className="flex justify-center mb-4">
            <ThemeToggle />
          </div>
          
          {user ? (
            <>
              <div className="flex items-center space-x-4 mb-6 bg-[hsl(var(--space-blue)/40)] p-4 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-[hsl(var(--space-blue)/20)] text-sm">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium text-[hsl(var(--foreground))]">{user.name}</h3>
                  <p className="text-sm text-[hsl(var(--foreground)/70)]">@{user.username}</p>
                </div>
                <div className="flex items-center justify-center rounded-full bg-[hsl(var(--space-green))] h-8 w-8 text-xs font-bold">
                  {user.level}
                </div>
              </div>

              <Link href="/profile" onClick={onClose}>
                <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                  <UserIcon className="w-4 h-4" />
                  <span>My Profile</span>
                </Button>
              </Link>
              
              <Button 
                className="w-full flex items-center justify-center gap-2 text-[hsl(var(--destructive))]" 
                variant="outline"
                onClick={() => {
                  logoutMutation.mutate();
                  onClose();
                }}
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
