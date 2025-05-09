import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon, LogOut } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
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
      className="fixed inset-0 z-50 animate-in slide-in-from-right duration-300"
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-[400px] bg-[#121242] border-l border-[hsl(var(--space-purple)/30)] h-full flex flex-col p-6 shadow-xl" style={{ backgroundColor: "#121242" }}>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[hsl(var(--space-purple))] rounded-full flex items-center justify-center">
              <i className="ri-planet-line text-lg"></i>
            </div>
            <h2 className="text-xl font-bold">Really Obvious Media Lab</h2>
          </div>
          <button 
            className="text-[hsl(var(--foreground)/90)] hover:text-[hsl(var(--space-pink))] p-2 rounded-full bg-[hsl(var(--space-purple)/30)] hover:bg-[hsl(var(--space-purple)/50)] transition-all" 
            onClick={onClose}
          >
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
                href="/success-stories" 
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Success Stories
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
              <Link 
                href="/browse"
                className="text-[hsl(var(--foreground)/70)] hover:text-[hsl(var(--space-pink))] transition-colors block py-2"
                onClick={onClose}
              >
                Categories
              </Link>
            </li>
            {isAdmin && (
              <li>
                <Link 
                  href="/admin" 
                  className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-pink)/80)] border border-[hsl(var(--space-purple)/50)] bg-[hsl(var(--space-purple)/20)] transition-colors block py-2 px-3 rounded-md font-bold mt-2"
                  onClick={onClose}
                >
                  Admin Console
                </Link>
              </li>
            )}
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
              <div className="flex items-center space-x-4 mb-6 bg-[#1a1a5e] p-4 rounded-lg" style={{ backgroundColor: "#1a1a5e" }}>
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
                  // Simple logout - just clear the user data and redirect to home
                  queryClient.setQueryData(["/api/user"], null);
                  toast({
                    title: "Logged out",
                    description: "You have been successfully logged out",
                  });
                  onClose();
                  setLocation('/');
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
