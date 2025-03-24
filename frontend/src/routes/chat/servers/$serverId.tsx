import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Menu, Users, X, Plus, Hash, LogOut, Trash2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Sidebar } from "@/components/sidebar.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { requireAuth } from '@/utils/routeGuards';
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { useSocket } from '@/hooks/useSocket';
import { useServerChannels } from "@/query/useChannel";
import { CreateChannelDialog } from "@/components/create-channel";
import { useLeaveServer, useDeleteServer } from "@/query/useServerActions";
import { ConfirmDialog } from "@/components/confirm-dialog";



// Types
interface Server {
  id: string;
  name: string;
  iconUrl: string | null;
}

interface Member {
  id: string;
  username: string;
  avatar_url: string | null;
  role: 'owner' | 'admin' | 'member';
  status?: 'online' | 'idle' | 'dnd' | 'offline';
}

// Custom hooks for fetching server data
function useServerDetails(serverId: string) {
  return useQuery({
    queryKey: ['server', serverId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/servers/${serverId}`);
        return response.data as Server;
      } catch (error) {
        console.error('Failed to fetch server details:', error);
        throw error;
      }
    },
    enabled: Boolean(serverId),
    retry: 1
  });
}

function useServerMembers(serverId: string) {
  return useQuery({
    queryKey: ['serverMembers', serverId],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(`/servers/${serverId}/members`);
        return response.data as Member[];
      } catch (error) {
        console.error('Failed to fetch server members:', error);
        return [];
      }
    },
    enabled: Boolean(serverId),
    staleTime: 1000 * 60, // 1 minute
  });
}

export const Route = createFileRoute('/chat/servers/$serverId')({
  beforeLoad: async ({ params }) => {
    await requireAuth();
    return { serverId: params.serverId };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { serverId } = Route.useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(true); // Members sidebar is open by default on desktop
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const { data: channels, isLoading: isLoadingChannels } = useServerChannels(serverId);
  const leaveServerMutation = useLeaveServer();
  const deleteServerMutation = useDeleteServer();
  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  // Fetch server details using custom hook
  const {
    data: server,
    isLoading: isLoadingServer,
    error: serverError
  } = useServerDetails(serverId);

  // Handle server error
  useEffect(() => {
    if (serverError) {
      toast.error("Server not found", { 
        description: "The server you're looking for doesn't exist or you don't have access." 
      });
      navigate({ to: '/chat' });
    }
  }, [serverError, navigate]);

  // Fetch server members using custom hook
  const {
    data: members,
    isLoading: isLoadingMembers,
  } = useServerMembers(serverId);

  const [currentUser, setCurrentUser] = useState<{id: string} | null>(null);

  // Add this useEffect to fetch the current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    
    fetchCurrentUser();
  }, []);

  // Determine if current user is the server owner
  const isCurrentUserOwner = Array.isArray(members) && currentUser &&
    members.some(member => 
      member.role === 'owner' && 
      member.id === currentUser.id
    );

  // Group members by role - safely handle potentially undefined members
  const ownerMembers = Array.isArray(members) ? members.filter(member => member.role === 'owner') : [];
  const adminMembers = Array.isArray(members) ? members.filter(member => member.role === 'admin') : [];
  const regularMembers = Array.isArray(members) ? members.filter(member => member.role === 'member') : [];

  // Get server initial safely
  const getServerInitial = () => {
    if (!server || !server.name) return 'S';
    return server.name.charAt(0).toUpperCase();
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    // Message sending logic will go here
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();

    if (message) {
      // Here you'll integrate with your WebSocket/chat service
      console.log("Sending message:", message);
      input.value = '';
    }
  };

  // Add this function to handle server leaving
  const handleLeaveServer = () => {
    setConfirmLeaveOpen(true);
  };

  // Add this function to handle server deletion
  const handleDeleteServer = () => {
    setConfirmDeleteOpen(true);
  };

  // Rest of your component remains unchanged
  return (
    <div className="flex h-screen bg-chat text-headline">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[72px] bg-sidebar border-r border-muted/20">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Server Content */}
        <div className="flex-1 flex flex-col max-w-full">
          {/* Header */}
          <div className="h-12 border-b border-muted/20 flex items-center px-4">
            {/* Mobile Sidebar Toggle */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[72px] bg-sidebar">
                <Sidebar />
              </SheetContent>
            </Sheet>

            {/* Server name and icon */}
            <div className="flex items-center">
              {isLoadingServer ? (
                <div className="w-6 h-6 rounded-full bg-muted/20 animate-pulse mr-2"></div>
              ) : server?.iconUrl ? (
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={server.iconUrl} alt={server.name || "Server"} />
                  <AvatarFallback className="bg-button text-headline text-xs">
                    {getServerInitial()}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-6 w-6 rounded-full bg-button flex items-center justify-center text-headline text-xs mr-2">
                  {getServerInitial()}
                </div>
              )}
              <h1 className="font-pitch-sans-medium text-headline">
                {isLoadingServer ? 'Loading...' : server?.name || 'Server'}
              </h1>
              {isCurrentUserOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCreateChannelOpen(true)}
                  className="ml-2 p-0 h-7 w-7"
                  title="Create Channel"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="ml-auto flex items-center">
              {/* Mobile Members Toggle */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMembersOpen(!membersOpen)}
              >
                <Users className="h-5 w-5" />
              </Button>
              
              {/* Desktop Members Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center gap-1"
                onClick={() => setMembersOpen(!membersOpen)}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">{membersOpen ? 'Hide' : 'Show'} Members</span>
              </Button>
            </div>
          </div>

          {/* Chat content area with messages */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages area */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Welcome message */}
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  {isLoadingServer ? (
                    <div className="w-16 h-16 rounded-full bg-muted/20 animate-pulse mb-4"></div>
                  ) : server?.iconUrl ? (
                    <Avatar className="h-16 w-16 mb-4">
                      <AvatarImage src={server.iconUrl} alt={server.name || "Server"} />
                      <AvatarFallback className="bg-button text-headline">
                        {getServerInitial()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-button flex items-center justify-center text-headline text-2xl mb-4">
                      {getServerInitial()}
                    </div>
                  )}
                  <h2 className="font-ogg text-headline text-2xl mb-2">
                    Welcome to {isLoadingServer ? '...' : server?.name || 'the server'}
                  </h2>
                  <p className="text-paragraph text-sm max-w-md">
                    This is the start of the conversation. Messages you send here will be seen by everyone in this server.
                  </p>
                </div>
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="p-4 border-t border-muted/20">
              <form onSubmit={handleSendMessage} className="relative">
                <Input
                  name="message"
                  placeholder="Send a message..."
                  className="bg-card pr-10 font-pitch-sans-medium text-paragraph focus:bg-card/80"
                />
                <Button 
                  type="submit" 
                  size="sm" 
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
          </div>
        </div>

        {/* Members Sidebar */}
        <div 
          className={cn(
            "bg-sidebar border-l border-muted/20 overflow-hidden transition-all",
            membersOpen ? "w-60" : "w-0"
          )}
        >
          {membersOpen && (
            <div className="h-full flex flex-col">
              {/* Members Header */}
              <div className="h-12 border-b border-muted/20 flex items-center px-4 justify-between">
                <h2 className="font-pitch-sans-medium text-headline">Members</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMembersOpen(false)}
                  className="md:hidden"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Channels sidebar section */}
              <div className="px-3 mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-pitch-sans-medium text-paragraph uppercase">Channels</h3>
                  {isCurrentUserOwner && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsCreateChannelOpen(true)}
                      className="h-6 w-6 p-0"
                      title="Create Channel"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                
                {isLoadingChannels ? (
                  // Loading skeleton
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-2 h-8 px-2">
                        <div className="w-4 h-4 rounded bg-muted/20 animate-pulse"></div>
                        <div className="h-4 w-24 bg-muted/20 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : channels && channels.length > 0 ? (
                  <div className="space-y-1">
                    {channels.map((channel) => (
                      <Button
                        key={channel.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start font-pitch-sans-medium text-paragraph"
                        title={channel.description || channel.name}
                      >
                        <Hash className="h-4 w-4 mr-2" />
                        {channel.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-paragraph py-2 px-2">
                    {isCurrentUserOwner 
                      ? "Click the + to create a channel" 
                      : "No channels yet"}
                  </div>
                )}
              </div>

              {/* Members List */}
              <ScrollArea className="flex-1 p-3">
                {isLoadingMembers ? (
                  // Loading skeleton
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-muted/20 animate-pulse"></div>
                        <div className="h-4 w-24 bg-muted/20 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Owner Section */}
                    {ownerMembers.length > 0 && (
                      <div>
                        <h3 className="text-xs font-pitch-sans-medium text-paragraph mb-2">OWNER</h3>
                        <div className="space-y-2">
                          {ownerMembers.map((member) => (
                            <MemberItem key={member.id} member={member} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Admins Section */}
                    {adminMembers.length > 0 && (
                      <div>
                        <h3 className="text-xs font-pitch-sans-medium text-paragraph mb-2">ADMINS</h3>
                        <div className="space-y-2">
                          {adminMembers.map((member) => (
                            <MemberItem key={member.id} member={member} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Members Section */}
                    {regularMembers.length > 0 && (
                      <div>
                        <h3 className="text-xs font-pitch-sans-medium text-paragraph mb-2">MEMBERS</h3>
                        <div className="space-y-2">
                          {regularMembers.map((member) => (
                            <MemberItem key={member.id} member={member} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>
              {/* Server Actions Section */}
              <div className="p-3 border-t border-muted/20 mt-auto">
                {isCurrentUserOwner ? (
                  // Delete Server button for owners
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full justify-start font-pitch-sans-medium text-destructive-foreground group"
                    onClick={() => setConfirmDeleteOpen(true)}
                    disabled={deleteServerMutation.isPending}
                  >
                    {deleteServerMutation.isPending ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        Delete Server
                      </>
                    )}
                  </Button>
                ) : (
                  // Leave Server button for regular members
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start font-pitch-sans-medium text-paragraph border-muted/30 hover:text-destructive hover:border-destructive group"
                    onClick={() => setConfirmLeaveOpen(true)}
                    disabled={leaveServerMutation.isPending}
                  >
                    {leaveServerMutation.isPending ? (
                      <>
                        <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                        Leaving...
                      </>
                    ) : (
                      <>
                        <LogOut className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                        Leave Server
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={confirmLeaveOpen}
        onOpenChange={setConfirmLeaveOpen}
        title="Leave Server"
        description={`Are you sure you want to leave "${server?.name || 'this server'}"? You can rejoin with an invite later.`}
        confirmText="Leave Server"
        onConfirm={() => {
          leaveServerMutation.mutate(serverId);
          setConfirmLeaveOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmDeleteOpen}
        onOpenChange={setConfirmDeleteOpen}
        title="Delete Server"
        description={`Are you sure you want to DELETE "${server?.name || 'this server'}"? This action cannot be undone and will remove the server for all members.`}
        confirmText="Delete Server"
        onConfirm={() => {
          deleteServerMutation.mutate(serverId);
          setConfirmDeleteOpen(false);
        }}
        variant="destructive"
      />

      <CreateChannelDialog 
        serverId={serverId}
        open={isCreateChannelOpen}
        onOpenChange={setIsCreateChannelOpen}
      />
    </div>
  );
}

// Member Item Component
function MemberItem({ member }: { member: Member }) {
  const { isOnline } = useSocket();
  const isUserOnline = isOnline(member.id);

  // Status indicator color based on online status from socket
  const statusColor = isUserOnline 
    ? "bg-emerald-500" // User is online
    : "bg-gray-500";   // User is offline

  // Safe username initial
  const getUserInitial = () => {
    if (!member || !member.username) return "?";
    return member.username.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-card/30 group transition-colors">
      <div className="relative">
        <Avatar className="h-8 w-8">
          {member.avatar_url ? (
            <AvatarImage src={member.avatar_url} alt={member.username || "Member"} />
          ) : (
            <AvatarFallback className="bg-card text-paragraph">
              {getUserInitial()}
            </AvatarFallback>
          )}
        </Avatar>
        <span 
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-sidebar",
            statusColor
          )}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-pitch-sans-medium text-headline truncate">
          {member.username || "Unknown User"}
        </p>
      </div>
    </div>
  );
}