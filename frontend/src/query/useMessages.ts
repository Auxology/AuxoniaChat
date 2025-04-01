import {axiosInstance} from "@/lib/axios.ts";
import {useQuery} from "@tanstack/react-query";

const getMessagesForServer = async (serverId: string) => {
    const response = await axiosInstance.get(`/messages/${serverId}`);
    return response.data;
}

// This function will return the messages for a server
export const useGetMessages = (serverId: string) => {
    return useQuery({
        queryKey: ['messages', serverId],
        queryFn: () => getMessagesForServer(serverId),
    });
}