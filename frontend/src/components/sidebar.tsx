import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search, MessageSquare, Plus, User, Settings, LogOut } from "lucide-react";
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
import { CreateServerDialog } from "./create-server";
import { JoinServerDialog } from "./join-server";
import { Server, useUserServers } from "@/query/useServerActions";
import { toast } from "sonner";

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
    <div className="flex flex-col bg-sidebar h-full border-r border-muted/20">
      {/* Top Navigation Icons */}
      <div className="flex flex-col items-center py-4 space-y-4">
        <TooltipProvider>
          <Tooltip delayDuration={300}>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full bg-button text-headline hover:bg-button/80">
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Search</p>
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
        <div className="w-8 h-0.5 bg-muted/20 rounded-full my-2"></div>
      </div>

      {/* Server List */}
      <ScrollArea className="flex-1 py-2">
        <div className="flex flex-col items-center space-y-4">
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
              No servers yet
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer Icons */}
      <div className="mt-2 mb-4 flex flex-col items-center space-y-4">
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

        {/* Add join server button */}
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

        {/* User Avatar Dropdown */}
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

      {/* Create Server Dialog */}
      <CreateServerDialog open={createServerOpen} onOpenChange={setCreateServerOpen} />
      
      {/* Add Join Server Dialog */}
      <JoinServerDialog open={joinServerOpen} onOpenChange={setJoinServerOpen} />
    </div>
  );
}

// Server Icon Component
function ServerIcon({ server }: { server: Server }) {
  return (
    <TooltipProvider>
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
    </TooltipProvider>
  );
}