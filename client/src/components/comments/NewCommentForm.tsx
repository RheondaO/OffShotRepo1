import { Button } from "@/components/ui/button";
import { XpButton } from "@/components/ui/xp-button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, X } from "lucide-react";
import useXp from "@/hooks/use-xp";

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
  const { rewards } = useXp();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] resize-none"
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={onCancel}
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
        <XpButton 
          type="submit" 
          size="sm" 
          disabled={!value.trim() || isSubmitting}
          xpAmount={rewards.COMMENT}
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
        </XpButton>
      </div>
    </form>
  );
}