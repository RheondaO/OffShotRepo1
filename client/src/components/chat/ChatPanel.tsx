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
  // Log visibility state for debugging
  useEffect(() => {
    console.log(`[${room || 'general'}] Chat panel isActive:`, isActive);
  }, [isActive, room]);
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

  // PREVENT auto-scrolling EXCEPT when this is the ACTIVE tab
  // Auto-scroll only when the tab becomes active
  const wasActiveRef = useRef(isActive);
  
  useEffect(() => {
    // Only scroll if we're becoming active (changed from inactive to active)
    if (isActive && !wasActiveRef.current) {
      console.log(`[${room || 'general'}] Tab just became active, scrolling to bottom`);
      setTimeout(() => {
        if (messagesEndRef.current && isActive) { // double-check isActive
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 150); // longer delay to ensure DOM is fully updated
    }
    
    // Update ref for next check
    wasActiveRef.current = isActive;
  }, [isActive, room]);
  
  // Only handle new messages when they arrive
  const prevMessagesLengthRef = useRef(messages.length);
  useEffect(() => {
    const prevLength = prevMessagesLengthRef.current;
    const newLength = messages.length;
    
    // Only scroll if BOTH:
    // 1. We have new messages (not just initial loading)
    // 2. This tab is CURRENTLY active
    if (newLength > prevLength && prevLength > 0 && isActive) {
      console.log(`[${room || 'general'}] New message in active tab, scrolling to bottom`);
      setTimeout(() => {
        if (messagesEndRef.current && isActive) { // double-check isActive
          messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
    
    // Update the previous length
    prevMessagesLengthRef.current = newLength;
  }, [messages.length, isActive, room]);

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