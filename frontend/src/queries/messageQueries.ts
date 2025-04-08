// This function is infinity querying the database
import {axiosInstance} from "@/lib/axios.ts";
import { useInfiniteQuery } from "@tanstack/react-query";

// Approach taken directly from the react-query documentation
export const getMessagesForChannel = async (channelId: string, { pageParam }: { pageParam: string | null }) => {
    const response = await axiosInstance.get(`/messages/channel/${channelId}`, {
      params: pageParam ? { cursor: pageParam } : {}
    });
    console.log(response.data);
    return response.data;
  }

  export function useGetMessagesForChannel(channelId: string) {
    return useInfiniteQuery({
        queryKey: ['messages', channelId],
        queryFn: ({ pageParam }) => getMessagesForChannel(channelId, { pageParam }),
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            return lastPage.nextCursor;
        },
        refetchOnWindowFocus: false,
    })
}