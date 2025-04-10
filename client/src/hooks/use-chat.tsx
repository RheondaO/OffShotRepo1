import { useState, useEffect, useCallback, useRef } from "react";

export type ChatMessage = {
  type: 'message' | 'system';
  content: string;
  timestamp: string;
  username: string;
  timezone?: string;
};

export function useChat(username: string = 'Anonymous') {
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
      
      // Create WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      
      // Handle potential Replit deployment scenarios
      // If we're in a Replit environment, ensure we're connecting to the same domain
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      console.log('Attempting to connect to WebSocket at:', wsUrl);
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      // Connection opened
      socket.addEventListener('open', () => {
        console.log('Connected to chat server');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Send join message
        socket.send(JSON.stringify({
          type: 'join',
          username
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
      
      // Connection closed
      socket.addEventListener('close', () => {
        console.log('Disconnected from chat server');
        setIsConnected(false);
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
  }, [username]);
  
  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
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
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }));
      return true;
    }
    return false;
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);
  
  return {
    messages,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage
  };
}