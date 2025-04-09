import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useStreak } from "@/hooks/use-streak";

// This component is meant to be rendered once at the application level
// It will check and update the user's streak when they log in
export function StreakUpdater() {
  const { user } = useAuth();
  const { updateStreak } = useStreak();
  
  useEffect(() => {
    // Only update streak if user is logged in
    if (user) {
      // Get the last update date from localStorage (if available)
      const lastUpdateDateStr = localStorage.getItem('lastStreakUpdate');
      const lastUpdateDate = lastUpdateDateStr ? new Date(lastUpdateDateStr) : null;
      
      // Check if we need to update the streak
      const now = new Date();
      const needsUpdate = !lastUpdateDate || 
        lastUpdateDate.getDate() !== now.getDate() || 
        lastUpdateDate.getMonth() !== now.getMonth() || 
        lastUpdateDate.getFullYear() !== now.getFullYear();
      
      if (needsUpdate) {
        // Update the streak
        updateStreak();
        
        // Store the current date in localStorage
        localStorage.setItem('lastStreakUpdate', now.toISOString());
      }
    }
  }, [user, updateStreak]);
  
  // This component doesn't render anything
  return null;
}