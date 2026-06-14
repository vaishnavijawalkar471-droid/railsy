// Socket.IO client for real-time communication with Flask-SocketIO backend
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;
const listeners: Map<string, Set<(data: any) => void>> = new Map();

function getSocketUrl(): string {
  if (typeof window !== "undefined") {
    // @ts-ignore
    return window.__NEXT_DATA__?.props?.env?.NEXT_PUBLIC_SOCKET_URL ||
      (typeof process !== "undefined" ? (process.env as any).NEXT_PUBLIC_SOCKET_URL : undefined) ||
      "http://localhost:5001";
  }
  return "http://localhost:5001";
}

export function connectSocket(): Socket {
  if (socket?.connected) return socket;

  const url = getSocketUrl();

  socket = io(url, {
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 3000,
    reconnectionAttempts: Infinity,
  });

  socket.on("connect", () => {
    console.log("Railsy Socket.IO connected:", socket?.id);
  });

  socket.on("update", (data: any) => {
    // Dispatch to specific event listeners
    const eventListeners = listeners.get("update");
    if (eventListeners) {
      eventListeners.forEach((cb) => cb(data));
    }
    // Also emit to general listeners
    const generalListeners = listeners.get("*");
    if (generalListeners) {
      generalListeners.forEach((cb) => cb(data));
    }
  });

  socket.on("connected", (data: any) => {
    console.log("Railsy WS handshake:", data);
  });

  socket.on("disconnect", (reason) => {
    console.log("Railsy Socket.IO disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("Railsy Socket.IO connection error:", err.message);
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function onSocketEvent(
  event: string,
  callback: (data: any) => void
): () => void {
  if (!listeners.has(event)) {
    listeners.set(event, new Set());
  }
  listeners.get(event)!.add(callback);

  // Return unsubscribe function
  return () => {
    const eventListeners = listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  };
}