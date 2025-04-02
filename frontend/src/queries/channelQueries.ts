import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';


// Types
export interface Channel {
  id: string;
  name: string;
  description?: string;
}

// Get channels for a server
export function useServerChannels(serverId: string) {
  return useQuery({
    queryKey: ['serverChannels', serverId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/servers/${serverId}/channels/get`);
        return response.data as Channel[];
      } catch (error) {
        console.error('Failed to fetch server channels:', error);
        return [];
      }
    },
    enabled: Boolean(serverId),
    staleTime: 1000 * 60, // 1 minute
  });
}



// Fetch channel details
export function useChannelDetails(channelId: string, serverId: string ) {
  return useQuery({
    queryKey: ['channelDetails', channelId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/servers/${serverId}/channels/${channelId}`);
        return response.data as Channel;
      } catch (error) {
        console.error('Failed to fetch channel details:', error);
        throw error; // Rethrow the error to be handled in the component
      }
    },
    enabled: Boolean(channelId),
  });
}