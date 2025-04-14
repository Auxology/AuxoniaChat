import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from "sonner";
import { MessageInput } from '@/components/messages/MessageInput';
import { MessageItem } from '@/components/messages/MessageItem';
import { useChannelDetails } from '@/queries/channelQueries';
import { useGetMessagesForChannel } from '@/queries/messageQueries';
import { useAuthCheck } from "@/queries/useAuthQuery";
import { requireAuth } from "@/utils/routeGuards";
import InfiniteScrollContainer from "@/components/messages/InfiniteScrollComponent";
import { Loader2 } from "lucide-react";

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
  const bottomRef = useRef<HTMLDivElement>(null);

  const {
    isLoading: isLoadingChannel,
    error: channelError
  } = useChannelDetails(channelId, serverId);

  const {
    isLoading: isLoadingUserDetails,
    error: userError
  } = useAuthCheck();

  // Fetch messages infinitely
  const {
    data: messagesData,
    fetchNextPage,
    hasNextPage,
    isLoading: isLoadingMessages,
    error: messagesError,
  } = useGetMessagesForChannel(channelId);

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

   useEffect(() => {
    if (messagesError) {
      toast.error("Failed to load messages", {
        description: messagesError.message || "Could not fetch messages for this channel."
      });
    }
  }, [messagesError]);

  const isLoading = isLoadingChannel || isLoadingUserDetails || isLoadingMessages;

  if (isLoading && !messagesData) { // Show initial loader only if no messages are loaded yet
    return (
        <div className="flex-1 flex items-center justify-center">
          <div className="loader">Loading Channel...</div>
        </div>
    );
  }

  // Flatten pages into a single messages array
  const messages = messagesData?.pages.flatMap(page => page.messages) ?? [];

  return (
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Message List Area */}
        <div
          id="messageScrollableDiv"
          className="flex-1 overflow-y-auto flex flex-col-reverse p-2 bg-chat"
        >
          {/* Use your InfiniteScrollContainer */}
          <InfiniteScrollContainer
            onTopReached={() => {
              if (hasNextPage && !isLoadingMessages) {
                fetchNextPage();
              }
            }}
            className="flex flex-col-reverse"
          >
            {/* Render Messages */}
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}

            {/* Conditionally render End Message */}
            {!hasNextPage && messages.length > 0 && (
              <p className="text-center text-sm text-gray-400 p-2">
                <b>Yay! You have seen it all</b>
              </p>
            )}

            {/* Conditionally render Loader at the top (visually) */}
            {isLoadingMessages && hasNextPage && (
               <div className="text-center p-2 flex justify-center">
                 <Loader2 className="animate-spin h-5 w-5" />
               </div>
            )}
          </InfiniteScrollContainer>

          {/* Scroll to bottom when new messages are received */}
          {bottomRef.current && (
            <div ref={bottomRef} className="h-1" />
          )}
          
        </div>

        {/* Message Input Area */}
        <div className="p-2 border-t border-gray-600">
          <MessageInput
              serverId={serverId}
              channelId={channelId}
          />
        </div>
      </div>
  );
}