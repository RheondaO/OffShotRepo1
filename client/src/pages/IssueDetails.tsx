import React, { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate, DEFAULT_USER_ID } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { XpButton } from "@/components/ui/xp-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IssueDetailsSkeleton } from "@/components/issues/IssueDetailsSkeleton";
import { TagInput } from "@/components/tags";
import { CommentList } from "@/components/comments";
import { type Issue, type Category, type Tag } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import useXp from "@/hooks/use-xp";

const IssueDetails = () => {
  const [match, params] = useRoute("/issues/:id");
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  const [issueTags, setIssueTags] = useState<Tag[]>([]);
  const { rewards, performAction } = useXp();
  
  const issueId = match ? parseInt(params.id) : null;
  
  const { data: issue, isLoading: isIssueLoading, error } = useQuery<Issue>({
    queryKey: [`/api/issues/${issueId}`],
    enabled: !!issueId,
  });
  
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${issue?.categoryId}`],
    enabled: !!issue?.categoryId,
  });
  
  // Fetch tags for this issue
  const { data: tags = [], isLoading: isTagsLoading } = useQuery<Tag[]>({
    queryKey: [`/api/issues/${issueId}/tags`],
    queryFn: () => apiRequest('GET', `/api/issues/${issueId}/tags`).then(r => r.json()),
    enabled: !!issueId
  });
  
  // Update local state when tags data changes
  useEffect(() => {
    if (tags) {
      setIssueTags(tags);
    }
  }, [tags]);
  
  const handleVote = async () => {
    if (!issue || isVoting) return;
    
    setIsVoting(true);
    try {
      // Submit the vote
      await apiRequest("POST", "/api/votes", { 
        issueId: issue.id, 
        userId: DEFAULT_USER_ID 
      });
      
      // Try to earn XP for the vote action
      await performAction(4, rewards.VOTE); // Activity ID 4 is for voting
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: [`/api/issues/${issue.id}`] });
      
      toast({
        title: "Success",
        description: "Your vote has been recorded!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit your vote. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVoting(false);
    }
  };
  
  // Handle error and loading states
  if (!issueId) {
    navigate("/not-found");
    return null;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="py-8">
            <div className="text-center">
              <i className="ri-error-warning-line text-4xl text-red-500 mb-4"></i>
              <h1 className="text-2xl font-bold mb-4">Issue Not Found</h1>
              <p className="text-[hsl(var(--foreground)/70)] mb-6">
                The issue you're looking for doesn't exist or has been removed.
              </p>
              <Button onClick={() => navigate("/browse")}>
                Browse Issues
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isIssueLoading || !issue) {
    return <IssueDetailsSkeleton />;
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate("/browse")}
          className="mb-6"
        >
          <i className="ri-arrow-left-line mr-2"></i>
          Back to Issues
        </Button>
        
        <Card className="border border-[hsl(var(--space-purple)/20)]">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <Badge variant="outline" className="px-3 py-1 text-xs font-mono rounded-full bg-[hsl(var(--space-purple)/20)] text-[hsl(var(--space-pink))] border border-[hsl(var(--space-purple)/30)]">
                {category?.name || 'Loading...'}
              </Badge>
              <div className="text-sm text-[hsl(var(--foreground)/60)]">
                Submitted {formatDate(issue.createdAt)}
              </div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{issue.title}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[hsl(var(--space-purple)/30)] flex items-center justify-center">
                  <span className="text-xs font-semibold">U{issue.userId}</span>
                </div>
                <span className="text-sm text-[hsl(var(--foreground)/60)]">Anonymous</span>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-1 text-[hsl(var(--foreground)/70)]">
                <i className="ri-map-pin-line"></i>
                <span>{issue.location || 'No location specified'}</span>
              </div>
            </div>
            
            <Separator className="mb-6" />
            
            <div className="prose prose-invert max-w-none mb-8">
              <p className="whitespace-pre-line">{issue.description}</p>
            </div>
            
            <div className="mt-6 mb-8">
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Tags</h3>
              <TagInput 
                issueTags={issueTags} 
                issueId={issue.id} 
                onTagsChange={setIssueTags}
                userId={DEFAULT_USER_ID}
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-4">
                <XpButton 
                  variant="secondary"
                  onClick={handleVote}
                  disabled={isVoting}
                  className="flex items-center gap-2"
                  xpAmount={rewards.VOTE}
                >
                  <i className="ri-heart-line"></i>
                  Support ({issue.votes})
                </XpButton>
                
                <Button variant="outline" className="flex items-center gap-2">
                  <i className="ri-share-line"></i>
                  Share
                </Button>
              </div>
              
              <div className="text-sm text-[hsl(var(--foreground)/60)]">
                Status: <span className="font-semibold">{issue.status.toUpperCase()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Related issues section (could be implemented in the future) */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Related Issues</h2>
          <div className="text-center py-8 bg-[hsl(var(--space-gray)/30)] rounded-xl border border-[hsl(var(--space-purple)/20)]">
            <p className="text-[hsl(var(--foreground)/60)]">
              No related issues found at this time.
            </p>
          </div>
        </div>
        
        {/* Comments section */}
        <div className="mt-12">
          <Card className="border border-[hsl(var(--space-purple)/20)]">
            <CardContent className="pt-6">
              <CommentList issueId={issue.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
