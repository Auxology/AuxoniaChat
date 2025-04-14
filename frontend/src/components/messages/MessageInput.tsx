import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSendMessageInChannel } from "@/actions/useMessageActions";
import { on } from "events";

interface MessageInputProps {
  serverId: string;
  channelId: string;
  onMessageSent?: (message: string) => void;
}

export function MessageInput({ serverId, channelId, onMessageSent }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const sendMessage = useSendMessageInChannel();
  
  const handleSendMessage = async(e: React.FormEvent)  => {
    e.preventDefault();
    try {
      await sendMessage.mutateAsync({
        serverId,
        channelId: channelId as string,
        message: message
      })
    }
    catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again later."
      });
    } finally {
      setIsSending(false);
      setMessage("");
      onMessageSent?.(message);
    }
}
    
  return (
    <div className="p-4">
      <form onSubmit={handleSendMessage} className="relative">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          disabled={isSending}
          className="bg-card pr-10 font-pitch-sans-medium text-paragraph focus:bg-card/80"
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={isSending || !message.trim()} 
          className="absolute right-1 top-1/2 -translate-y-1/2 bg-transparent hover:bg-button/10 p-1"
        >
          <svg 
            viewBox="0 0 24 24" 
            className="w-5 h-5 text-button rotate-90" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}