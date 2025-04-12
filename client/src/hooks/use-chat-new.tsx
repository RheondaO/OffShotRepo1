import { useState, useEffect, useRef, useCallback, useMemo } from "react";

export type ChatMessage = {
  type: 'message' | 'system';
  content: string;
  timestamp: string;
  username: string;
  timezone?: string;
};

// More reliable WebSocket hook with simpler connection logic
export function useChat(username: string = 'Anonymous', room?: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to track connection state across renders
  const socketRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const attemptRef = useRef<number>(0);

  // Create WebSocket URL based on current window location
  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    return `${protocol}//${host}/ws`;
  }, []);

  // Cleanup function to handle disconnection and timeout clearing
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (socketRef.current) {
      // Remove all event listeners to prevent memory leaks
      const socket = socketRef.current;
      socket.onopen = null;
      socket.onclose = null;
      socket.onerror = null;
      socket.onmessage = null;

      // Only close if not already closed
      if (socket.readyState !== WebSocket.CLOSED && socket.readyState !== WebSocket.CLOSING) {
        socket.close();
      }
      socketRef.current = null;
    }

    setIsConnected(false);
  }, []);

  // Connect or reconnect to WebSocket
  const connect = useCallback(() => {
    // Don't attempt reconnection if already connecting
    if (isConnecting) return;

    // Clean up any existing connection first
    cleanup();

    // Reset state
    setIsConnecting(true);
    setError(null);

    try {
      const wsUrl = getWebSocketUrl();
      console.log(`Connecting to WebSocket: ${wsUrl} (attempt ${attemptRef.current + 1})`);

      // Create new WebSocket
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      // Handle connection open
      socket.onopen = () => {
        console.log('WebSocket connected successfully');
        setIsConnected(true);
        setIsConnecting(false);
        attemptRef.current = 0; // Reset attempt counter on successful connection

        // Send join message with username and room
        socket.send(JSON.stringify({
          type: 'join',
          username,
          room
        }));
      };

      // Handle messages
      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      // Handle connection close
      // Add handler for pong response to keep connection alive
      socket.addEventListener('pong', () => {
        console.log('Received pong from server');
      });

      socket.onclose = (event) => {
        console.log(`WebSocket closed: code=${event.code}, reason=${event.reason || 'none'}, clean=${event.wasClean}`);
        setIsConnected(false);
        setIsConnecting(false);

        // Don't attempt reconnection if close was clean (normal closure)
        if (event.wasClean || event.code === 1000) {
          return;
        }

        // Only try to reconnect a limited number of times
        if (attemptRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, attemptRef.current), 16000);
          console.log(`Scheduling reconnect in ${delay}ms (attempt ${attemptRef.current + 1})`);

          // Increment attempt counter
          attemptRef.current++;

          // Schedule reconnection
          timeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          setError('Unable to establish a stable connection after several attempts. Please refresh the page.');
        }
      };

      // Handle errors
      socket.onerror = (event) => {
        console.error('WebSocket error:', event);
        setError('Connection error occurred. The server might be unavailable.');
        setIsConnecting(false);
      };

    } catch (err) {
      console.error('Error creating WebSocket:', err);
      setError('Failed to create WebSocket connection. Please check your network connection.');
      setIsConnecting(false);
    }
  }, [username, room, cleanup, getWebSocketUrl, isConnecting]);

  // Disconnect function
  const disconnect = useCallback(() => {
    console.log('Manually disconnecting WebSocket');
    cleanup();
    attemptRef.current = 0; // Reset attempt counter on manual disconnect
  }, [cleanup]);

  // Send message function
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN || !content.trim()) {
      return false;
    }

    try {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        content,
        room,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }));
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  }, [room]);

  // Connection status for UI display
  const connectionStatus = useMemo(() => {
    if (isConnected) return "connected";
    if (isConnecting) return "connecting";
    if (attemptRef.current > 0) return `reconnecting-${attemptRef.current}`;
    return "disconnected";
  }, [isConnected, isConnecting]);

  // Set up a client-side ping to keep the connection alive
  useEffect(() => {
    if (!isConnected || !socketRef.current) return;

    // Send a "ping" message every 20 seconds to keep the connection alive
    // This helps with proxies/firewalls that might close idle connections
    const keepAliveInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        console.log('Sending keep-alive ping');
        socketRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 20000);

    return () => {
      clearInterval(keepAliveInterval);
    };
  }, [isConnected]);

  // Connect on mount and cleanup on unmount
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      cleanup();
      attemptRef.current = 0;
    };
  }, [connect, cleanup]);

  return {
    messages,
    isConnected,
    isConnecting,
    error,
    connect,
    disconnect,
    sendMessage,
    connectionStatus,
    reconnectAttempts: attemptRef.current
  };
}