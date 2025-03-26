import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

export const useSocket = () => {
    const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(new Map());
    const queryClient = useQueryClient();

    const addOnlineUser = (userId: string) => {
        setOnlineUsers(prev => {
            const newMap = new Map(prev);
            newMap.set(userId, true);
            return newMap;
        })
    }

    const removeOnlineUser = (userId: string) => {
        setOnlineUsers(prev => {
            const newMap = new Map(prev);
            newMap.delete(userId);
            return newMap;
        })
    }

    const { data: userData } = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await axiosInstance.get('/user/profile');
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    useEffect(() => {
        if (!userData) return;

        // Instantiate a new socket connection
        const socketInstance = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
            withCredentials: true,
            auth: { userId: userData.id },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketInstance.on('connect', () => {
            console.log('Connected to socket server');
            addOnlineUser(userData.id);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        // Single user came online
        socketInstance.on('user:online', (userId: string) => {
            addOnlineUser(userId);
        });

        socketInstance.on('user:offline', (userId: string) => {
            removeOnlineUser(userId);
        });

        // Initial list of online users (array format)
        socketInstance.on('users:online', (userIds: string[]) => {
            userIds.forEach(id => addOnlineUser(id)); // ADD users, not remove!
        });

        // Server join request
        socketInstance.on('server:joinRequest', (data) => {{
            // Invalidate the server query to refetch the server list
            queryClient.invalidateQueries({ queryKey: ["incomingJoinRequests"] });

            // Show a toast notification
            toast.info("New join request", {
            description: `${data.username} requested to join ${data.serverName}`,
            });
        }});

        // Requests Approval
        socketInstance.on('server:joinApproved', (data) => {{
            queryClient.invalidateQueries({ queryKey: ["sentJoinRequests"] });
            queryClient.invalidateQueries({ queryKey: ["userServers"] });
            // For admins, invalidate the server query to refetch the server list
            queryClient.invalidateQueries({ queryKey: ["incomingJoinRequests"] });

            // Join the server room
            socketInstance.emit('join:serverRoom', data.serverId);

            toast.success("Join request approved", {
                description: `You have been approved to join ${data.serverName}`,
            });
        }});

        // Rejection of requests
        socketInstance.on('server:joinRequestRejected', (data) => {
            queryClient.invalidateQueries({ queryKey: ["sentJoinRequests"] });
            // For admins, invalidate the server query to refetch the server list
            queryClient.invalidateQueries({ queryKey: ["incomingJoinRequests"] });
            
            toast.error("Join request rejected", {
                description: `Your request to join ${data.serverName} was rejected.`,
            });
        });
    
        return () => {
            socketInstance.disconnect();
        };
    }, [userData]);

    return {
        onlineUsers,
        isOnline: (userId: string) => onlineUsers.has(userId)
    }
}