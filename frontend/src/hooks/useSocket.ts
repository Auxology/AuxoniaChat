import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { 
  getSocket, 
  initializeSocket, 
  getOnlineUsers, 
  isUserOnline 
} from "@/utils/socket";

export const useSocket = () => {
    const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(new Map());
    const queryClient = useQueryClient();

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

        // Use the singleton socket instance
        initializeSocket(userData.id, queryClient);
        
        // Set initial online users
        setOnlineUsers(new Map(getOnlineUsers()));
        
        // Update online users periodically
        const interval = setInterval(() => {
            setOnlineUsers(new Map(getOnlineUsers()));
        }, 2000);
        
        return () => {
            clearInterval(interval);
            // Note: We don't disconnect here - socket is managed by the service
        };
    }, [userData, queryClient]);

    return {
        socket: getSocket(),
        onlineUsers,
        isOnline: (userId: string) => isUserOnline(userId)
    };
};