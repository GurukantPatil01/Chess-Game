import { useEffect, useState } from "react";

// Use environment variable for WebSocket URL, fallback to localhost for development
const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8081";

export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log("WebSocket connected to:", WS_URL);
      setSocket(ws);
      setIsConnecting(false);
      setError(null);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setSocket(null);
      setIsConnecting(false);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setError("Failed to connect to game server");
      setIsConnecting(false);
    };

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, []);

  return { socket, isConnecting, error };
};