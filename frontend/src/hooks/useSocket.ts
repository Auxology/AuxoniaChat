import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';
import { axiosInstance } from "@/lib/axios";



export const useSocket = () => {
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
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from socket server');
        });

        socketInstance.on('users:online', (userId:string) => {
            console.log(`User ${userId} is online`);
        });

        socketInstance.on('users:offline', (userId:string) => {
            console.log(`User ${userId} is offline`);
        });

        socketInstance.on('users:online', (userIds: string[]) => {
            userIds.forEach(id => console.log(`User ${id} is online`));
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [userData]);
}
