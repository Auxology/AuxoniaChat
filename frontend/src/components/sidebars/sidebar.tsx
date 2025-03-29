// This does not mobilefy the sidebar, it is a desktop version only.
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Plus, User, Settings, LogOut, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios.ts";
import { Link } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreateServerDialog } from "../create-server";
import { JoinServerDialog } from "../join-server";
import { ServerSearchDialog } from "../server-search-dialog";
import { Server, useUserServers } from "@/query/useServerActions";
import { toast } from "sonner";
import { 
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useQueryClient } from "@tanstack/react-query";

// User data interface
interface UserData {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
}

// API function for user profile
const fetchUserProfile = async (): Promise<UserData> => {
  const response = await axiosInstance.get('/user/profile');
  return response.data;
};

export function Sidebar() {
  const [createServerOpen, setCreateServerOpen] = useState(false);
  const [joinServerOpen, setJoinServerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Fetch user profile
  const { 
    data: userData, 
    isLoading: isLoadingUser 
  } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1
  });

  // Fetch user servers using our custom hook
  const { 
    data: servers = [], 
    isLoading: isLoadingServers,
    isError
  } = useUserServers();

  // Get user initials for avatar fallback
  const getUserInitials = (): string => {
    if (!userData?.username) return "U";
    return userData.username.charAt(0).toUpperCase();
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout');
      toast.success("Logged out successfully");
      window.location.href = '/login';
    } catch (error) {
      toast.error("Failed to log out", {
        description: "Please try again"
      });
    }
  };

  return (
    <div className="flex flex-col bg-sidebar h-full border-r-0">
      {/* Fixed Top Navigation */}
      <div className="shrink-0 py-2 flex flex-col items-center space-y-4">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full bg-button text-headline hover:bg-button/80"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Search Servers</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-button text-headline hover:bg-button/80">
                <MessageSquare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Direct Messages</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Server Divider */}
        <div className="w-8 h-0.5 bg-muted/20 rounded-full"></div>
      </div>

      {/* Scrollable Middle Section */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full border-none">
          <div className="flex flex-col h-full min-h-[calc(100vh-140px)] justify-between">
            {/* Server List - This will scroll */}
            <div className="flex flex-col items-center space-y-4 py-2 px-1">
              {isLoadingServers ? (
                // Loading placeholders
                Array.from({ length: 3 }).map((_, i) => (
                  <div 
                    key={`loading-server-${i}`}
                    className="w-12 h-12 rounded-full bg-muted/20 animate-pulse"
                  ></div>
                ))
              ) : isError ? (
                // Error state
                <div className="text-xs text-red-500 text-center px-2">
                  Failed to load servers
                </div>
              ) : servers.length > 0 ? (  
                // Actual server list
                servers.map((server) => (
                  <ServerIcon key={server.id} server={server} />
                ))
              ) : (
                // Empty state
                <div className="text-xs text-muted-foreground text-center px-2">
                  
                </div>
              )}
            </div>

            {/* Action Buttons - Will stick to bottom of scrollable area */}
            <div className="flex flex-col items-center space-y-4 py-4 px-1 mt-auto">
              {/* Action Button Divider */}
              <div className="w-8 h-0.5 bg-muted/20 rounded-full"></div>

              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-card text-emerald-500 hover:bg-emerald-500 hover:text-headline"
                      onClick={() => setCreateServerOpen(true)}
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Create a Server</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full bg-card text-blue-500 hover:bg-blue-500 hover:text-headline"
                      onClick={() => setJoinServerOpen(true)}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-5 w-5"
                      >
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                        <polyline points="10 17 15 12 10 7" />
                        <line x1="15" y1="12" x2="3" y2="12" />
                      </svg>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Join a Server</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <Link to="/chat/servers/requests">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full bg-card text-amber-500 hover:bg-amber-500 hover:text-headline"
                      >
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="h-5 w-5 "
                        >
                          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Server Requests</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* User Avatar - Fixed at bottom */}
      <div className="shrink-0 border-t border-muted/10 pt-2 pb-2 flex justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-12 w-12 border-2 border-muted/20 hover:border-paragraph/30 rounded-full transition-all cursor-pointer">
              {userData?.avatar_url ? (
                <AvatarImage
                  src={userData.avatar_url}
                  alt={`${userData.username}'s avatar`}
                  className="rounded-full object-cover"
                />
              ) : (
                <AvatarFallback className="bg-button text-headline">
                  {isLoadingUser ? <User className="h-5 w-5" /> : getUserInitials()}
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="end" className="w-56 bg-card border border-muted/20">
            {/* User info section */}
            <div className="flex items-center p-2 gap-3">
              <Avatar className="h-10 w-10">
                {userData?.avatar_url ? (
                  <AvatarImage
                    src={userData.avatar_url}
                    alt={`${userData.username}'s avatar`}
                  />
                ) : (
                  <AvatarFallback className="bg-button text-headline">
                    {getUserInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex flex-col">
                <p className="font-pitch-sans-medium text-headline text-sm">
                  {isLoadingUser ? "Loading..." : userData?.username || "User"}
                </p>
                <p className="text-xs text-paragraph truncate">
                  {userData?.email || ""}
                </p>
              </div>
            </div>
            
            <DropdownMenuSeparator className="bg-muted/20" />
            
            {/* Menu items */}
            <Link to="/settings" className="w-full">
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-paragraph hover:text-headline py-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
            </Link>
            
            {/* New Security Menu Item */}
            <Link to="/settings/security" className="w-full">
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-paragraph hover:text-headline py-2">
                <Shield className="h-4 w-4" />
                <span>Security & Privacy</span>
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuSeparator className="bg-muted/20" />
            
            <DropdownMenuItem 
              className="cursor-pointer flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modified dialogs with improved close button styling */}
      <CreateServerDialog 
        open={createServerOpen} 
        onOpenChange={setCreateServerOpen} 
      />
      <JoinServerDialog 
        open={joinServerOpen} 
        onOpenChange={setJoinServerOpen} 
      />
      <ServerSearchDialog 
        open={searchOpen} 
        onOpenChange={setSearchOpen} 
      />
    </div>
  );
}

// Server Icon Component
function ServerIcon({ server }: { server: Server }) {
  const queryClient = useQueryClient();
  const { data: userData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
  });
  
  // Check if the current user is the server owner
  const isServerOwner = userData?.id === server.ownerId;

  // Handle leaving server
  const handleLeaveServer = async () => {
    try {
      await axiosInstance.post(`/servers/${server.id}/leave`);
      toast.success(`Left ${server.name}`);
      // Refresh the server list
      queryClient.invalidateQueries({ queryKey: ["userServers"] });
    } catch (error) {
      toast.error("Failed to leave server", {
        description: "Please try again"
      });
    }
  };

  return (
    <TooltipProvider>
      <ContextMenu>
        <ContextMenuTrigger>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Link 
                to="/chat/servers/$serverId"
                params={{ serverId: server.id }}
                className="block"
              >
                {({ isActive }) => (
                  <div className={cn(
                    "relative group",
                    isActive && "before:absolute before:-left-2 before:top-1/2 before:-translate-y-1/2 before:h-10 before:w-1 before:bg-button before:rounded-r-md"
                  )}>
                    <Avatar 
                      className={cn(
                        "h-12 w-12 rounded-full transition-all hover:rounded-2xl",
                        isActive ? "rounded-2xl" : "rounded-full"
                      )}
                    >
                      {server.iconUrl ? (
                        <AvatarImage
                          src={server.iconUrl}
                          alt={server.name}
                          className="object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-card text-paragraph">
                          {server.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </div>
                )}
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{server.name}</p>
            </TooltipContent>
          </Tooltip>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56 bg-card border border-muted/20">
          {isServerOwner ? (
            <Link to="/chat/servers/$serverId/settings" params={{ serverId: server.id }}>
              <ContextMenuItem className="cursor-pointer text-paragraph hover:text-headline flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Server Settings</span>
              </ContextMenuItem>
            </Link>
          ) : (
            <ContextMenuItem 
              className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-900/20 flex items-center gap-2"
              onClick={handleLeaveServer}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1-2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Leave Server</span>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </TooltipProvider>
  );
}