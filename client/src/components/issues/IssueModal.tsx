import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { MessageSquare, Heart, MapPin, Calendar, Clock, Tag, User, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatRelativeTime, getPriorityColorClass, calculatePriority } from "@/lib/utils";
import { type Issue, type Category, type IssueStatus } from "@shared/schema";

interface IssueModalProps {
  issueId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const IssueModal = ({ issueId, isOpen, onClose }: IssueModalProps) => {
  // Fetch the issue details
  const { data: issue, isLoading: isLoadingIssue } = useQuery<Issue>({
    queryKey: [`/api/issues/${issueId}`],
    enabled: !!issueId && isOpen,
  });

  // Fetch the category for this issue
  const { data: category, isLoading: isLoadingCategory } = useQuery<Category>({
    queryKey: [`/api/categories/${issue?.categoryId}`],
    enabled: !!issue,
  });

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Format the status label
  const getStatusLabel = (status?: IssueStatus) => {
    switch (status) {
      case "open":
        return "Open";
      case "assigned":
        return "Assigned";
      case "in_progress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  // Get status color
  const getStatusColor = (status?: IssueStatus) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "assigned":
        return "bg-purple-100 text-purple-700 border-purple-300";
      case "in_progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "resolved":
        return "bg-green-100 text-green-700 border-green-300";
      case "closed":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const isLoading = isLoadingIssue || isLoadingCategory;
  const priority = issue ? calculatePriority(issue.votes) : null;
  const priorityClass = getPriorityColorClass(priority);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2">Loading issue details...</span>
          </div>
        ) : issue ? (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={getStatusColor(issue.status as IssueStatus)}>
                  {getStatusLabel(issue.status as IssueStatus)}
                </Badge>
                {category && (
                  <Badge variant="outline" className="bg-[hsl(var(--space-purple)/10)]">
                    <i className={`mr-1 ${category.icon}`}></i>
                    {category.name}
                  </Badge>
                )}
                <Badge variant="outline" className={priorityClass}>
                  Priority: {priority}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-bold">{issue.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Created {formatDate(issue.createdAt)}</span>
                <Clock className="h-4 w-4 ml-2" />
                <span>{formatRelativeTime(issue.createdAt)}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <div className="text-sm text-muted-foreground whitespace-pre-line p-4 bg-muted/30 rounded-md">
                  {issue.description}
                </div>
              </div>

              {/* Location */}
              {issue.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold">Location</h3>
                    <p className="text-sm text-muted-foreground">{issue.location}</p>
                  </div>
                </div>
              )}

              {/* Submitted by */}
              <div className="flex items-start gap-2">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold">Submitted by</h3>
                  <p className="text-sm text-muted-foreground">User #{issue.userId}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-2 border-t">
                <div className="flex items-center gap-1">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="text-sm font-medium">{issue.votes} votes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-sm font-medium">{issue.comments} comments</span>
                </div>
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Link href={`/issues/${issue.id}`} onClick={onClose}>
                <Button>
                  View Full Details
                </Button>
              </Link>
            </DialogFooter>
          </>
        ) : (
          <div className="text-center p-6">
            <p>Issue not found</p>
            <Button className="mt-4" onClick={onClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IssueModal;