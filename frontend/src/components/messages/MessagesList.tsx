import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  message: string;
  created_at: string;
  sender_id?: string;
  username: string;
  avatar_url: string | null;
}

interface MessagesListProps {
  messages: Message[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export function MessagesList({ messages, isLoading, error }: MessagesListProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-button border-t-transparent animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-rose-500 text-center p-4">
            Error loading messages: {error.message}
          </div>
        ) : messages?.length ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="flex gap-3 group">
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage src={message.avatar_url || undefined} alt={message.username} />
                  <AvatarFallback className="bg-button text-headline">
                    {message.username?.charAt(0).toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-pitch-sans-medium text-headline">{message.username}</span>
                    <span className="text-paragraph text-xs">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-paragraph">{message.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-paragraph text-sm text-center">No messages yet.</p>
        )}
      </div>
    </ScrollArea>
  );
}