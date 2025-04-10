import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { useChat } from "@/hooks/use-chat";
import { DEFAULT_USER_ID } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatPanelProps {
  username?: string;
  room?: string;
  location?: string;
}

const ChatPanel = ({ username = "Anonymous", room, location }: ChatPanelProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    messages, 
    isConnected, 
    isConnecting, 
    error, 
    connect, 
    sendMessage 
  } = useChat(username, room);

  // Auto-connect when component mounts
  useEffect(() => {
    connect();
  }, [connect]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendMessage(message)) {
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-[hsl(var(--card))]">
        <h3 className="text-lg font-medium">
          {room ? `${room.charAt(0).toUpperCase() + room.slice(1)} Chat` : 'General Chat'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isConnected ? 'Connected as ' + username : 'Connecting...'}
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex-grow overflow-auto p-4 space-y-4">
        {messages.length === 0 && !isConnecting && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              No messages yet. Be the first to say something!
            </p>
          </div>
        )}

        {isConnecting && (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="ml-2 text-muted-foreground text-sm">Connecting...</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg}
            isCurrentUser={msg.username === username}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSendMessage} 
        className="p-4 border-t flex gap-2"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-grow"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={!isConnected || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;