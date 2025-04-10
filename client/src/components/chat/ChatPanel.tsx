import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowDown } from "lucide-react";
import { useChat } from "@/hooks/use-chat-new";
import { DEFAULT_USER_ID } from "@/lib/utils";
import ChatMessage from "./ChatMessage";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ChatPanelProps {
  username?: string;
  room?: string;
  location?: string;
  isActive?: boolean;  // New prop to indicate if this chat panel is active
}

const ChatPanel = ({ 
  username = "Anonymous", 
  room, 
  location,
  isActive = false 
}: ChatPanelProps) => {
  const [message, setMessage] = useState("");
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
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

  // Auto-scroll to bottom when new messages arrive, but only if the chat panel is active
  useEffect(() => {
    // Only scroll if this chat panel is active in the tabs
    if (isActive && messages.length > 0) {
      // Use a small timeout to ensure DOM has updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isActive]);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Check if user has scrolled up to show the scroll-to-bottom button
  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    
    const handleScroll = () => {
      // Show button if scrolled up more than 200px from bottom
      const scrolledUp = container.scrollHeight - container.clientHeight - container.scrollTop > 200;
      setShowScrollButton(scrolledUp);
    };
    
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (sendMessage(message)) {
      setMessage("");
      // Scroll to bottom when sending a message
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-4 border-b bg-[hsl(var(--card))]">
        <h3 className="text-lg font-medium">
          {room === 'debates' ? 'Debate Discussion' : 
           room === 'local' ? 'Local Community Chat' : 
           'General Discussion'}
        </h3>
        <p className="text-sm text-muted-foreground">
          {isConnected ? 
            `Connected as ${username}${location ? ` • Location: ${location}` : ''}` : 
            isConnecting ? 'Connecting...' : 'Disconnected'
          }
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="m-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-auto p-4 space-y-4 relative"
      >
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
        
        {/* Scroll to bottom button */}
        {showScrollButton && (
          <Button
            className="absolute bottom-4 right-4 rounded-full z-10 opacity-80 hover:opacity-100 transition-opacity shadow-md"
            size="icon"
            variant="secondary"
            onClick={scrollToBottom}
          >
            <ArrowDown className="h-4 w-4" />
          </Button>
        )}
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