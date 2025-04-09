import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRequestJoinServer } from "@/actions/useServerActions";
import { useServerSearch } from "@/queries/ServerQueries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { DialogDescription } from "@radix-ui/react-dialog";

interface ServerSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ServerSearchDialog({ open, onOpenChange }: ServerSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: servers = [], isLoading, isFetching } = useServerSearch(searchTerm);
  const requestJoinMutation = useRequestJoinServer();

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Handle request to join server
  const handleRequestJoin = (serverId: string) => {
    requestJoinMutation.mutate(serverId, {
      onSuccess: () => {
        // Close the dialog after successful request
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-muted/30 z-[9999]">
        <DialogHeader>
          <DialogTitle className="text-headline">Find Servers</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            You can request to join servers. Owners will need to approve your request.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center bg-card border border-muted/30 rounded-md px-3 py-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground mr-2" />
          <Input
            placeholder="Search servers by name..."
            className="border-0 bg-transparent text-headline p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        {(isLoading || isFetching) && (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!isLoading && !isFetching && searchTerm.length > 2 && servers.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No servers found with that name
          </div>
        )}

        {servers.length > 0 && (
          <ScrollArea className="max-h-[300px] pr-4">
            <div className="space-y-2">
              {servers.map((server) => (
                <div 
                  key={server.id}
                  className="flex items-center justify-between p-3 rounded-md hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {server.iconUrl ? (
                        <AvatarImage src={server.iconUrl} alt={server.name} />
                      ) : (
                        <AvatarFallback className="bg-button text-headline">
                          {server.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium text-headline">{server.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRequestJoin(server.id)}
                      disabled={requestJoinMutation.isPending}
                      className="bg-button text-headline border-muted/30 hover:bg-button/80 hover:text-paragraph"
                    >
                      {requestJoinMutation.isPending && requestJoinMutation.variables === server.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : null}
                      Request Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}