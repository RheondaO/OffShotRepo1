
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export function FeedbackButton() {
  return (
    <Button 
      variant="outline"
      size="sm"
      className="fixed bottom-4 right-4 z-50"
      onClick={() => window.open('/feedback', '_blank')}
    >
      <MessageSquare className="mr-2 h-4 w-4" />
      Feedback
    </Button>
  );
}
