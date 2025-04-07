import { useEffect } from "react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from "sonner";
import { MessageInput } from '@/components/messages/MessageInput';
import { useChannelDetails } from '@/queries/channelQueries';
import { useAuthCheck } from "@/queries/useAuthQuery";
import { requireAuth } from "@/utils/routeGuards";
import { useGetMessagesForChannel } from "@/queries/messageQueries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageList } from "@/components/messages/MessageList";

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
    data: channel,
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

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage
  } = useGetMessagesForChannel(channelId);


  if (isLoadingChannel || isFetching || isLoadingUserDetails || isFetchingNextPage) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="loader">Loading...</div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Error loading messages</div>
        </div>
    );
  }

  const allMessages = data?.pages.flatMap((page) => page.messages).reverse() || [];

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-12 border-b border-muted/20 flex items-center px-4">
          <h2 className="font-medium">
            # {channel?.name || "Loading..."}
            {isLoadingChannel && <span className="text-muted"> (Loading...)</span>}
          </h2>
        </div>
          <MessageList
              messages={allMessages}
              isLoading={isLoadingChannel || isFetching || isLoadingUserDetails}
              hasNextPage={!!hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              fetchNextPage={fetchNextPage}
            />
        <MessageInput
              serverId={serverId}
              channelId={channelId}
          />
      </div>
  );
}
