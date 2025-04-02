import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { requireAuth } from '@/utils/routeGuards';
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useServerMessages } from '@/queries/messageQueries';
import { MessagesList } from '@/components/messages/MessagesList';
import { MessageInput } from '@/components/messages/MessageInput';
import { useChannelDetails } from '@/queries/channelQueries.ts';

// Types
export const Route = createFileRoute('/chat/servers/$serverId/channels/$channelId')({
  beforeLoad: async ({ params }) => {
    await requireAuth();
    return { serverId: params.serverId, channelId: params.channelId };
  },
  component: ChannelComponent,
});

function ChannelComponent() {
  const { channelId, serverId } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // Fetch channel details
  const {
    data: channel,
    isLoading: isLoadingChannel,
    error: channelError
  } = useChannelDetails(channelId, serverId);

  // Handle channel error
  useEffect(() => {
    if (channelError) {
      toast.error("Channel not found", { 
        description: "This channel doesn't exist or you don't have access to it." 
      });
      navigate({ to: `/chat/servers/${serverId}` });
    }
  }, [channelError, navigate, serverId]);

  // Fetch messages
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useServerMessages(channelId);

  // Handle send message
  const handleSendMessage = async (messageContent: string) => {
    try {
      await axiosInstance.post(`/messages/${channelId}`, {
        content: messageContent,
      });
      
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: ['messages', channelId] });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <>
      {/* Chat content area with messages */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Channel name header */}
        <div className="h-12 border-b border-muted/20 flex items-center px-4">
          <h2 className="font-medium">
            # {channel?.name || "Loading..."}
            {isLoadingChannel && <span className="text-muted"> (Loading...)</span>}
          </h2>
        </div>

        {/* Messages area */}
        <MessagesList 
          messages={messages}
          isLoading={isLoadingMessages}
          error={messagesError as Error | null}
        />

        {/* Message input */}
        <MessageInput 
          onSendMessage={handleSendMessage} 
          disabled={isLoadingMessages} 
        />
      </div>
    </>
  );
}