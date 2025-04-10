import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface ProfileBioEditorProps {
  userId: number;
  currentBio: string;
}

export function ProfileBioEditor({ userId, currentBio }: ProfileBioEditorProps) {
  const [bio, setBio] = useState(currentBio || "");
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const updateBioMutation = useMutation({
    mutationFn: async (newBio: string) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}/bio`, { bio: newBio });
      if (!res.ok) {
        throw new Error("Failed to update bio");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId] });
      setIsEditing(false);
      toast({
        title: "Bio updated",
        description: "Your bio has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update bio",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const handleSave = () => {
    updateBioMutation.mutate(bio);
  };
  
  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="min-h-[100px] p-3 border rounded-md bg-background">
          {currentBio ? (
            <p className="text-sm whitespace-pre-wrap">{currentBio}</p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No bio added yet. Tell others about yourself!</p>
          )}
        </div>
        <Button onClick={() => setIsEditing(true)} className="w-full">
          Edit Bio
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="bio">About Me</Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell others about yourself..."
          className="min-h-[120px] resize-none mt-2"
        />
        <p className="text-xs text-muted-foreground mt-1">
          {bio.length}/500 characters
        </p>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button 
          variant="outline" 
          onClick={() => {
            setBio(currentBio || "");
            setIsEditing(false);
          }}
          disabled={updateBioMutation.isPending}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          disabled={updateBioMutation.isPending || bio === currentBio}
        >
          {updateBioMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  );
}