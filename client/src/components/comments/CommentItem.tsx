import { useState } from "react";
import { Comment as CommentType } from "@shared/schema";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XpButton } from "@/components/ui/xp-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Edit, Trash2, Reply, Save, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import NewCommentForm from "./NewCommentForm";
import useXp from "@/hooks/use-xp";

interface CommentItemProps {
  comment: CommentType;
  issueId: number;
}

export default function CommentItem({ comment, issueId }: CommentItemProps) {
  const { user } = useAuth();
  const { rewards } = useXp();
  const {
    useCommentReplies,
    addReplyMutation,
    editCommentMutation,
    deleteCommentMutation,
  } = useComments(issueId);
  
  const {
    data: replies = [],
    isLoading: isLoadingReplies,
  } = useCommentReplies(comment.id);

  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [showReplies, setShowReplies] = useState(false);

  const handleReply = async () => {
    if (!user || !replyText.trim()) return;

    await addReplyMutation.mutate({
      commentId: comment.id,
      reply: {
        userId: user.id,
        content: replyText,
      },
    });

    setReplyText("");
    setIsReplying(false);
    setShowReplies(true);
  };

  const handleEdit = async () => {
    if (!user || !editText.trim()) return;

    await editCommentMutation.mutate({
      commentId: comment.id,
      content: editText,
      userId: user.id,
    });

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!user) return;

    if (window.confirm("Are you sure you want to delete this comment?")) {
      await deleteCommentMutation.mutate({
        commentId: comment.id,
        userId: user.id,
      });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Since we don't have direct access to the user information in the comment object,
  // we need to use userId instead. In a real app, we would fetch user info
  const username = `User ${comment.userId}`;
  
  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{getInitials(username)}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between">
            <div>
              <span className="font-semibold">{username}</span>
              <span className="text-muted-foreground text-xs ml-2">
                {comment.createdAt
                  ? formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })
                  : "Recently"}
                {comment.isEdited && " (edited)"}
              </span>
            </div>

            {user?.id === comment.userId && (
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none min-h-[100px]"
              />
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.content);
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleEdit}
                  disabled={editCommentMutation.isPending}
                >
                  {editCommentMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" /> Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-2 whitespace-pre-wrap">{comment.content}</div>
          )}

          {!isEditing && !comment.parentId && (
            <div className="mt-4 flex gap-2">
              <XpButton
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
                xpAmount={rewards.COMMENT}
              >
                <Reply className="h-4 w-4 mr-1" /> Reply
              </XpButton>
              
              {replies.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  <MessageSquare className="h-4 w-4 mr-1" />{" "}
                  {showReplies ? "Hide Replies" : `Show Replies (${replies.length})`}
                </Button>
              )}
            </div>
          )}

          {isReplying && (
            <div className="mt-4">
              <NewCommentForm
                value={replyText}
                onChange={setReplyText}
                onSubmit={handleReply}
                isSubmitting={addReplyMutation.isPending}
                placeholder="Write a reply..."
                submitLabel="Reply"
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {showReplies && (
            <div className="mt-4 pl-6 border-l-2 border-border">
              {isLoadingReplies ? (
                <div className="flex justify-center my-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : replies.length > 0 ? (
                <div className="space-y-4">
                  {replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} issueId={issueId} />
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-2">
                  No replies yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}