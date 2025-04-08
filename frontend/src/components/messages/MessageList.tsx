import { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useGetMessagesForChannel } from '@/queries/messageQueries';
import { Loader2 } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  created_at: string;
  avatar_url: string;
  sender_id: string;
  username: string;
}

interface MessagesListProps {
  channelId: string;
}

export function MessagesList({ channelId }: MessagesListProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useGetMessagesForChannel(channelId);

  // Flatten and sort messages
  const messages: Message[] = data?.pages.flatMap(page => page.messages) || [];
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const { ref: sentinelRef, inView } = useInView();
  const containerRef = useRef<HTMLDivElement>(null);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    // Only trigger if user is at the top (or near top)
    if (
      inView &&
      container &&
      container.scrollTop <= 10 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      const previousHeight = container.scrollHeight;
      fetchNextPage().then(() => {
        if (container) {
          const newHeight = container.scrollHeight;
          container.scrollTop = newHeight - previousHeight + container.scrollTop;
        }
      });
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (!isLoading && containerRef.current && !initialScrollDone.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      initialScrollDone.current = true;
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading messages…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <div className="rounded-md bg-destructive/15 p-4 text-destructive">
          <p>Error loading messages</p>
          <button 
            className="mt-2 text-sm underline"
            onClick={() => window.location.reload()}>
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-auto p-2 sm:p-4 flex flex-col gap-4">
      {/* Sentinel element for fetching older messages */}
      <div ref={sentinelRef} className="h-1 w-full flex items-center justify-center">
        <Loader2 className="animate-spin h-5 w-5 text-button" />
      </div>

      {/* Render messages */}
      {sortedMessages.map(message => (
        <div key={message.id} className="flex items-start gap-2 mb-4">
          <img
            src={message.avatar_url}
            alt={`${message.username}'s avatar`}
            className="rounded-full mr-2 object-cover w-8 h-8 sm:w-10 sm:h-10"
          />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-xs sm:text-sm">{message.username}</span>
            <span className="text-[0.8rem] sm:text-sm">{message.message}</span>
            <span className="text-gray-500 text-[0.7rem] sm:text-xs">
              {new Date(message.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      ))}

      {isFetchingNextPage && (
        <div className="flex items-center justify-center p-2">
          <Loader2 className="animate-spin h-5 w-5" />
        </div>
      )}
    </div>
  );
}