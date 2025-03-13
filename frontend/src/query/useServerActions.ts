import {QueryClient, useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

// Server types
export interface Server {
    id: string;
    name: string;
    iconUrl: string | null;
}

interface CreateServerRequest {
    name: string;
    iconUrl?: string;
}

// Create server mutation
export function useCreateServer() {
    const queryClient:QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateServerRequest) => {
            const response = await axiosInstance.post("/user/servers/create", data);
            return response.data;
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
        onError: (error):void => {
            // Show error notification with Sonner
            toast.error("Failed to create server", {
                description: "There was an error creating your server. Please try again.",
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
                const response = await axiosInstance.get("/user/servers");
                return Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                console.error("Failed to fetch servers:", error);
                return [];
            }
        },
        staleTime: 1000 * 60 * 2, // 2 minutes
    });
}