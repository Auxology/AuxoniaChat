import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { axiosInstance } from "@/lib/axios";

export const useSocket = () => {
    const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(new Map());

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
            console.log(`User ${userId} is online`);
            addOnlineUser(userId);
        });

        socketInstance.on('user:offline', (userId: string) => {
            console.log(`User ${userId} is offline`);
            removeOnlineUser(userId);
        });

        // Initial list of online users (array format)
        socketInstance.on('users:online', (userIds: string[]) => {
            console.log(`Received list of online users:`, userIds);
            userIds.forEach(id => addOnlineUser(id)); // ADD users, not remove!
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