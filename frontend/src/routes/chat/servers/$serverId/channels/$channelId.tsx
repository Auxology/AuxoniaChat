import { useEffect, useRef } from "react";
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from "sonner";
import InfiniteScroll from 'react-infinite-scroll-component';
import { MessageInput } from '@/components/messages/MessageInput';
import { MessageItem } from '@/components/messages/MessageItem'; // Import MessageItem
import { useChannelDetails } from '@/queries/channelQueries';
import { useGetMessagesForChannel } from '@/queries/messageQueries'; // Import the infinite messages hook
import { useAuthCheck } from "@/queries/useAuthQuery";
import { requireAuth } from "@/utils/routeGuards";
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
  const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for potential auto-scrolling

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
    isFetchingNextPage,
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
      // Decide if you want to navigate away or just show an error
    }
  }, [messagesError]);

  // Combine loading states
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
          className="flex-1 overflow-y-auto flex flex-col-reverse p-2" // flex-col-reverse to keep scroll at bottom
        >
          {/* Infinite Scroll Component */}
          <InfiniteScroll
            dataLength={messages.length}
            next={fetchNextPage}
            style={{ display: 'flex', flexDirection: 'column-reverse' }} // To put new messages at the bottom initially
            inverse={true} // Crucial for chat interfaces
            hasMore={hasNextPage ?? false}
            loader={<div className="text-center p-2">
              <Loader2 className="animate-spin" />
            </div>}
            scrollableTarget="messageScrollableDiv"
            endMessage={
              <p className="text-center text-sm text-gray-400 p-2">
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {/* Render Messages */}
            {messages.map(  (message) => (
              // Ensure your MessageItem takes a unique key, usually message.id
              <MessageItem key={message.id} message={message} />
            ))}
          </InfiniteScroll>
           {/* Optional: Element to scroll to */}
           <div ref={messagesEndRef} />
        </div>

        {/* Message Input Area */}
        <div className="p-2 border-t border-gray-600">
          <MessageInput
              serverId={serverId}
              channelId={channelId}
              // Consider adding props to disable input while loading/error
          />
        </div>
      </div>
  );
}