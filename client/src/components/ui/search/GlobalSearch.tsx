
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative flex w-full max-w-sm items-center">
      <Input
        type="text"
        placeholder="Search issues, tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pr-10"
      />
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute right-0"
      >
        <Search className="h-4 w-4" />
      </Button>
    </div>
  );
}
