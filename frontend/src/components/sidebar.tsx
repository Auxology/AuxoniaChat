import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Plus, User, Settings, LogOut } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios.ts"
import { Link } from "@tanstack/react-router"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// User data interface
interface UserData {
    id: string;
    username: string;
    email: string;
    avatar_url: string | null;
}

// Server interface
interface Server {
    id: string;
    name: string;
    iconUrl: string | null;
}

// API functions
const fetchUserProfile = async (): Promise<UserData> => {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
}

const fetchUserServers = async (): Promise<Server[]> => {
    try {
        const response = await axiosInstance.get('/user/servers');
        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Failed to fetch servers:", error);
        return [];
    }
}

export function Sidebar() {
    // Fetch user profile
    const { 
        data: userData, 
        isLoading: isLoadingUser 
    } = useQuery({
        queryKey: ['userProfile'],
        queryFn: fetchUserProfile,
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1
    })

    // Fetch user servers with better error handling
    const { 
        data: servers = [], 
        isLoading: isLoadingServers 
    } = useQuery({
        queryKey: ['userServers'],
        queryFn: fetchUserServers,
        staleTime: 1000 * 60 * 2, // 2 minutes
        retry: 1
    })

    // Get user initials for avatar fallback
    const getUserInitials = (): string => {
        if (!userData?.username) return "U";
        return userData.username.charAt(0).toUpperCase();
    }

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
                    ) : (
                        // Actual server list
                        servers.map((server) => (
                            <ServerIcon key={server.id} server={server} />
                        ))
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
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>Create or Join Server</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                {/* User Avatar with Dropdown Menu */}
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
                        {/* Header with user info */}
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
                        <Link to="/settings/profile" className="w-full">
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-paragraph hover:text-headline py-2">
                                <Settings className="h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                        </Link>
                        
                        <DropdownMenuSeparator className="bg-muted/20" />
                        
                        <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 py-2"
                            onClick={() => {
                                // Handle logout logic here
                                axiosInstance.post('/logout').then(() => {
                                    window.location.href = '/login';
                                });
                            }}
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Log Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
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
    )
}