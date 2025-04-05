import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from "react";
import { requireAuth } from '@/utils/routeGuards';
import { toast } from "sonner";
import {useChannelMessages} from '@/queries/messageQueries';
import { MessagesList } from '@/components/messages/MessagesList';
import { MessageInput } from '@/components/messages/MessageInput';
import { useChannelDetails } from '@/queries/channelQueries.ts';
import { useAuthCheck } from "@/queries/useAuthQuery.ts";

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

  // Fetch channel details
  const {
    data: channel,
    isLoading: isLoadingChannel,
    error: channelError
  } = useChannelDetails(channelId, serverId);

  // Fetch user details
  const {
    isLoading: isLoadingUserDetails,
    error: userError
  } = useAuthCheck();

  // Handle channel error
  useEffect(() => {
    if (channelError) {
      toast.error("Channel not found", {
        description: "This channel doesn't exist or you don't have access to it."
      });
      navigate({ to: `/chat/servers/${serverId}` });
    }
  }, [channelError, navigate, serverId]);

  // Handle user auth error
  useEffect(() => {
    if (userError) {
      toast.error("Authentication error", {
        description: "Please login again to continue."
      });
      navigate({ to: "/login" });
    }
  }, [userError, navigate]);

  // Fetch messages
  const {
    data: messages,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useChannelMessages(channelId);

  // Handle loading
  if (isLoadingChannel || isLoadingMessages || isLoadingUserDetails) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  return (
      <>
      
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="h-12 border-b border-muted/20 flex items-center px-4">
            <h2 className="font-medium">
              # {channel?.name || "Loading..."}
              {isLoadingChannel && <span className="text-muted"> (Loading...)</span>}
            </h2>
          </div>

          <MessagesList
              messages={messages}
              isLoading={isLoadingMessages}
              error={messagesError as Error | null}
          />

          <MessageInput
              serverId={serverId}
              channelId={channelId}
          />
        </div>
      </>
  );
}