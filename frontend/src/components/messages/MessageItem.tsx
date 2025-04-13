import React from 'react';

interface Message {
  id: string; // Message ID
  message: string; // Message content (changed from 'content')
  created_at: string; // Timestamp
  sender_id: string; // ID of the user who sent the message
  username: string; // Username of the sender
  avatar_url?: string; // Avatar URL of the sender (optional)
  // Add other message properties if needed
}

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {

  return (
    <div className="p-2 hover:bg-gray-700/50 flex items-start space-x-2">
      {/* Use avatar_url and username directly from message */}
      <img
        src={message.avatar_url || '/default-avatar.png'} // Use avatar_url
        alt={message.username} // Use username for alt text
        className="w-8 h-8 rounded-full"
      />
      <div>
        <div className="flex items-baseline space-x-2">
          {/* Use username directly from message */}
          <span className="font-semibold text-sm">{message.username}</span>
          {/* Use created_at and format it */}
          <span className="text-xs text-gray-400">{new Date(message.created_at).toLocaleString()}</span>
        </div>
        {/* Use message field for content */}
        <p className="text-sm">{message.message}</p>
      </div>
    </div>
  );
};