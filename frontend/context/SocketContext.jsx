/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // If socket already exists, don't create a new one
    if (socketRef.current) {
      setSocket(socketRef.current);
      return;
    }

    try {
      const apiUrl = import.meta.env.VITE_API_URL;

      const newSocket = io(apiUrl, {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      newSocket.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      socketRef.current = newSocket;
      setSocket(newSocket);

      return () => {
        // Don't disconnect in development to prevent StrictMode issues
        // eslint-disable-next-line no-undef
        if (process.env.NODE_ENV !== "development") {
          newSocket.disconnect();
        }
      };
    } catch (error) {
      console.error("Error creating socket:", error);
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const socket = useContext(SocketContext);
  return socket;
}
