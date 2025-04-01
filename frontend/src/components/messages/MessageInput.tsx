import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

interface MessageInputProps {
  serverId: string;
  channelId?: string;
}

export function MessageInput({ serverId, channelId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSending(true);
    
    try {
      // If channelId is provided, send to specific channel
      // Otherwise send to server general chat
      const endpoint = channelId 
        ? `/messages/channel/${channelId}`
        : `/messages/${serverId}`;
        
      await axiosInstance.post(endpoint, { 
        content: message.trim() 
      });
      
      setMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-4 border-t border-muted/20">
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