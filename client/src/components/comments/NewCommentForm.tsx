import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, X } from "lucide-react";

interface NewCommentFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  placeholder?: string;
  submitLabel?: string;
  onCancel?: () => void;
}

export default function NewCommentForm({
  value,
  onChange,
  onSubmit,
  isSubmitting,
  placeholder = "Write your comment...",
  submitLabel = "Comment",
  onCancel
}: NewCommentFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <Card className="p-4">
      <form onSubmit={handleSubmit}>
        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[100px] mb-3"
        />
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          )}
          <Button 
            type="submit" 
            disabled={!value.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" /> {submitLabel}
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}