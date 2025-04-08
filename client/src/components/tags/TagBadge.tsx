import React from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Tag } from '@shared/schema';

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
  className?: string;
  interactive?: boolean;
}

export const TagBadge = ({ 
  tag, 
  onRemove, 
  className = "", 
  interactive = true 
}: TagBadgeProps) => {
  return (
    <Badge 
      variant="outline"
      className={`bg-secondary/30 hover:bg-secondary/40 text-secondary-foreground px-2 py-1 rounded-full flex items-center gap-1 group ${interactive ? 'cursor-pointer' : ''} ${className}`}
    >
      <span className="text-xs font-medium">{tag.name}</span>
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="opacity-60 hover:opacity-100 transition-opacity rounded-full p-0.5"
          aria-label={`Remove ${tag.name} tag`}
        >
          <X size={12} />
        </button>
      )}
    </Badge>
  );
};

export default TagBadge;