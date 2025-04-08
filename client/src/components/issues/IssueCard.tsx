import { useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime, getCategoryIconElement, DEFAULT_USER_ID } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { type Category, type Issue } from "@shared/schema";

interface IssueCardProps {
  issue: Issue;
}

const IssueCard = ({ issue }: IssueCardProps) => {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  
  // Fetch the category for this issue
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${issue.categoryId}`],
  });

  const handleVote = async () => {
    if (isVoting) return;
    
    setIsVoting(true);
    try {
      await apiRequest("POST", "/api/votes", { 
        issueId: issue.id, 
        userId: DEFAULT_USER_ID 
      });
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
      await queryClient.invalidateQueries({ queryKey: [`/api/issues/${issue.id}`] });
      await queryClient.invalidateQueries({ queryKey: ['/api/issues/featured'] });
      await queryClient.invalidateQueries({ queryKey: ['/api/issues/trending'] });
      
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
  
  return (
    <Card className="card issue-card bg-[hsl(var(--space-gray)/50)] rounded-xl overflow-hidden border border-[hsl(var(--space-purple)/20)] relative z-0">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-[hsl(var(--space-purple)/20)] text-[hsl(var(--space-pink))] border border-[hsl(var(--space-purple)/30)]">
            {category?.name || 'Loading...'}
          </span>
          <div className="flex items-center gap-1 text-[hsl(var(--foreground)/60)] text-sm">
            <i className="ri-time-line"></i>
            <span>{formatRelativeTime(issue.createdAt)}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--foreground)/90)]">
          {issue.title}
        </h3>
        
        <p className="text-[hsl(var(--foreground)/70)] mb-4 line-clamp-3">
          {issue.description}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[hsl(var(--space-purple)/30)] flex items-center justify-center">
              <span className="text-xs font-semibold">U{issue.userId}</span>
            </div>
            <span className="text-sm text-[hsl(var(--foreground)/60)]">Anonymous</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              className="flex items-center gap-1 text-[hsl(var(--foreground)/60)] hover:text-[hsl(var(--space-pink))] transition-colors"
              onClick={handleVote}
              disabled={isVoting}
            >
              <i className="ri-heart-line"></i>
              <span>{issue.votes}</span>
            </button>
            <button className="flex items-center gap-1 text-[hsl(var(--foreground)/60)] hover:text-[hsl(var(--space-gold))] transition-colors">
              <i className="ri-chat-1-line"></i>
              <span>{issue.comments}</span>
            </button>
          </div>
        </div>
      </div>
      
      <Link href={`/issues/${issue.id}`} className="absolute inset-0 z-10 sr-only">
        View issue details
      </Link>
    </Card>
  );
};

export default IssueCard;
