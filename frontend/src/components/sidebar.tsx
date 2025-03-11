import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Search, MessageSquare, Plus, User } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { axiosInstance } from "@/lib/axios.ts"
import { Link } from "@tanstack/react-router"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

// User data interface
interface UserData {
    id: string;
    username: string;
    email: string;
    avatarUrl: string | null;
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
    const response = await axiosInstance.get('/servers');
    return response.data;
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

    // Fetch user servers
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

    // Get server initials for server avatar fallback
    const getServerInitials = (serverName: string): string => {
        return serverName.charAt(0).toUpperCase();
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

                {/* User Avatar */}
                <TooltipProvider>
                    <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                            <Avatar className="h-12 w-12 border-2 border-muted/20 hover:border-paragraph/30 rounded-full transition-all">
                                {userData?.avatarUrl ? (
                                    <AvatarImage
                                        src={userData.avatarUrl}
                                        alt={`${userData.username}'s avatar`}
                                        className="rounded-full object-cover"
                                    />
                                ) : (
                                    <AvatarFallback className="bg-button text-headline">
                                        {isLoadingUser ? <User className="h-5 w-5" /> : getUserInitials()}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                            <p>
                                {isLoadingUser ? "Loading..." : userData?.username || "User Profile"}
                            </p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
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
                        to={`/chat/servers/$serverId`}
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