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

  // Simple flag to track first render
  const [firstRender, setFirstRender] = useState(true);
  
  // Simple auto-scroll - only happens in the currently active tab
  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }
    
    // SPECIAL CASE: Don't auto-scroll the debates room when it becomes active
    // This prevents the debates tab from scrolling to bottom when switching to it
    if (room === 'debates') {
      return;
    }
    
    // BASIC RULE: Only scroll when both the following are true:
    // 1. This component is in the active tab
    // 2. We're either coming from inactive state or getting new messages
    if (isActive && messagesEndRef.current) {
      // Use RAF + timeout for reliable DOM updates
      requestAnimationFrame(() => {
        setTimeout(() => {
          // One final check that we're still active
          if (isActive && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: "smooth",
              block: "end" 
            });
          }
        }, 100);
      });
    }
  }, [isActive, room]); // Track room changes too
  
  // Only scroll on new messages in active chat
  const prevMessagesLengthRef = useRef(messages.length);
  useEffect(() => {
    // Skip on first render
    if (firstRender) return;
    
    const prevLength = prevMessagesLengthRef.current;
    const newLength = messages.length;
    
    // IMPORTANT: Special case for debates room - we still want to auto-scroll
    // on new messages (just not on initial activation)
    const shouldAutoScroll = 
      isActive && // Only scroll active tab
      newLength > prevLength && // Only when we have new messages
      prevLength > 0; // Only after the initial load
    
    if (shouldAutoScroll) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (isActive && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ 
              behavior: "smooth",
              block: "end"
            });
          }
        }, 100);
      });
    }
    
    // Update the previous length reference
    prevMessagesLengthRef.current = newLength;
  }, [messages.length, isActive, firstRender, room]);

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
    <div className="flex flex-col h-full border rounded-lg overflow-hidden" style={{ maxHeight: '460px' }}>
      <div className="p-3 border-b bg-[hsl(var(--card))]">
        <h3 className="text-base font-medium">
          {room === 'debates' ? 'Debate Discussion' : 
           room === 'local' ? 'Local Community Chat' : 
           'General Discussion'}
        </h3>
        <p className="text-xs text-muted-foreground">
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
        className="h-[350px] overflow-auto p-3 space-y-3 relative"
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
        className="p-3 border-t flex gap-2"
      >
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!isConnected}
          className="flex-grow h-8"
        />
        <Button 
          type="submit" 
          size="icon" 
          className="h-8 w-8"
          disabled={!isConnected || !message.trim()}
        >
          <Send className="h-3 w-3" />
        </Button>
      </form>
    </div>
  );
};

export default ChatPanel;