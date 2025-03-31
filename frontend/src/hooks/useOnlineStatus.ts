import { useState, useEffect } from "react";
import { getOnlineUsers, isUserOnline } from "@/utils/socket";

export const useOnlineStatus = () => {
    const [onlineUsers, setOnlineUsers] = useState<Map<string, boolean>>(new Map());
    
    useEffect(() => {
        // Set initial online users
        setOnlineUsers(new Map(getOnlineUsers()));
        
        // Update online users periodically
        const interval = setInterval(() => {
            setOnlineUsers(new Map(getOnlineUsers()));
        }, 2000);
        
        return () => {
            clearInterval(interval);
        };
    }, []);

    return {
        onlineUsers,
        isOnline: (userId: string) => isUserOnline(userId)
    };
};