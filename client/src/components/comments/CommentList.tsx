import { useState } from "react";
import { Comment as CommentType } from "@shared/schema";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import useXp from "@/hooks/use-xp";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CommentItem from "./CommentItem";
import NewCommentForm from "./NewCommentForm";

interface CommentListProps {
  issueId: number;
}

export default function CommentList({ issueId }: CommentListProps) {
  const { user } = useAuth();
  const { rewards, performAction } = useXp();
  const {
    comments,
    isLoadingComments,
    addCommentMutation
  } = useComments(issueId);

  const [newComment, setNewComment] = useState("");

  const handleAddComment = async () => {
    if (!user || !newComment.trim()) return;

    await addCommentMutation.mutate({
      userId: user.id,
      content: newComment,
    });

    // Award XP for adding a comment
    await performAction(3, rewards.COMMENT); // Assuming activity ID 3 is for comments

    // Clear the input field after submission
    setNewComment("");
  };

  if (isLoadingComments) {
    return (
      <div className="flex justify-center my-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Comments ({comments.length})</h3>
      
      {user ? (
        <NewCommentForm
          value={newComment}
          onChange={setNewComment}
          onSubmit={handleAddComment}
          isSubmitting={addCommentMutation.isPending}
        />
      ) : (
        <Card className="p-4 text-center">
          <p className="text-muted-foreground">
            Please sign in to leave a comment.
          </p>
        </Card>
      )}

      {comments.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">
            No comments yet. Be the first to share your thoughts!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment: CommentType) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              issueId={issueId}
            />
          ))}
        </div>
      )}
    </div>
  );
}