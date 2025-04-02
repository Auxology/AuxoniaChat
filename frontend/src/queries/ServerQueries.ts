import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

// Get user servers query
export function useUserServers() {
    return useQuery({
        queryKey: ["userServers"],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get("/servers/get");
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error("Failed to fetch servers:", error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}

// This searches for servers by name
export function useServerSearch(searchTerm: string) {
    return useQuery({
        queryKey: ["searchServers", searchTerm],
        queryFn: async () => {
            try {
                const response = await axiosInstance.get("/servers/search", {
                    params: { q: searchTerm }
                });
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error("Failed to search servers:", error);
                return [];
            }
        },
        enabled: Boolean(searchTerm) && searchTerm.length > 2,
        staleTime: 1000 * 30, // 30 seconds, to keep the data fresh
    });
}

// Get Sent Join Requests query
export function useSentJoinRequests() {
    return useQuery({
      queryKey: ["sentJoinRequests"],
      queryFn: async () => {
        const response = await axiosInstance.get("/servers/requests/sent");
        return response.data;
      }
    });
}

// Get Incoming Join Requests query
export function useIncomingJoinRequests() {
    return useQuery({
      queryKey: ["incomingJoinRequests"],
      queryFn: async () => {
        const response = await axiosInstance.get("/servers/requests/incoming");
        return response.data;
      }
    });
}

export function useServerJoinRequests(serverId: string) {
    return useQuery({
        queryKey: ["serverJoinRequests", serverId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/servers/${serverId}/join-requests`);
            return response.data;
        },
        enabled: Boolean(serverId)
    });
}