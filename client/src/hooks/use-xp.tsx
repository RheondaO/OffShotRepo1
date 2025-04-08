import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_USER_ID } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// XP activity constants
const XP_REWARDS = {
  COMMENT: 5,
  SUBMIT_ISSUE: 50,
  VOTE: 2,
  ADD_TAG: 5,
  LOGIN: 10,
  GAME_WIN: 25,
  GAME_PLAY: 5,
  NEWSLETTER_SIGNUP: 15
};

export const useXp = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id || DEFAULT_USER_ID;

  // Mutation to record user activity and earn XP
  const earnXpMutation = useMutation({
    mutationFn: async ({ 
      activityId, 
      xpEarned 
    }: { 
      activityId: number, 
      xpEarned: number 
    }) => {
      const response = await apiRequest('POST', `/api/users/${userId}/activities`, {
        activityId,
        xpEarned,
        performedAt: new Date().toISOString()
      });
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate user data to update XP
      queryClient.invalidateQueries({ queryKey: ['/api/user'] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/xp`] });
    },
    onError: (error: Error) => {
      toast({
        title: "XP Error",
        description: `Unable to record activity: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Check eligibility for activity
  const checkEligibility = useMutation({
    mutationFn: async ({ 
      activityId 
    }: { 
      activityId: number 
    }) => {
      const response = await apiRequest('GET', `/api/users/${userId}/activities/${activityId}/eligible`);
      return await response.json();
    }
  });

  // Helper function to perform actions and earn XP
  const performAction = async (activityId: number, xpAmount: number) => {
    try {
      // First check eligibility
      const eligibility = await checkEligibility.mutateAsync({ activityId });
      
      if (eligibility.eligible) {
        return await earnXpMutation.mutateAsync({
          activityId,
          xpEarned: xpAmount
        });
      }
      
      // Activity is on cooldown, silently fail
      console.log("Activity on cooldown:", eligibility.message);
      return null;
    } catch (error) {
      console.error("Error performing XP action:", error);
      return null;
    }
  };

  return {
    rewards: XP_REWARDS,
    earnXpMutation,
    checkEligibility,
    performAction
  };
};

export default useXp;