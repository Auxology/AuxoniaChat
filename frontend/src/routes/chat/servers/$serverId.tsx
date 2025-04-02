import { createFileRoute, useNavigate, Outlet, useMatches } from '@tanstack/react-router';
import { useState, useEffect, } from "react";
import { useQuery } from "@tanstack/react-query"; 
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Sidebar } from "@/components/sidebars/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requireAuth } from '@/utils/routeGuards';
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import { MembersSidebar } from "@/components/sidebars/MembersSidebar";
import { CreateChannelDialog } from "@/components/create-channel";
import { MobileSidebar } from "@/components/sidebars/mobile-sidebar";
import { ServerChannelsSidebar } from '@/components/sidebars/ServerChannelsSidebar';
import { MobileChannelsSidebar } from '@/components/sidebars/mobile-channels-sidebar';

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
  const [membersOpen, setMembersOpen] = useState(true);
  const [isCreateChannelOpen, setIsCreateChannelOpen] = useState(false);
  const [channelSidebarOpen, setChannelSidebarOpen] = useState(false);
  
  // Check if we're at a channel route
  const matches = useMatches();
  const isChannelRoute = matches.some(match => 
    match.routeId.includes('/chat/servers/$serverId/channels/$channelId')
  );

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

  return (
    <div className="flex h-screen bg-chat text-headline">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-[72px] bg-sidebar border-r border-muted/20">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col md:flex-row relative">
        {/* Server Channels Sidebar - Hidden on mobile unless toggled */}
        <div className="hidden md:block h-full">
          <ServerChannelsSidebar 
            serverId={serverId}
            isCurrentUserOwner={isCurrentUserOwner}
            onCreateChannel={() => setIsCreateChannelOpen(true)}
          />
        </div>

        {/* Server Content */}
        <div className="flex-1 flex flex-col max-w-full">
          {/* Header */}
          <div className="h-12 border-b border-muted/20 flex items-center px-4">
            {/* Mobile Sidebar Toggle */}
            <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
            
            {/* Channels Sidebar Toggle - Mobile only */}
            <MobileChannelsSidebar
              serverId={serverId}
              isCurrentUserOwner={isCurrentUserOwner}
              onCreateChannel={() => setIsCreateChannelOpen(true)}
              open={channelSidebarOpen}
              onOpenChange={setChannelSidebarOpen}
            />
            
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
            </div>

            <div className="ml-auto flex items-center">
              {/* Members Toggle Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setMembersOpen(!membersOpen)}
              >
                <Users className="h-4 w-4" />
                <span className="hidden md:inline">{membersOpen ? 'Hide' : 'Show'} Members</span>
              </Button>
            </div>
          </div>

          {/* Either show "No channel selected" or render the channel content */}
          {isChannelRoute ? (
            <Outlet />
          ) : (
            <div className="flex-1 flex items-center justify-center flex-col p-4">
              <div className="text-center max-w-md">
                <h2 className="text-xl font-semibold mb-2">Welcome to {server?.name || 'the server'}</h2>
                <p className="text-muted-foreground mb-4">Select a channel from the sidebar to start chatting</p>
              </div>
            </div>
          )}
        </div>

        {/* Add a modal backdrop for mobile */}
        {membersOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-30 md:hidden" 
            onClick={() => setMembersOpen(false)}
          />
        )}

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