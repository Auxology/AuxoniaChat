// This function is infinity querying the database
import {axiosInstance} from "@/lib/axios.ts";
import {useInfiniteQuery} from "@tanstack/react-query";

export const getMessagesForChannel= async(
    channelId:string,
    cursor:string | null = null,
    limit:number = 15
) => {
    const response = await axiosInstance.get('/messages/channel/' + channelId, {
        params: {
            cursor: cursor,
            limit: limit
        }
    })
    return response.data;
}

interface Message {
    id: string;
    channel_id: string;
    user_id: string;
    content: string;
    created_at: string;
}

export const useChannelMessages = (channelId: string) => {
    return useInfiniteQuery<Message[]>({
        queryKey: ['messages', channelId],
        queryFn: (context) => getMessagesForChannel(channelId, context.pageParam as string | null),
        getNextPageParam: (lastPage: Message[]) => {
            if (lastPage.length === 0) return null;
            // Return the created_at of the oldest message as the next cursor
            return lastPage[lastPage.length - 1].created_at;
        },
        initialPageParam: null,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};