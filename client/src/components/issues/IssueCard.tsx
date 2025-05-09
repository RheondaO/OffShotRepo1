import { useState } from "react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatRelativeTime, getCategoryIconElement, DEFAULT_USER_ID } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { type Category, type Issue } from "@shared/schema";

interface IssueWithCategory extends Issue {
  category?: Category | null;
}

interface IssueCardProps {
  issue: Issue | IssueWithCategory;
  onClick?: (issueId: number) => void;
}

const IssueCard = ({ issue, onClick }: IssueCardProps) => {
  const { toast } = useToast();
  const [isVoting, setIsVoting] = useState(false);
  
  // Check if issue has included category data
  const hasCategory = 'category' in issue && issue.category;
  
  // Only fetch the category if it's not already included in the issue
  const { data: category } = useQuery<Category>({
    queryKey: [`/api/categories/${issue.categoryId}`],
    enabled: !hasCategory // Only run query if we don't already have the category
  });

  // Use the included category or the fetched one
  const categoryData = hasCategory ? (issue as IssueWithCategory).category : category;

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
  
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent the default behavior and propagation
    e.preventDefault();
    e.stopPropagation();
    
    // Only trigger the onClick if it exists
    if (onClick) {
      onClick(issue.id);
    }
  };
  
  return (
    <Card 
      className="card issue-card bg-[hsl(var(--space-gray)/50)] rounded-xl overflow-hidden border border-[hsl(var(--space-purple)/20)] relative z-0 cursor-pointer hover:shadow-lg transition-all"
      onClick={handleCardClick}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-[hsl(var(--space-purple)/20)] text-[hsl(var(--space-pink))] border border-[hsl(var(--space-purple)/30)]">
            {categoryData?.name || 'Loading...'}
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
              className="flex items-center gap-1 text-[hsl(var(--foreground)/60)] hover:text-[hsl(var(--space-pink))] transition-colors relative z-20"
              onClick={(e) => {
                e.stopPropagation();
                handleVote();
              }}
              disabled={isVoting}
            >
              <i className="ri-heart-line"></i>
              <span>{issue.votes}</span>
            </button>
            <button 
              className="flex items-center gap-1 text-[hsl(var(--foreground)/60)] hover:text-[hsl(var(--space-gold))] transition-colors relative z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <i className="ri-chat-1-line"></i>
              <span>{issue.comments}</span>
            </button>
          </div>
        </div>
      </div>
      
      {!onClick && (
        <Link 
          href={`/issues/${issue.id}`} 
          className="absolute inset-0 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <span className="sr-only">View issue details</span>
        </Link>
      )}
    </Card>
  );
};

export default IssueCard;
