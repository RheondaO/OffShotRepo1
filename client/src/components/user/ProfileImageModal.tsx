import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { useState } from "react";
import { X } from "lucide-react";

interface ProfileImageModalProps {
  imageUrl: string | null;
  username: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileImageModal({
  imageUrl,
  username,
  open,
  onOpenChange
}: ProfileImageModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg flex flex-col items-center">
        <DialogHeader className="w-full">
          <DialogTitle className="text-center">{username}'s Profile Photo</DialogTitle>
          <button 
            className="absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center border border-gray-300 hover:bg-[hsl(var(--muted))]"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </button>
        </DialogHeader>
        <div className="p-4 w-full flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={`${username}'s profile photo`} 
              className="max-w-full max-h-[500px] rounded-md object-contain"
            />
          ) : (
            <div className="h-64 w-64 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center text-4xl font-bold">
              {username.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}