import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSocket } from '@/hooks/useSocket';

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

interface MembersSidebarProps {
  serverId: string;
  server?: Server;
  members?: Member[];
  isLoadingMembers: boolean;
  membersOpen: boolean;
  setMembersOpen: (open: boolean) => void;
  isCurrentUserOwner: boolean;
  currentUserId?: string;
}

export function MembersSidebar({
  members = [],
  isLoadingMembers,
  membersOpen,
  setMembersOpen,
}: MembersSidebarProps) {
  // Group members by role
  const ownerMembers = members.filter(member => member.role === 'owner');
  const adminMembers = members.filter(member => member.role === 'admin');
  const regularMembers = members.filter(member => member.role === 'member');

  if (!membersOpen) {
    return null; // Don't render anything when closed
  }

  return (
    <div className={cn(
      "bg-sidebar border-l border-muted/20 overflow-hidden transition-all",
      // Full width and fixed position on mobile
      "md:w-60 md:static md:block",
      // Fixed position on mobile devices for overlay appearance
      "fixed top-12 bottom-0 right-0 w-full max-w-[250px] z-40",
    )}>
      <div className="h-full flex flex-col">
        {/* Members Header */}
        <div className="h-12 border-b border-muted/20 flex items-center px-4 justify-between">
          <h2 className="font-pitch-sans-medium text-headline">Members</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMembersOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Members List */}
        <ScrollArea className="flex-1 p-3">
          {isLoadingMembers ? (
            // Loading skeleton for members
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

              {/* Regular Members Section */}
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
      </div>
    </div>
  );
}

// Member Item Component
function MemberItem({ member }: { member: Member }) {
  const { isOnline } = useSocket();
  const isUserOnline = isOnline(member.id);

  // Status indicator based on online status
  const statusColor = isUserOnline 
    ? "bg-emerald-500" // Online
    : "bg-gray-500";    // Offline

  const getUserInitial = () => {
    return member.username?.charAt(0).toUpperCase() || "?";
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