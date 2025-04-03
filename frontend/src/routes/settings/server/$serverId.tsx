import { createFileRoute, useNavigate, Link, useRouter } from '@tanstack/react-router';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { ChevronLeft, Settings2, Users, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { requireAuth } from "@/utils/routeGuards";
import { Outlet } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Types
interface Server {
  id: string;
  name: string;
  iconUrl: string | null;
  ownerId: string;
}

export const Route = createFileRoute('/settings/server/$serverId')({
  beforeLoad: async ({ params }) => {
    await requireAuth();
    return { serverId: params.serverId };
  },
  component: ServerSettingsLayout,
});

function ServerSettingsLayout() {
  const { serverId } = Route.useParams();
  const navigate = useNavigate();
  const { pathname } = useRouter().state.location;

  // Fetch server details
  const { data: server, isLoading } = useQuery({
    queryKey: ['server', serverId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/servers/${serverId}`);
      return response.data as Server;
    },
  });

  // Get server initial for avatar fallback
  const getServerInitial = () => {
    if (!server?.name) return "S";
    return server.name.charAt(0).toUpperCase();
  };

  // Navigation items with improved icons and design
  const navigationItems = [
    {
      name: "General",
      path: `/settings/server/${serverId}/general`,
      icon: <Settings2 className="h-4 w-4" />
    },
    {
      name: "Members",
      path: `/settings/server/${serverId}/members`,
      icon: <Users className="h-4 w-4" />
    },
    {
      name: "Danger Zone",
      path: `/settings/server/${serverId}/danger`,
      icon: <AlertCircle className="h-4 w-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-background/95 flex justify-center items-center">
      {/* Enhanced top navigation bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm z-10 flex items-center justify-between px-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate({ to: '/chat/servers/$serverId', params: { serverId } })}
          className="flex items-center text-foreground/90 gap-2 font-medium hover:bg-primary/5 hover:text-primary transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Server</span>
        </Button>
        
        {/* Server name in the header for context */}
        <div className="text-sm font-medium text-muted-foreground">
          {!isLoading && server?.name && `Editing ${server.name}`}
        </div>
      </div>
      
      <div className="container max-w-6xl pt-24 pb-16 px-4 md:px-6">
        {/* Refined server header with visual emphasis */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-10 p-8 bg-gradient-to-br from-card to-card/80 rounded-xl border border-border/50 shadow-lg">
          <Avatar className="h-24 w-24 border-4 border-background ring-4 ring-primary/20 shadow-xl mx-auto md:mx-0">
            {server?.iconUrl ? (
              <AvatarImage src={server.iconUrl} alt={server.name} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-2xl font-bold">
                {getServerInitial()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2 leading-tight">
              {isLoading ? "Loading..." : server?.name || "Server Settings"}
            </h1>
            <p className="text-muted-foreground text-sm md:text-base max-w-lg">
              Customize your server's appearance, manage members, and configure server settings
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          {/* Enhanced sidebar navigation */}
          <div className="w-full">
            <nav className="bg-card/90 rounded-xl border border-border/70 overflow-hidden shadow-md sticky top-20">
              {navigationItems.map((item, index) => {
                const isActive = pathname === item.path;
                const isDangerZone = item.name === "Danger Zone";
                
                return (
                  <div key={item.name}>
                    {index > 0 && <Separator className="bg-border/40" />}
                    <Link
                      to={item.path}
                      className={cn(
                        "flex items-center py-5 px-6 transition-all relative group",
                        isActive 
                          ? "bg-primary/15 text-primary font-medium" 
                          : "hover:bg-accent/10",
                        isDangerZone && !isActive 
                          ? "text-destructive/80 hover:text-destructive hover:bg-destructive/5" 
                          : !isActive && "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span className={cn(
                        "mr-4 p-2 rounded-md transition-all",
                        isActive 
                          ? "bg-primary/20 text-primary" 
                          : isDangerZone 
                            ? "text-destructive/70 bg-destructive/10 group-hover:bg-destructive/15" 
                            : "text-muted-foreground bg-muted/50 group-hover:bg-muted/80 group-hover:text-foreground"
                      )}>
                        {item.icon}
                      </span>
                      <span className="font-medium">{item.name}</span>
                      
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary rounded-r-full"></div>
                      )}
                      
                      {!isActive && (
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                          <ChevronLeft className="h-4 w-4 rotate-180 text-muted-foreground/50" />
                        </div>
                      )}
                    </Link>
                  </div>
                );
              })}
            </nav>
          </div>
          
          {/* Enhanced content area */}
          <div className="flex-1">
            <div className="bg-card/95 backdrop-blur-sm rounded-xl border border-border/60 p-8 shadow-lg relative overflow-hidden">
              {/* Subtle decorative element */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
              
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}