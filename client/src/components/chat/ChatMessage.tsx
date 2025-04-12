import { Badge } from "@/components/ui/badge";
import { ChatMessage as ChatMessageType } from "@/hooks/use-chat";
import { formatDateTime } from "@/lib/utils";

interface ChatMessageProps {
  message: ChatMessageType;
  isCurrentUser: boolean;
}

const ChatMessage = ({ message, isCurrentUser }: ChatMessageProps) => {
  const isSystem = message.type === 'system';
  
  if (isSystem) {
    return (
      <div className="flex justify-center my-1.5">
        <div className="bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted)/40)] rounded-full px-2 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
          {message.content}
        </div>
      </div>
    );
  }
  
  // Don't render empty messages
  if (!message.content || message.content.trim() === '') {
    return null;
  }
  
  return (
    <div className={`flex flex-col mb-2 ${isCurrentUser ? 'items-end' : 'items-start'}`}>
      <div className="flex items-center mb-0.5">
        <span className="text-xs font-medium text-[hsl(var(--foreground)/70)] mr-1.5">
          {isCurrentUser ? 'You' : message.username}
        </span>
        <span className="text-[10px] text-[hsl(var(--foreground)/50)]">
          {new Date(message.timestamp).toLocaleString(undefined, {
            timeZone: message.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      <div 
        className={`max-w-[80%] px-3 py-1.5 text-sm rounded-lg ${
          isCurrentUser 
            ? 'bg-[hsl(var(--primary))] text-white rounded-tr-none' 
            : 'bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted)/70)] rounded-tl-none'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;