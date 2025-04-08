import { useQuery, useMutation } from "@tanstack/react-query";
import { Comment, InsertComment } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export const useComments = (issueId: number | null) => {
  const { toast } = useToast();

  // Fetch comments for an issue
  const {
    data: comments = [],
    isLoading: isLoadingComments,
    error: commentsError,
    refetch: refetchComments
  } = useQuery({
    queryKey: ['/api/issues', issueId, 'comments'],
    queryFn: async () => {
      if (!issueId) return [];
      const response = await apiRequest('GET', `/api/issues/${issueId}/comments`);
      return await response.json();
    },
    enabled: !!issueId
  });

  // Add a comment to an issue
  const addCommentMutation = useMutation({
    mutationFn: async (comment: Omit<InsertComment, 'issueId'>) => {
      if (!issueId) throw new Error('Issue ID is required');
      const response = await apiRequest('POST', `/api/issues/${issueId}/comments`, comment);
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the comments query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/issues', issueId, 'comments'] });
      toast({
        title: "Comment Added",
        description: "Your comment has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Add a reply to a comment
  const addReplyMutation = useMutation({
    mutationFn: async ({ 
      commentId, 
      reply 
    }: { 
      commentId: number; 
      reply: Omit<InsertComment, 'issueId' | 'parentId'> 
    }) => {
      const response = await apiRequest('POST', `/api/comments/${commentId}/replies`, reply);
      return await response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate the replies query for the specific comment
      queryClient.invalidateQueries({ queryKey: ['/api/comments', variables.commentId, 'replies'] });
      toast({
        title: "Reply Added",
        description: "Your reply has been added successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to add reply: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Edit a comment
  const editCommentMutation = useMutation({
    mutationFn: async ({ 
      commentId, 
      content, 
      userId 
    }: { 
      commentId: number; 
      content: string; 
      userId: number;
    }) => {
      const response = await apiRequest('PATCH', `/api/comments/${commentId}`, { content, userId });
      return await response.json();
    },
    onSuccess: (_, variables) => {
      // Invalidate both comments and replies queries
      queryClient.invalidateQueries({ queryKey: ['/api/issues', issueId, 'comments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/comments', variables.commentId, 'replies'] });
      toast({
        title: "Comment Updated",
        description: "Your comment has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update comment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Delete a comment
  const deleteCommentMutation = useMutation({
    mutationFn: async ({ 
      commentId, 
      userId 
    }: { 
      commentId: number; 
      userId: number;
    }) => {
      const response = await apiRequest('DELETE', `/api/comments/${commentId}?userId=${userId}`);
      return await response.json();
    },
    onSuccess: () => {
      // Invalidate the comments query to refetch
      queryClient.invalidateQueries({ queryKey: ['/api/issues', issueId, 'comments'] });
      toast({
        title: "Comment Deleted",
        description: "Your comment has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to delete comment: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Custom hook for fetching replies for a specific comment
  const useCommentReplies = (commentId: number | null) => {
    return useQuery({
      queryKey: ['/api/comments', commentId, 'replies'],
      queryFn: async () => {
        if (!commentId) return [];
        const response = await apiRequest('GET', `/api/comments/${commentId}/replies`);
        return await response.json() as Comment[];
      },
      enabled: !!commentId
    });
  };

  return {
    comments,
    isLoadingComments,
    commentsError,
    refetchComments,
    addCommentMutation,
    addReplyMutation,
    editCommentMutation,
    deleteCommentMutation,
    useCommentReplies
  };
};