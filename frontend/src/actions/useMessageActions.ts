import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query";
import {axiosInstance} from "@/lib/axios.ts";
import {AxiosError} from "axios";

export function useSendMessageInChannel() {
    const queryClient: QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ serverId, channelId, message }: {serverId: string; channelId: string; message: string }) => {
            const response = await axiosInstance.post(`/messages/${serverId}/${channelId}`, {
                message: message
            });
            return { ...response.data, serverId, channelId };
        },
        onSuccess: (data) => {
            // Invalidate messages for the channel
            queryClient.invalidateQueries({ queryKey: ["messages", data.channelId] });
        },
        onError: (error: AxiosError) => {
            console.error("Error sending message:", error);
            throw error; // Re-throw to be caught by the component
        }
    });
}