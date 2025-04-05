import {axiosInstance} from "@/lib/axios.ts";
import {useQuery} from "@tanstack/react-query";

const getMessagesForServer = async (serverId: string) => {
    const response = await axiosInstance.get(`/messages/${serverId}`);
    return response.data;
}

const getMessagesForChannel = async (channelId: string) => {
    const response = await axiosInstance.get(`/messages/channel/${channelId}`);
    return response.data;
}

// This function will return the messages for a server
export const useServerMessages = (serverId: string) => {
    return useQuery({
        queryKey: ['messages', serverId],
        queryFn: () => getMessagesForServer(serverId),
    });
}

// This function will return the messages for a specific channel
export const useChannelMessages = (channelId: string) => {
    return useQuery({
        queryKey: ['messages', channelId],
        queryFn: () => getMessagesForChannel(channelId),
    });
}