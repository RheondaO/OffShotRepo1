import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Tag, InsertTag } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { DEFAULT_USER_ID } from '@/lib/utils';

export function useTags() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch all tags
  const { 
    data: tags = [], 
    isLoading: isLoadingTags,
    refetch: refetchTags
  } = useQuery<Tag[]>({
    queryKey: ['/api/tags'],
    queryFn: () => apiRequest('GET', '/api/tags').then(r => r.json()),
  });

  // Search tags
  const searchTags = async (query: string) => {
    if (!query || query.length < 2) return [];
    
    return apiRequest('GET', `/api/tags?search=${encodeURIComponent(query)}`)
      .then(r => r.json());
  };

  // Create a new tag
  const createTagMutation = useMutation({
    mutationFn: async (data: InsertTag) => {
      const res = await apiRequest('POST', '/api/tags', data);
      return res.json() as Promise<Tag>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      toast({
        title: 'Success',
        description: 'Tag created successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create tag',
        variant: 'destructive',
      });
    },
  });

  // Get tags for an issue
  const getIssueTags = (issueId: number) => {
    return useQuery<Tag[]>({
      queryKey: [`/api/issues/${issueId}/tags`],
      queryFn: () => apiRequest('GET', `/api/issues/${issueId}/tags`).then(r => r.json()),
      enabled: !!issueId,
    });
  };

  // Add a tag to an issue
  const addTagToIssueMutation = useMutation({
    mutationFn: async ({ 
      issueId, 
      tagId, 
      userId = DEFAULT_USER_ID 
    }: { 
      issueId: number; 
      tagId: number; 
      userId?: number; 
    }) => {
      const res = await apiRequest('POST', `/api/issues/${issueId}/tags`, {
        tagId,
        createdBy: userId
      });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${variables.issueId}/tags`] });
      queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      toast({
        title: 'Success',
        description: 'Tag added to issue',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add tag to issue',
        variant: 'destructive',
      });
    },
  });

  // Remove a tag from an issue
  const removeTagFromIssueMutation = useMutation({
    mutationFn: async ({ issueId, tagId }: { issueId: number; tagId: number }) => {
      await apiRequest('DELETE', `/api/issues/${issueId}/tags/${tagId}`);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${variables.issueId}/tags`] });
      queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      toast({
        title: 'Success',
        description: 'Tag removed from issue',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove tag from issue',
        variant: 'destructive',
      });
    },
  });

  // Get issues by tag
  const getIssuesByTag = (tagId: number) => {
    return useQuery({
      queryKey: [`/api/tags/${tagId}/issues`],
      queryFn: () => apiRequest('GET', `/api/tags/${tagId}/issues`).then(r => r.json()),
      enabled: !!tagId,
    });
  };

  return {
    tags,
    isLoadingTags,
    refetchTags,
    searchTags,
    createTag: createTagMutation.mutate,
    isCreatingTag: createTagMutation.isPending,
    getIssueTags,
    addTagToIssue: addTagToIssueMutation.mutate,
    isAddingTag: addTagToIssueMutation.isPending,
    removeTagFromIssue: removeTagFromIssueMutation.mutate,
    isRemovingTag: removeTagFromIssueMutation.isPending,
    getIssuesByTag,
  };
}

export default useTags;