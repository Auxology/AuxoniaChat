import { useNavigate } from '@tanstack/react-router';
import { Hash, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useServerChannels } from '@/queries/channelQueries';

interface ServerChannelsSidebarProps {
  serverId: string;
  isCurrentUserOwner: boolean;
  onCreateChannel: () => void;
  className?: string;
}

export function ServerChannelsSidebar({
  serverId,
  isCurrentUserOwner,
  onCreateChannel,
  className = '',
}: ServerChannelsSidebarProps) {
  const navigate = useNavigate();

  // Use the imported hook from useChannel.ts instead of defining inline
  const {
    data: channels,
    isLoading,
    error
  } = useServerChannels(serverId);

  return (
    <div className={`h-full w-60 bg-sidebar border-r border-muted/20 flex flex-col ${className}`}>
      <div className="p-4 border-b border-muted/20">
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-sm">Channels</h2>
          {isCurrentUserOwner && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              onClick={onCreateChannel}
              title="Create Channel"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading && (
          <div className="flex justify-center pt-4">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {error && (
          <div className="p-4 text-sm text-red-400">
            Failed to load channels
          </div>
        )}
        
        {channels?.length === 0 && !isLoading && (
          <div className="p-4 text-sm text-muted-foreground">
            No channels yet
          </div>
        )}

        <div className="p-2">
          {channels?.map((channel) => (
            <Button
              key={channel.id}
              variant="ghost"
              className="w-full justify-start mb-1 text-sm px-2"
              onClick={() => navigate({ 
                to: '/chat/servers/$serverId/channels/$channelId', 
                params: { serverId, channelId: channel.id } 
              })}
            >
              <Hash className="mr-2 h-4 w-4" />
              {channel.name}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}