import { Sheet, SheetContent, SheetTrigger, SheetHeader } from "@/components/ui/sheet";
import { Hash, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from '@tanstack/react-router';
import { useServerChannels } from "@/queries/channelQueries";

interface MobileChannelsSidebarProps {
  serverId: string;
  isCurrentUserOwner: boolean;
  onCreateChannel: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileChannelsSidebar({
  serverId,
  isCurrentUserOwner,
  onCreateChannel,
  open,
  onOpenChange
}: MobileChannelsSidebarProps) {
  const navigate = useNavigate();
  
  // Fetch channels data
  const {
    data: channels,
    isLoading,
    error
  } = useServerChannels(serverId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="outline"
          size="sm"
          className="md:hidden flex items-center justify-center gap-1 mr-2 px-2 bg-sidebar/50"
        >
          <Hash className="h-4 w-4 text-button" />
          <span className="text-xs font-pitch-sans-medium">Channels</span>
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px] border-r ">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-4 py-3 border-b flex flex-row justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 rounded-full"
            >
            </Button>
          </SheetHeader>
          
          {/* Channel header with create button */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-sm text-headline">Channels</h2>
              {isCurrentUserOwner && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-button"
                  onClick={() => {
                    onCreateChannel();
                    onOpenChange(false);
                  }}
                  title="Create Channel"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Channels list */}
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
                  className="w-full justify-start mb-1 text-sm px-2 hover:bg-transparent"
                  onClick={() => {
                    navigate({
                      to: '/chat/servers/$serverId/channels/$channelId', 
                      params: { serverId, channelId: channel.id }
                    });
                    onOpenChange(false);
                  }}
                >
                  <Hash className="mr-2 h-4 w-4 text-headline/80 hover:text-headline " />
                  <span className="text-paragraph hover:text-headline">{channel.name}</span>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}