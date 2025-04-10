import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import { toast } from 'sonner';
import {AxiosError} from "axios";

interface CreateChannelRequest {
    serverId: string;
    name: string;
    description?: string;
}

// Create channel mutation
export function useCreateChannel() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateChannelRequest) => {
            const response = await axiosInstance.post(`/servers/${data.serverId}/channels`, data);
            return response.data;
        },
        onSuccess: (_data, variables) => {
            // Invalidate and refetch channels list
            queryClient?.invalidateQueries({ queryKey: ['serverChannels', variables.serverId] });

            // Show success notification
            toast.success("Channel created", {
                description: `Channel has been created successfully.`,
                duration: 5000,
            });
        },
        onError: (error: AxiosError) => {
            const message = (error.response?.data as { message?: string })?.message ||
                "There was an error creating the channel.";

            toast.error("Failed to create channel", {
                description: message,
                duration: 5000,
            });
        },
    });
}