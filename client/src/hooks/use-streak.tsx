import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

type StreakInfo = {
  currentStreak: number;
  longestStreak: number;
  lastLoginAt: string | null;
};

type StreakMutationResponse = {
  user: {
    id: number;
    currentStreak: number;
    longestStreak: number;
    lastLoginAt: string | null;
  };
  xpAwarded: number;
  message: string;
};

export function useStreak() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const { data: streakInfo, isLoading: isLoadingStreak } = useQuery<StreakInfo>({
    queryKey: ["/api/users", userId, "streak"],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const res = await apiRequest("GET", `/api/users/${userId}/streak`);
      return await res.json();
    },
    enabled: !!userId,
  });

  const updateStreakMutation = useMutation<StreakMutationResponse, Error, void>({
    mutationFn: async () => {
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const res = await apiRequest("POST", `/api/users/${userId}/streak`);
      return await res.json();
    },
    onSuccess: (data) => {
      // Update the streak data in the cache
      queryClient.setQueryData(["/api/users", userId, "streak"], {
        currentStreak: data.user.currentStreak,
        longestStreak: data.user.longestStreak,
        lastLoginAt: data.user.lastLoginAt,
      });

      // Update the user's XP data
      queryClient.invalidateQueries({ queryKey: ["/api/users", userId, "xp"] });

      // If XP was awarded, show a toast
      if (data.xpAwarded > 0) {
        toast({
          title: "Streak Reward!",
          description: `You maintained your login streak! +${data.xpAwarded} XP`,
          variant: "default",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error updating streak",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    streakInfo: streakInfo || { currentStreak: 0, longestStreak: 0, lastLoginAt: null },
    isLoadingStreak,
    updateStreak: updateStreakMutation.mutate,
    isUpdatingStreak: updateStreakMutation.isPending,
  };
}