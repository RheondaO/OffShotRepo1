import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import MobileMenu from "./MobileMenu";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const isActivePath = (path: string) => {
    return location === path;
  };

  return (
    <header className="bg-[hsl(var(--space-blue)/80)] backdrop-blur-md sticky top-0 z-50 border-b border-[hsl(var(--space-purple)/20)]">
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
          <Link href="/">
            <a className={`${isActivePath("/") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
              Home
            </a>
          </Link>
          <Link href="/browse">
            <a className={`${isActivePath("/browse") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
              Browse Issues
            </a>
          </Link>
          <Link href="/submit">
            <a className={`${isActivePath("/submit") ? "text-[hsl(var(--foreground)/90)]" : "text-[hsl(var(--foreground)/70)]"} hover:text-[hsl(var(--space-pink))] transition-colors`}>
              Submit Issue
            </a>
          </Link>
        </nav>
        
        <button 
          className="md:hidden text-[hsl(var(--foreground)/90)] hover:text-[hsl(var(--space-pink))]" 
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <i className="ri-menu-line text-2xl"></i>
        </button>
        
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="outline" size="sm">
            Log In
          </Button>
          <Button size="sm">
            Sign Up
          </Button>
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
