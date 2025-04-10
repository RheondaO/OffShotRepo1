import { useState, useEffect, useCallback, useRef, useMemo } from "react";

export type ChatMessage = {
  type: 'message' | 'system';
  content: string;
  timestamp: string;
  username: string;
  timezone?: string;
};

export function useChat(username: string = 'Anonymous', room?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  
  // Connect to WebSocket server
  const connect = useCallback(() => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // Close existing connection if any
      if (socketRef.current) {
        socketRef.current.close();
      }
      
      // Determine host and protocol based on environment
      const isSecure = window.location.protocol === "https:";
      const protocol = isSecure ? "wss:" : "ws:";
      
      // In Replit, WebSockets connect to the same domain as the webpage
      const host = window.location.host;
      
      // Create the full WebSocket URL
      const wsUrl = `${protocol}//${host}/ws`;
      console.log('Attempting to connect to WebSocket at:', wsUrl);
      
      // Create the WebSocket with proper error handling
      let socket: WebSocket;
      try {
        socket = new WebSocket(wsUrl);
      } catch (err) {
        console.error('Failed to initialize WebSocket connection:', err);
        throw new Error('Failed to connect to chat server. Please try again later.');
      }
      socketRef.current = socket;
      
      // Connection opened
      socket.addEventListener('open', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Send join message with room information if available
        socket.send(JSON.stringify({
          type: 'join',
          username,
          room // Include room parameter if provided
        }));
      });
      
      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages((prevMessages) => [...prevMessages, message]);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      });
      
      // Connection closed with automatic reconnection
      socket.addEventListener('close', (event) => {
        console.log('Disconnected from chat server', { 
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        setIsConnected(false);
        
        // Only try to reconnect if it wasn't a clean closure or deliberate disconnect
        if (reconnectAttempts < 5 && (!event.wasClean || event.code !== 1000)) {
          console.log(`Attempting to reconnect (attempt ${reconnectAttempts + 1}/5)...`);
          
          // Clear any existing reconnect timeout
          if (reconnectTimeoutRef.current !== null) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          // Exponential backoff for reconnect attempts (1s, 2s, 4s, 8s, 16s)
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 16000);
          
          // Use standard setTimeout (not window.setTimeout) to avoid TypeScript issues
          const timeoutId = setTimeout(() => {
            setReconnectAttempts(prev => prev + 1);
            connect();
          }, delay);
          
          // Store the numeric timeoutId for cleanup
          reconnectTimeoutRef.current = timeoutId as unknown as number;
        } else if (reconnectAttempts >= 5) {
          setError('Unable to establish a stable connection after multiple attempts. Please refresh the page to try again.');
        }
      });
      
      // Error handling with improved logging and feedback
      socket.addEventListener('error', (event) => {
        console.error('WebSocket error:', event);
        
        // Provide more specific error message based on connection state
        if (socket.readyState === WebSocket.CONNECTING) {
          setError('Unable to establish connection to chat server. The server might be unreachable.');
        } else if (socket.readyState === WebSocket.CLOSING || socket.readyState === WebSocket.CLOSED) {
          setError('Connection to chat server was lost. Please refresh the page and try again.');
        } else {
          setError('An error occurred with the chat connection. Please try again later.');
        }
        
        setIsConnected(false);
        setIsConnecting(false);
      });
      
    } catch (err) {
      console.error('Error connecting to chat server:', err);
      setError('Failed to connect to chat server. Please try again later.');
      setIsConnecting(false);
    }
  }, [username, room, reconnectAttempts]);
  
  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
    // Clear any pending reconnection attempts
    if (reconnectTimeoutRef.current !== null) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Reset reconnect counter when explicitly disconnected
    setReconnectAttempts(0);
    
    // Close the WebSocket connection
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
  }, []);
  
  // Send a message
  const sendMessage = useCallback((content: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN && content.trim()) {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        content,
        room, // Include room if present
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }));
      return true;
    }
    return false;
  }, [room]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      // Clear any pending reconnection attempts
      if (reconnectTimeoutRef.current !== null) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      // Close the WebSocket connection
      disconnect();
      
      // Reset the reconnect counter
      setReconnectAttempts(0);
    };
  }, [disconnect]);
  
  // Add connection status for UI display
  const connectionStatus = useMemo(() => {
    if (isConnected) {
      return "connected";
    } else if (isConnecting) {
      return "connecting";
    } else if (reconnectAttempts > 0) {
      return `reconnecting-${reconnectAttempts}`;
    } else {
      return "disconnected";
    }
  }, [isConnected, isConnecting, reconnectAttempts]);

  return {
    messages,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
    connectionStatus,
    reconnectAttempts
  };
}