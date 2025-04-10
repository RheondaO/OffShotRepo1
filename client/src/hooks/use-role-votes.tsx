import { useEffect, useState } from "react";
import { useAuth } from "./use-auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type UserRole } from "@shared/schema";
import { useToast } from "./use-toast";

interface RoleVote {
  id: number;
  voterId: number;
  targetUserId: number;
  role: UserRole;
  createdAt: string;
  active: boolean;
}

interface UseRoleVotesProps {
  userId: number;
}

export function useRoleVotes({ userId }: UseRoleVotesProps) {
  const { user: currentUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [canVote, setCanVote] = useState(true);
  
  // Fetch role votes for the target user
  const { 
    data: userRoleVotes = [],
    isLoading: isLoadingVotes,
    isError: isVotesError,
  } = useQuery({
    queryKey: ['/api/users', userId, 'role-votes'],
    queryFn: async () => {
      const res = await apiRequest('GET', `/api/users/${userId}/role-votes`);
      return await res.json() as RoleVote[];
    },
    enabled: !!userId,
  });
  
  // Fetch votes cast by the current user
  const {
    data: castVotes = [],
    isLoading: isLoadingCastVotes,
  } = useQuery({
    queryKey: ['/api/users', currentUser?.id, 'role-votes', 'cast'],
    queryFn: async () => {
      if (!currentUser?.id) return [];
      const res = await apiRequest('GET', `/api/users/${currentUser.id}/role-votes/cast`);
      return await res.json() as RoleVote[];
    },
    enabled: !!currentUser?.id,
  });
  
  // Calculate vote counts for each role
  const councilVotes = userRoleVotes.filter(vote => vote.role === 'council_member').length;
  const moderatorVotes = userRoleVotes.filter(vote => vote.role === 'moderator').length;
  const czarVotes = userRoleVotes.filter(vote => vote.role === 'czar').length;
  
  // Cast a vote for the user
  const castVoteMutation = useMutation({
    mutationFn: async (role: UserRole) => {
      if (!currentUser) throw new Error('You must be logged in to vote');
      if (currentUser.id === userId) throw new Error('You cannot vote for yourself');
      
      const res = await apiRequest('POST', '/api/role-votes', {
        voterId: currentUser.id,
        targetUserId: userId,
        role,
      });
      
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'role-votes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser?.id, 'role-votes', 'cast'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      
      toast({
        title: 'Vote cast',
        description: 'Your vote has been recorded',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to cast vote',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Withdraw a vote
  const withdrawVoteMutation = useMutation({
    mutationFn: async (voteId: number) => {
      if (!currentUser) throw new Error('You must be logged in to withdraw a vote');
      
      const res = await apiRequest('DELETE', `/api/role-votes/${voteId}`);
      if (!res.ok) throw new Error('Failed to withdraw vote');
      
      return await res.json();
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'role-votes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', currentUser?.id, 'role-votes', 'cast'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      
      toast({
        title: 'Vote withdrawn',
        description: 'Your vote has been withdrawn',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to withdraw vote',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
  
  // Check if current user can vote for this user
  useEffect(() => {
    if (!currentUser || currentUser.id === userId) {
      setCanVote(false);
      return;
    }
    
    setCanVote(true);
  }, [currentUser, userId]);
  
  // Check if the current user has voted for specific roles
  const hasVotedForCouncil = castVotes.some(vote => 
    vote.targetUserId === userId && vote.role === 'council_member' && vote.active
  );
  
  const hasVotedForModerator = castVotes.some(vote => 
    vote.targetUserId === userId && vote.role === 'moderator' && vote.active
  );
  
  const hasVotedForCzar = castVotes.some(vote => 
    vote.targetUserId === userId && vote.role === 'czar' && vote.active
  );
  
  // Get vote IDs if the user has voted
  const councilVoteId = castVotes.find(vote => 
    vote.targetUserId === userId && vote.role === 'council_member' && vote.active
  )?.id;
  
  const moderatorVoteId = castVotes.find(vote => 
    vote.targetUserId === userId && vote.role === 'moderator' && vote.active
  )?.id;
  
  const czarVoteId = castVotes.find(vote => 
    vote.targetUserId === userId && vote.role === 'czar' && vote.active
  )?.id;
  
  return {
    isLoading: isLoadingVotes || isLoadingCastVotes,
    isError: isVotesError,
    councilVotes,
    moderatorVotes,
    czarVotes,
    hasVotedForCouncil,
    hasVotedForModerator,
    hasVotedForCzar,
    councilVoteId,
    moderatorVoteId,
    czarVoteId,
    canVote,
    castVote: castVoteMutation.mutate,
    withdrawVote: withdrawVoteMutation.mutate,
    isCasting: castVoteMutation.isPending,
    isWithdrawing: withdrawVoteMutation.isPending,
  };
}