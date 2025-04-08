import { useEffect } from "react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from "sonner";
import { MessageInput } from '@/components/messages/MessageInput';
import { useChannelDetails } from '@/queries/channelQueries';
import { useAuthCheck } from "@/queries/useAuthQuery";
import { requireAuth } from "@/utils/routeGuards";
import { MessagesList } from "@/components/messages/MessageList";

export const Route = createFileRoute('/chat/servers/$serverId/channels/$channelId')({
  beforeLoad: async ({ params }) => {
    // Require authentication
    await requireAuth();
    return { serverId: params.serverId, channelId: params.channelId };
  },
  component: ChannelComponent,
});

function ChannelComponent() {
  const { channelId, serverId } = Route.useParams();
  const navigate = useNavigate();

  const {
    isLoading: isLoadingChannel,
    error: channelError
  } = useChannelDetails(channelId, serverId);

  const {
    isLoading: isLoadingUserDetails,
    error: userError
  } = useAuthCheck();

  useEffect(() => {
    if (channelError) {
      toast.error("Channel not found", {
        description: "This channel doesn't exist or you don't have access to it."
      });
      navigate({ to: `/chat/servers/${serverId}` });
    }
  }, [channelError, navigate, serverId]);

  useEffect(() => {
    if (userError) {
      toast.error("Authentication error", {
        description: "Please login again to continue."
      });
      navigate({ to: "/login" });
    }
  }, [userError, navigate]);

  if (isLoadingChannel  || isLoadingUserDetails) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="loader">Loading...</div>
        </div>
    );
  }

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
          <MessagesList
              channelId={channelId}
            />
        <MessageInput
              serverId={serverId}
              channelId={channelId}
          />
      </div>
  );
}
