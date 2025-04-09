import {createFileRoute, redirect} from '@tanstack/react-router';
import { useState } from "react";
import { requireAuth } from "@/utils/routeGuards";
import { motion } from "motion/react";
import { AlertTriangle, Trash, LogOut, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useServerDetails } from '@/queries/ServerQueries';
import { useLeaveServer, useDeleteServer } from '@/actions/useServerActions';
import { useAuthCheck } from '@/queries/useAuthQuery';

export const Route = createFileRoute('/settings/server/$serverId/danger')({
  beforeLoad: async ({ params }) => {
    await requireAuth();
    return { serverId: params.serverId };
  },
  component: ServerDangerSettings,
});

function ServerDangerSettings() {
  const { serverId } = Route.useParams();
  const { data: server } = useServerDetails(serverId);  
  const { data: user } = useAuthCheck();
  const isOwner = server?.ownerId === user?.id;
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [leaveConfirmText, setLeaveConfirmText] = useState("");

  const deleteServerMutation = useDeleteServer();
  const leaveServerMutation = useLeaveServer();
  
  // Handle server deletion
  const handleDeleteServer = async () => {
    if (deleteConfirmText === server?.name) {
      deleteServerMutation.mutate(serverId);
    }
  };
  
  // Handle leaving server
  const handleLeaveServer = async () => {
    if (leaveConfirmText === "leave") {
      leaveServerMutation.mutate(serverId);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-10"
    >
      <div className="flex items-center gap-2 border-b border-border/40 pb-4">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
      </div>
      
      <div className="space-y-8">
        {/* Warning message */}
        <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <p className="font-pitch-sans-medium">Actions on this page are irreversible</p>
          </div>
          <p className="text-muted-foreground text-sm mt-2">
            Be careful with the actions below. Once performed, they cannot be undone.
          </p>
        </div>
        
        {/* Leave Server Section - Only shown to non-owners */}
        {!isOwner && (
          <div className="border border-border/40 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive/70"></div>
            
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-pitch-sans-medium text-foreground flex items-center gap-2">
                  <LogOut className="h-4 w-4 text-destructive/80" />
                  Leave Server
                </h3>
                <p className="text-sm text-muted-foreground">
                  You will lose access to all channels and messages in this server.
                </p>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setLeaveDialogOpen(true)}
                className="bg-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                Leave Server
              </Button>
            </div>
            
            <AlertDialog open={leaveDialogOpen} onOpenChange={setLeaveDialogOpen}>
              <AlertDialogContent className="bg-card border-border/60">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-5 w-5" />
                    Leave Server
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    Are you sure you want to leave <span className="font-medium text-foreground">{server?.name}</span>? 
                    You will lose access to all channels and messages.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="py-4">
                  <p className="mb-2 text-sm text-foreground">
                    Type <span className="font-pitch-sans-medium text-destructive">leave</span> to confirm:
                  </p>
                  <Input
                    value={leaveConfirmText}
                    onChange={(e) => setLeaveConfirmText(e.target.value)}
                    className="bg-background/50 border-border"
                    placeholder="leave"
                  />
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    className="border-border text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setLeaveConfirmText("");
                      setLeaveDialogOpen(false);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLeaveServer();
                    }}
                    disabled={leaveConfirmText !== "leave" || leaveServerMutation.isPending}
                  >
                    {leaveServerMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Leaving...
                      </>
                    ) : (
                      'Leave Server'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        
        {/* Delete Server Section - Only shown to owners */}
        {isOwner && (
          <div className="border border-border/40 rounded-lg p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-destructive"></div>
            
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-pitch-sans-medium text-foreground flex items-center gap-2">
                  <Trash className="h-4 w-4 text-destructive" />
                  Delete Server
                </h3>
                <p className="text-sm text-muted-foreground">
                  This action cannot be undone. All channels and messages will be permanently deleted.
                </p>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Server
              </Button>
            </div>
            
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent className="bg-card border-border/60">
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                    <Trash className="h-5 w-5" />
                    Delete Server
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This action cannot be undone. This will permanently delete the server
                    <span className="font-medium text-foreground"> {server?.name}</span>, 
                    including all channels, messages and media.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="py-4">
                  <p className="mb-2 text-sm text-foreground">
                    Type <span className="font-pitch-sans-medium text-destructive">{server?.name}</span> to confirm:
                  </p>
                  <Input
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="bg-background/50 border-border"
                    placeholder={server?.name}
                  />
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel 
                    className="border-border text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      setDeleteConfirmText("");
                      setDeleteDialogOpen(false);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    onClick={(e) => {
                      e.preventDefault();
                      handleDeleteServer();
                    }}
                    disabled={deleteConfirmText !== server?.name || deleteServerMutation.isPending}
                  >
                    {deleteServerMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete Server'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </motion.div>
  );
}
