import { Link } from "wouter";
import { useState } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_USER_ID, calculatePriority, getPriorityColorClass, getPriorityIcon } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { type Issue, type Category } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface IssueTableProps {
  issues: Issue[];
  onIssueClick?: (issueId: number) => void;
}

const IssueTable = ({ issues, onIssueClick }: IssueTableProps) => {
  const { toast } = useToast();
  const [votingIssueId, setVotingIssueId] = useState<number | null>(null);
  
  // Fetch all categories to display issue category names
  const { data: categories } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const getCategoryName = (categoryId: number) => {
    if (!categories) return 'Loading...';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const handleVote = async (issueId: number) => {
    if (votingIssueId !== null) return;
    
    setVotingIssueId(issueId);
    try {
      await apiRequest("POST", "/api/votes", { 
        issueId, 
        userId: DEFAULT_USER_ID 
      });
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['/api/issues'] });
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
      setVotingIssueId(null);
    }
  };
  
  return (
    <div className="overflow-x-auto pb-4">
      <table className="min-w-full bg-[hsl(var(--space-gray)/30)] rounded-xl overflow-hidden border border-[hsl(var(--space-purple)/20)]">
        <thead>
          <tr className="border-b border-[hsl(var(--space-purple)/20)]">
            <th className="py-4 px-6 text-left text-[hsl(var(--foreground)/80)] font-semibold">Issue</th>
            <th className="py-4 px-6 text-left text-[hsl(var(--foreground)/80)] font-semibold hidden md:table-cell">Category</th>
            <th className="py-4 px-6 text-left text-[hsl(var(--foreground)/80)] font-semibold hidden md:table-cell">Submitted by</th>
            <th className="py-4 px-6 text-left text-[hsl(var(--foreground)/80)] font-semibold">Support</th>
            <th className="py-4 px-6 text-left text-[hsl(var(--foreground)/80)] font-semibold hidden md:table-cell">Priority</th>
            <th className="py-4 px-6 text-left text-[hsl(var(--foreground)/80)] font-semibold">Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-12 text-center text-[hsl(var(--foreground)/60)]">
                No issues found. Be the first to submit an issue!
              </td>
            </tr>
          ) : (
            issues.map((issue) => (
              <tr 
                key={issue.id} 
                className="border-b border-[hsl(var(--space-purple)/10)] hover:bg-[hsl(var(--space-purple)/10)] transition-colors"
              >
                <td className="py-4 px-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-[hsl(var(--foreground)/90)]">{issue.title}</h3>
                      {/* Priority badge - visible on mobile */}
                      <span 
                        className={`px-2 py-1 text-xs font-medium rounded-full border inline-flex items-center gap-1 ml-2 md:hidden ${
                          getPriorityColorClass(issue.priority ? issue.priority as any : calculatePriority(issue.votes))
                        }`}
                      >
                        <i className={getPriorityIcon(issue.priority ? issue.priority as any : calculatePriority(issue.votes))}></i>
                        {issue.priority || calculatePriority(issue.votes)}
                      </span>
                    </div>
                    <p className="text-sm text-[hsl(var(--foreground)/60)] line-clamp-1">
                      {issue.description}
                    </p>
                  </div>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <span className="px-2 py-1 text-xs font-mono rounded-full bg-[hsl(var(--space-purple)/20)] text-[hsl(var(--space-pink))] border border-[hsl(var(--space-purple)/30)]">
                    {getCategoryName(issue.categoryId)}
                  </span>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[hsl(var(--space-purple)/30)] flex items-center justify-center">
                      <span className="text-xs">U{issue.userId}</span>
                    </div>
                    <span className="text-sm text-[hsl(var(--foreground)/70)]">Anonymous</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <button 
                    className="flex items-center gap-2"
                    onClick={() => handleVote(issue.id)}
                    disabled={votingIssueId === issue.id}
                  >
                    <i className="ri-heart-fill text-[hsl(var(--space-pink))]"></i>
                    <span>{issue.votes}</span>
                  </button>
                </td>
                {/* Priority column - desktop only */}
                <td className="py-4 px-6 hidden md:table-cell">
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded-full border inline-flex items-center gap-1 ${
                      getPriorityColorClass(issue.priority ? (issue.priority as any) : calculatePriority(issue.votes))
                    }`}
                  >
                    <i className={getPriorityIcon(issue.priority ? (issue.priority as any) : calculatePriority(issue.votes))}></i>
                    {issue.priority || calculatePriority(issue.votes)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {onIssueClick ? (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onIssueClick(issue.id)}
                    >
                      Quick View
                    </Button>
                  ) : (
                    <Link href={`/issues/${issue.id}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default IssueTable;
<div className="flex items-center gap-2">
  {issue.trendingScore > 100 && (
    <span className="text-[hsl(var(--space-pink))]">
      <i className="ri-fire-fill"></i> Trending
    </span>
  )}
  {title}
</div>
