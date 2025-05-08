import { useState, useContext } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth, AuthContext } from "@/hooks/use-auth";
import MobileMenu from "./MobileMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { UserIcon, LogOut, Settings } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const isActivePath = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-[#121242] sticky top-0 z-50 border-b border-[hsl(var(--space-purple)/20)]" style={{ backgroundColor: "#121242" }}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center space-x-1 cursor-pointer">
            <div className="w-8 h-8 bg-[hsl(var(--space-purple))] rounded-full flex items-center justify-center animate-pulse-slow">
              <i className="ri-planet-line text-lg"></i>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-[hsl(var(--space-pink))] to-[hsl(var(--space-gold))] bg-clip-text text-transparent">
              Really Obvious Media Lab
            </h1>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className={`${isActivePath("/") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Home
          </Link>
          <Link href="/browse" className={`${isActivePath("/browse") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Browse Issues
          </Link>
          <Link href="/submit" className={`${isActivePath("/submit") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Submit Issue
          </Link>
          <Link href="/chat" className={`${isActivePath("/chat") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Community Chat
          </Link>
          <Link href="/mission" className={`${isActivePath("/mission") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Our Mission
          </Link>
          <Link href="/games" className={`${isActivePath("/games") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Games
          </Link>
          <Link href="/analytics" className={`${isActivePath("/analytics") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Analytics
          </Link>
          <Link href="/browse" className={`${isActivePath("/browse") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
            Categories
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-[hsl(var(--space-pink))] hover:text-[hsl(var(--space-pink)/80)] transition-colors font-bold border border-[hsl(var(--space-purple)/50)] px-2 py-0.5 rounded-md bg-[hsl(var(--space-purple)/30)]">
              Admin Console
            </Link>
          )}
        </nav>
        
        <button 
          className="md:hidden text-[hsl(var(--foreground)/90)] hover:text-[hsl(var(--space-pink))] p-2 rounded-full bg-[hsl(var(--space-purple)/30)] hover:bg-[hsl(var(--space-purple)/50)] transition-all" 
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <div className="flex flex-col space-y-1.5">
            <div className="w-5 h-0.5 bg-current rounded-full"></div>
            <div className="w-5 h-0.5 bg-current rounded-full"></div>
            <div className="w-5 h-0.5 bg-current rounded-full"></div>
          </div>
        </button>
        
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoUrl || ''} alt={user.name} />
                    <AvatarFallback className="bg-[hsl(var(--space-blue)/20)] text-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-[hsl(var(--space-green))] flex items-center justify-center text-[10px] font-bold">
                    {user.level}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoUrl || ''} alt={user.name} />
                    <AvatarFallback className="bg-[hsl(var(--space-blue)/20)] text-xs">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-[hsl(var(--foreground)/70)]">@{user.username}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/submit">
                  <DropdownMenuItem className="cursor-pointer">
                    <i className="ri-add-line w-4 h-4 mr-2" />
                    <span>Submit Issue</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/profile?tab=settings">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-[hsl(var(--destructive))]" 
                  onClick={() => {
                    // Simple logout - just clear the user data and redirect to home
                    queryClient.setQueryData(["/api/user"], null);
                    toast({
                      title: "Logged out",
                      description: "You have been successfully logged out",
                    });
                    setLocation('/');
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="outline" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
