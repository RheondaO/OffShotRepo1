import { useState } from "react";
import { Comment as CommentType } from "@shared/schema";
import { useComments } from "@/hooks/use-comments";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Edit, Trash2, Reply, Save, X, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import NewCommentForm from "./NewCommentForm";

interface CommentItemProps {
  comment: CommentType;
  issueId: number;
}

export default function CommentItem({ comment, issueId }: CommentItemProps) {
  const { user } = useAuth();
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

  const formatDate = (date: Date) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch (error) {
      return "recently";
    }
  };

  const isOwner = user && user.id === comment.userId;

  return (
    <Card className="p-4">
      <div className="flex space-x-4">
        <Avatar>
          <AvatarFallback>
            {getInitials(comment.userId.toString())}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-semibold">User #{comment.userId}</div>
            <div className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
              {comment.isEdited && " (edited)"}
            </div>
          </div>
          
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[100px]"
              />
              <div className="flex space-x-2 mt-2 justify-end">
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
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Saving...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Save className="h-4 w-4 mr-1" /> Save
                    </div>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-wrap">{comment.content}</p>
          )}

          <div className="flex items-center space-x-4 mt-3">
            {user && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
              >
                <Reply className="h-4 w-4 mr-1" />
                Reply
              </Button>
            )}
            
            {isOwner && !isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  disabled={deleteCommentMutation.isPending}
                >
                  {deleteCommentMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-1" />
                  )}
                  Delete
                </Button>
              </>
            )}
            
            {replies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplies(!showReplies)}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                {showReplies ? "Hide" : "Show"} Replies ({replies.length})
              </Button>
            )}
          </div>

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

          {showReplies && replies.length > 0 && (
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-muted">
              {replies.map((reply) => (
                <div key={reply.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {getInitials(reply.userId.toString())}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">
                        User #{reply.userId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(reply.createdAt)}
                        {reply.isEdited && " (edited)"}
                      </div>
                    </div>
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {reply.content}
                    </p>
                    {user && user.id === reply.userId && (
                      <div className="flex items-center space-x-2 mt-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            // We could implement editing replies in a more complex version
                            // For now, we'll just use the same delete functionality
                            if (window.confirm("Are you sure you want to delete this reply?")) {
                              deleteCommentMutation.mutate({
                                commentId: reply.id,
                                userId: user.id,
                              });
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}