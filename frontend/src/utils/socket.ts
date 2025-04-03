import { io, Socket } from 'socket.io-client';
import { QueryClient } from '@tanstack/react-query';
import { toast } from "sonner";

// Singleton socket instance
let socket: Socket | null = null;
let queryClient: QueryClient | null = null;
const onlineUsers = new Map<string, boolean>();

export const initializeSocket = (userId: string, queryClientInstance: QueryClient) => {
  if (socket && socket.connected) return socket;
  
  queryClient = queryClientInstance;
  
  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
    withCredentials: true,
    auth: { userId },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });
  
  setupSocketListeners(userId);
  return socket;
};

const setupSocketListeners = (userId: string) => {
  if (!socket) return;

  socket.on('connect', () => {
    addOnlineUser(userId);
  });

  socket.on('disconnect', () => {
    removeOnlineUser(userId);});

  socket.on('user:online', (userId: string) => {
    addOnlineUser(userId);
  });

  socket.on('user:offline', (userId: string) => {
    removeOnlineUser(userId);
  });

  socket.on('users:online', (userIds: string[]) => {
    userIds.forEach(id => addOnlineUser(id));
  });

  socket.on('server:joinRequest', (data) => {
    queryClient?.invalidateQueries({ queryKey: ["incomingJoinRequests"] });
    
    toast.info("New join request", {
      description: `${data.username} requested to join ${data.serverName}`,
    });
  });

  socket.on('server:joinApproved', (data) => {
    queryClient?.invalidateQueries({ queryKey: ["sentJoinRequests"] });
    queryClient?.invalidateQueries({ queryKey: ["userServers"] });
    queryClient?.invalidateQueries({ queryKey: ["incomingJoinRequests"] });

    socket?.emit('join:serverRoom', data.serverId);
    
    toast.success("Join request approved", {
      description: `You have been approved to join ${data.serverName}`,
    });
  });

  socket.on('server:joinRequestRejected', (data) => {
    queryClient?.invalidateQueries({ queryKey: ["sentJoinRequests"] });
    queryClient?.invalidateQueries({ queryKey: ["incomingJoinRequests"] });
    
    toast.error("Join request rejected", {
      description: `Your request to join ${data.serverName} was rejected.`,
    });
  });

  socket.on('server:nameUpdated', () => {
    queryClient?.invalidateQueries({ queryKey: ["userServers"] });
    queryClient?.invalidateQueries({ queryKey: ["server"] });

  });

  socket.on('server:iconUpdated', () => {
    queryClient?.invalidateQueries({ queryKey: ["userServers"] });
    queryClient?.invalidateQueries({ queryKey: ["server"] });
  });

    socket.on('server:deleted', () => {
        queryClient?.invalidateQueries({ queryKey: ["userServers"] });
        queryClient?.invalidateQueries({ queryKey: ["server"] });
    });
}

const addOnlineUser = (userId: string) => {
  if (!userId) return;
  onlineUsers.set(userId, true);
};

const removeOnlineUser = (userId: string) => {
  onlineUsers.delete(userId);
};

export const getSocket = () => socket;
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
export const isUserOnline = (userId: string) => onlineUsers.has(userId);
export const getOnlineUsers = () => onlineUsers;