import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect, } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Users, Plus} from "lucide-react";
import { Sidebar } from "@/components/sidebars/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { requireAuth } from '@/utils/routeGuards';
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { MembersSidebar } from "@/components/sidebars/MembersSidebar";
import { CreateChannelDialog } from "@/components/create-channel";
import { MobileSidebar } from "@/components/sidebars/mobile-sidebar";

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

  // Fetch the current user data
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
  const isCurrentUserOwner = !!(Array.isArray(members) && currentUser &&
    members.some(member => 
      member.role === 'owner' && 
      member.id === currentUser.id
    ));

  // Get server initial safely
  const getServerInitial = () => {
    if (!server || !server.name) return 'S';
    return server.name.charAt(0).toUpperCase();
  };

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem('message') as HTMLInputElement;
    const message = input.value.trim();

    if (message) {
      // Here you'll integrate with your WebSocket/chat service
      console.log("Sending message:", message);
      input.value = '';
    }
  };

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
            <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
            
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

        {/* Members Sidebar Component */}
        <MembersSidebar 
          serverId={serverId}
          server={server}
          members={members}
          isLoadingMembers={isLoadingMembers}
          membersOpen={membersOpen}
          setMembersOpen={setMembersOpen}
          isCurrentUserOwner={isCurrentUserOwner}
          currentUserId={currentUser?.id}
        />
      </div>

      <CreateChannelDialog 
        serverId={serverId}
        open={isCreateChannelOpen}
        onOpenChange={setIsCreateChannelOpen}
      />
    </div>
  );
}