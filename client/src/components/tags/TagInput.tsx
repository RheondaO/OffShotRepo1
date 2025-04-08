import React, { useState, useRef, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Tag, InsertTag } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { XpButton } from '@/components/ui/xp-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Plus, Search, Tag as TagIcon } from 'lucide-react';
import { TagBadge } from './TagBadge';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DEFAULT_USER_ID } from '@/lib/utils';
import useXp from '@/hooks/use-xp';

interface TagInputProps {
  issueTags: Tag[];
  issueId: number;
  onTagsChange?: (tags: Tag[]) => void;
  userId?: number;
}

export function TagInput({ 
  issueTags = [], 
  issueId, 
  onTagsChange,
  userId = DEFAULT_USER_ID 
}: TagInputProps) {
  const [search, setSearch] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const { rewards, performAction } = useXp();
  
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);
  
  // Fetch tags based on search
  const { data: searchResults = [], isLoading: isSearching } = useQuery<Tag[]>({
    queryKey: ['/api/tags', search],
    queryFn: () => apiRequest('GET', `/api/tags?search=${encodeURIComponent(search)}`).then(r => r.json()),
    enabled: open && search.length > 1,
  });
  
  // Filter out tags already added to the issue
  const filteredResults = searchResults.filter(
    tag => !issueTags.some(t => t.id === tag.id)
  );
  
  // Create a new tag
  const createTagMutation = useMutation({
    mutationFn: async (data: InsertTag) => {
      const res = await apiRequest('POST', '/api/tags', data);
      return res.json() as Promise<Tag>;
    },
    onSuccess: (newTag) => {
      queryClient.invalidateQueries({ queryKey: ['/api/tags'] });
      addTagToIssueMutation.mutate({ tagId: newTag.id });
      setNewTagName('');
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to create new tag',
        variant: 'destructive'
      });
    }
  });
  
  // Add tag to issue
  const addTagToIssueMutation = useMutation({
    mutationFn: async ({ tagId }: { tagId: number }) => {
      const res = await apiRequest('POST', `/api/issues/${issueId}/tags`, {
        tagId,
        createdBy: userId
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${issueId}/tags`] });
      queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      
      // Refresh the issue tags
      fetchIssueTags();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to add tag to issue',
        variant: 'destructive'
      });
    }
  });
  
  // Remove tag from issue
  const removeTagMutation = useMutation({
    mutationFn: async (tagId: number) => {
      await apiRequest('DELETE', `/api/issues/${issueId}/tags/${tagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/issues/${issueId}/tags`] });
      queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      
      // Refresh the issue tags
      fetchIssueTags();
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to remove tag from issue',
        variant: 'destructive'
      });
    }
  });
  
  // Fetch issue tags
  const { refetch: fetchIssueTags } = useQuery<Tag[]>({
    queryKey: [`/api/issues/${issueId}/tags`],
    queryFn: () => apiRequest('GET', `/api/issues/${issueId}/tags`).then(r => r.json()),
    enabled: !!issueId
  });
  
  // Use a useEffect to call onTagsChange when tags are updated
  useEffect(() => {
    if (onTagsChange) {
      onTagsChange(issueTags);
    }
  }, [issueTags, onTagsChange]);
  
  const handleAddTag = async (tagId: number) => {
    addTagToIssueMutation.mutate({ tagId });
    
    // Try to earn XP for adding a tag
    await performAction(5, rewards.ADD_TAG); // Activity ID 5 is for adding tags
    
    setSearch('');
    setOpen(false); // Close the popover after adding
  };
  
  const handleCreateNewTag = async () => {
    if (newTagName.trim().length < 2) {
      toast({
        title: 'Invalid tag name',
        description: 'Tag name must be at least 2 characters',
        variant: 'destructive'
      });
      return;
    }
    
    createTagMutation.mutate({
      name: newTagName.trim(),
      description: null,
      createdBy: userId
    });
    
    // Try to earn XP for adding a tag
    await performAction(5, rewards.ADD_TAG); // Activity ID 5 is for adding tags
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-wrap gap-2">
        {issueTags.map((tag) => (
          <TagBadge
            key={tag.id}
            tag={tag}
            onRemove={() => removeTagMutation.mutate(tag.id)}
          />
        ))}
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <XpButton 
              variant="outline" 
              size="sm" 
              className="h-8 gap-1 rounded-full"
              xpAmount={rewards.ADD_TAG}
            >
              <Plus size={16} />
              <span>Add Tag</span>
            </XpButton>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-3">
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-1">
                <TagIcon size={16} />
                <span>Add Tags</span>
              </h4>
              
              <div className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Search or create tags..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setNewTagName(e.target.value);
                    }}
                  />
                </div>
              </div>
              
              <ScrollArea className="h-[200px]">
                {isSearching ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                ) : (
                  <>
                    {filteredResults.length > 0 ? (
                      <div className="space-y-2">
                        {filteredResults.map((tag) => (
                          <div 
                            key={tag.id}
                            className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-muted cursor-pointer"
                            onClick={() => handleAddTag(tag.id)}
                          >
                            <div className="flex items-center gap-2">
                              <TagIcon size={14} className="text-muted-foreground" />
                              <span>{tag.name}</span>
                            </div>
                            <Plus size={14} className="opacity-50" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      search.length > 1 && (
                        <div className="space-y-4 py-2">
                          <p className="text-sm text-muted-foreground text-center py-2">
                            No tags found
                          </p>
                          <XpButton 
                            size="sm"
                            className="w-full gap-1"
                            disabled={createTagMutation.isPending}
                            onClick={handleCreateNewTag}
                            xpAmount={rewards.ADD_TAG}
                          >
                            {createTagMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus size={16} />
                            )}
                            <span>Create "{newTagName}"</span>
                          </XpButton>
                        </div>
                      )
                    )}
                  </>
                )}
              </ScrollArea>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export default TagInput;