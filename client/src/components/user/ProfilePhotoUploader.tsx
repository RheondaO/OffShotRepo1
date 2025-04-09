import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2, Search } from "lucide-react";
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ProfileImageModal } from './ProfileImageModal';

interface ProfilePhotoUploaderProps {
  userId: number;
  currentPhotoUrl: string | null;
  username: string;
  onPhotoUpdated?: (photoUrl: string) => void;
}

export function ProfilePhotoUploader({ 
  userId, 
  currentPhotoUrl, 
  username,
  onPhotoUpdated 
}: ProfilePhotoUploaderProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const uploadMutation = useMutation({
    mutationFn: async (photoData: string) => {
      const res = await apiRequest('POST', `/api/users/${userId}/photo`, { photoData });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to upload photo');
      }
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      toast({
        title: 'Photo updated',
        description: 'Your profile photo has been updated successfully',
      });
      if (onPhotoUpdated && data.user.photoUrl) {
        onPhotoUpdated(data.user.photoUrl);
      }
    },
    onError: (error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image under 5MB',
        variant: 'destructive',
      });
      return;
    }
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      uploadMutation.mutate(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getUserInitials = () => {
    return username ? username.substring(0, 2).toUpperCase() : '??';
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6 flex flex-col items-center justify-center space-y-4">
        <div className="relative group">
          <Avatar className="w-24 h-24 border-2 border-[hsl(var(--space-blue)/40)]">
            <AvatarImage src={previewUrl || undefined} alt={username} />
            <AvatarFallback className="text-lg font-bold">{getUserInitials()}</AvatarFallback>
          </Avatar>
          {uploadMutation.isPending ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <>
              <div 
                className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 rounded-full flex items-center justify-center transition-opacity duration-200 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  // Open the view modal if there's an image, otherwise open file picker
                  if (previewUrl) {
                    setIsImageModalOpen(true);
                  } else {
                    triggerFileInput();
                  }
                }}
              >
                <div className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {previewUrl ? 
                    <Search className="h-5 w-5 text-[hsl(var(--space-blue))]" /> : 
                    <ImagePlus className="h-5 w-5 text-[hsl(var(--space-blue))]" />
                  }
                </div>
              </div>
              
              {/* Edit button at corner */}
              {previewUrl && (
                <div 
                  className="absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 bg-[hsl(var(--space-blue))] p-1.5 rounded-full shadow-md cursor-pointer opacity-0 group-hover:opacity-100 transition-all z-10" 
                  onClick={triggerFileInput}
                >
                  <ImagePlus className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              
              {/* Image Modal */}
              <ProfileImageModal
                imageUrl={previewUrl}
                username={username}
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
              />
            </>
          )}
        </div>
        
        <div className="flex flex-col items-center">
          <Label htmlFor="profile-photo" className="font-medium mb-2">Profile Photo</Label>
          <input
            ref={fileInputRef}
            id="profile-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={triggerFileInput}
            disabled={uploadMutation.isPending}
            className="flex items-center gap-2"
          >
            <ImagePlus className="h-4 w-4" />
            {currentPhotoUrl ? 'Change Photo' : 'Upload Photo'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}