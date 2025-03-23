import {QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import {AxiosError} from "axios";
import { useNavigate } from "@tanstack/react-router";

// Server types
export interface Server {
    id: string;
    name: string;
    iconUrl: string | null;
}

interface CreateServerRequest {
    name: string;
    iconUrl?: string;
    iconFile?: File;  // Add this for file uploads
}

// Create server mutation
export function useCreateServer() {
    const queryClient:QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateServerRequest) => {
            // If we have a file, use FormData to send it
            if (data.iconFile) {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('server', data.iconFile);
                
                const response = await axiosInstance.post("/servers/create", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } else {
                // No file, just send the name
                const response = await axiosInstance.post("/servers/create", {
                    name: data.name
                });
                return response.data;
            }
        },
        onSuccess: (data):void => {
            // Invalidate and refetch servers list
            queryClient.invalidateQueries({ queryKey: ["userServers"] });

            // Show success notification with Sonner
            toast.success("Server created", {
                description: `${data.name || "Your server"} has been created successfully.`,
                duration: 5000,
            });
        },
        onError: (error:AxiosError):void => {
            const message = (error.response?.data as { message?: string })?.message || "There was an error creating the server.";
            // Show error notification with Sonner
            toast.error("Failed to create server", {
                description: message,
                duration: 5000,
            });
            console.error("Server creation error:", error);
        },
    });
}

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

export function useJoinServer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (serverId: string) => {
            const response = await axiosInstance.post("/servers/join", { serverId });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch servers list
            queryClient.invalidateQueries({ queryKey: ["userServers"] });

            // Show success notification
            toast.success("Joined server", {
                description: "You have successfully joined the server.",
                duration: 5000,
            });
        },
        onError: (error:AxiosError) => {
            const message:string = (error.response?.data as { message?: string })?.message || "There was an error joining the server.";
            
            // Show error notification
            toast.error("Failed to join server", {
                description: message,
                duration: 5000,
            });
        },
    });
}

export function useLeaveServer() {
    const queryClient = useQueryClient();
    const navigate = useNavigate(); // Import this from @tanstack/react-router

    return useMutation({
        mutationFn: async (serverId: string) => {
            const response = await axiosInstance.post("/servers/leave", { serverId });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and refetch servers list
            queryClient.invalidateQueries({ queryKey: ["userServers"] });

            // Navigate away from the server page to the chat home
            navigate({ to: '/chat' });

            // Show success notification
            toast.success("Left server", {
                description: "You have successfully left the server.",
                duration: 5000,
            });
        },
        onError: (error: AxiosError) => {
            const message: string = (error.response?.data as { message?: string })?.message || "There was an error leaving the server.";
            
            // Show error notification
            toast.error("Failed to leave server", {
                description: message,
                duration: 5000,
            });
        },
    });
}

export function useSearchServers(searchTerm: string) {
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