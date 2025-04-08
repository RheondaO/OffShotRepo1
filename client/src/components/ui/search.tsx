import React, { useState } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

const SearchBar = ({ 
  placeholder = "Search community issues...",
  className = ""
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, navigate] = useLocation();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <Input 
        type="text" 
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-5 py-4 h-auto rounded-full bg-[hsl(var(--space-gray)/50)] border border-[hsl(var(--space-purple)/30)] text-[hsl(var(--foreground)/90)] shadow-inner focus:outline-none focus:ring-2 focus:ring-[hsl(var(--space-purple)/50)] focus:border-[hsl(var(--space-purple)/50)] backdrop-blur-sm pl-12"
      />
      <i className="ri-search-line absolute left-4 top-1/2 transform -translate-y-1/2 text-[hsl(var(--foreground)/60)] text-lg"></i>
    </form>
  );
};

export default SearchBar;
