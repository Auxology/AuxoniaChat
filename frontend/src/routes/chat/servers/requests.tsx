import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react"
import { motion } from "motion/react"
import { Link } from "@tanstack/react-router"
import { useSentJoinRequests, useIncomingJoinRequests, useApproveJoinRequest, useRejectJoinRequest } from "@/query/useServerActions"
import { 
  Card, 
  CardContent,
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Bell, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Check, 
  X,
  Clock,
  User,
  Users
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { requireAuth } from "@/utils/routeGuards"
import { useSocket } from '@/hooks/useSocket'

export const Route = createFileRoute('/chat/servers/requests')({
  beforeLoad: async () => {
    return await requireAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const [activeTab, setActiveTab] = useState<"sent" | "incoming">("sent")
  const { data: sentRequests, isLoading: sentLoading } = useSentJoinRequests()
  const { data: incomingRequests, isLoading: incomingLoading } = useIncomingJoinRequests()
  const approveRequest = useApproveJoinRequest()
  const rejectRequest = useRejectJoinRequest()
  useSocket()

  const handleApprove = (requestId: string, serverId: string) => {
    approveRequest.mutate({ requestId, serverId })
  }

  const handleReject = (requestId: string, serverId: string) => {
    rejectRequest.mutate({ requestId, serverId })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge className="bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 transition-colors">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case 'approved':
        return (
          <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 transition-colors">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        )
      case 'rejected':
        return (
          <Badge className="bg-rose-500/20 text-rose-500 hover:bg-rose-500/30 transition-colors">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-muted/20 text-muted-foreground">
            {status}
          </Badge>
        )
    }
  }

  return (
    <main className="min-h-[92.8vh] flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-4xl"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-[2px] bg-gradient-to-r from-button via-headline to-button rounded-2xl blur-sm" />

        {/* Card Content */}
        <Card className="relative bg-background rounded-2xl shadow-lg overflow-hidden">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
              <CardTitle className="font-ogg text-headline text-xl sm:text-2xl md:text-3xl flex items-center gap-2 sm:gap-3">
                <span className="bg-button/20 p-1.5 sm:p-2 rounded-lg">
                  <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-button" />
                </span>
                Server Requests
              </CardTitle>
              <Link 
                to="/chat" 
                className="group flex items-center gap-2 font-pitch-sans-medium text-paragraph hover:text-headline transition-colors duration-200"
              >
                <span className="bg-button/10 p-1.5 sm:p-2 rounded-lg group-hover:bg-button/20 transition-colors duration-200">
                  <ArrowLeft className="h-4 w-4 text-button" />
                </span>
                <span>Return to Chat</span>
              </Link>
            </div>
            <CardDescription className="font-freight-text-pro-black text-paragraph">
              Manage your server join requests
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="sent" className="w-full" onValueChange={(value) => setActiveTab(value as "sent" | "incoming")}>
              <TabsList className="grid grid-cols-2 mb-6 bg-card/50 p-1 rounded-lg border border-button/10">
                <TabsTrigger 
                  value="sent" 
                  className="font-pitch-sans-medium data-[state=active]:bg-button data-[state=active]:text-white data-[state=inactive]:text-paragraph data-[state=inactive]:hover:text-headline transition-colors"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sent Requests
                </TabsTrigger>
                <TabsTrigger 
                  value="incoming" 
                  className="font-pitch-sans-medium data-[state=active]:bg-button data-[state=active]:text-white data-[state=inactive]:text-paragraph data-[state=inactive]:hover:text-headline transition-colors"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Incoming Requests
                  {incomingRequests?.length > 0 && (
                    <Badge className="ml-2 bg-rose-500/90 hover:bg-rose-500 text-white border-transparent">
                      {incomingRequests.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="sent" className="outline-none">
                <div className="bg-card/30 p-4 sm:p-6 rounded-xl border border-button/10">
                  <h3 className="font-pitch-sans-medium text-headline text-lg mb-4">Your Sent Join Requests</h3>
                  
                  <ScrollArea className="h-[400px] pr-4">
                    {sentLoading ? (
                      <div className="flex flex-col items-center justify-center h-[300px] text-paragraph">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p className="font-freight-text-pro-black">Loading your requests...</p>
                      </div>
                    ) : sentRequests?.length > 0 ? (
                      <div className="space-y-3">
                        {sentRequests.map((request: any) => (
                          <div 
                            key={request.id} 
                            className="flex items-center justify-between p-4 rounded-md border border-muted/20 bg-card/50 hover:bg-card/80 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10 border border-button/10">
                                {request.server_icon_url ? (
                                  <AvatarImage src={request.server_icon_url} alt={request.server_name} />
                                ) : (
                                  <AvatarFallback className="bg-button/20 text-headline">
                                    {request.server_name?.charAt(0).toUpperCase() || "S"}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-pitch-sans-medium text-headline">{request.server_name}</p>
                                <p className="text-xs text-paragraph">
                                  Requested {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            {getStatusBadge(request.status)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-paragraph">
                        <div className="bg-button/10 p-3 rounded-full mb-4">
                          <Bell className="h-6 w-6 text-button" />
                        </div>
                        <p className="font-freight-text-pro-black mb-2">No requests sent</p>
                        <p className="text-sm text-paragraph/70 text-center max-w-md">
                          You haven't sent any server join requests yet. Browse and find servers to join.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
              
              <TabsContent value="incoming" className="outline-none">
                <div className="bg-card/30 p-4 sm:p-6 rounded-xl border border-button/10">
                  <h3 className="font-pitch-sans-medium text-headline text-lg mb-4">Server Join Requests to Review</h3>
                  
                  <ScrollArea className="h-[400px] pr-4">
                    {incomingLoading ? (
                      <div className="flex flex-col items-center justify-center h-[300px] text-paragraph">
                        <Loader2 className="h-8 w-8 animate-spin mb-4" />
                        <p className="font-freight-text-pro-black">Loading incoming requests...</p>
                      </div>
                    ) : incomingRequests?.length > 0 ? (
                      <div className="space-y-3">
                        {incomingRequests.map((request: any) => (
                          <div 
                            key={request.id} 
                            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-md border border-muted/20 bg-card/50 hover:bg-card/80 transition-colors"
                          >
                            <div className="flex items-center gap-3 mb-3 sm:mb-0">
                              <Avatar className="h-10 w-10 border border-button/10">
                                {request.user_avatar_url ? (
                                  <AvatarImage src={request.user_avatar_url} alt={request.username} />
                                ) : (
                                  <AvatarFallback className="bg-button/20 text-headline">
                                    {request.username?.charAt(0).toUpperCase() || "U"}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="font-pitch-sans-medium text-headline">{request.username}</p>
                                <p className="text-xs text-paragraph">
                                  Wants to join <span className="text-button font-medium">{request.server_name}</span>
                                </p>
                                <p className="text-xs text-paragraph/70">
                                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 self-end sm:self-auto">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition-colors"
                                onClick={() => handleApprove(request.id, request.server_id)}
                                disabled={approveRequest.isPending && approveRequest.variables?.requestId === request.id}
                              >
                                {approveRequest.isPending && approveRequest.variables?.requestId === request.id ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <Check className="h-4 w-4 mr-1" />
                                )}
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="bg-rose-500/10 text-rose-500 border-rose-500/30 hover:bg-rose-500 hover:text-white transition-colors"
                                onClick={() => handleReject(request.id, request.server_id)}
                                disabled={rejectRequest.isPending && rejectRequest.variables?.requestId === request.id}
                              >
                                {rejectRequest.isPending && rejectRequest.variables?.requestId === request.id ? (
                                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                  <X className="h-4 w-4 mr-1" />
                                )}
                                Reject
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[300px] text-paragraph">
                        <div className="bg-button/10 p-3 rounded-full mb-4">
                          <Users className="h-6 w-6 text-button" />
                        </div>
                        <p className="font-freight-text-pro-black mb-2">No pending requests</p>
                        <p className="text-sm text-paragraph/70 text-center max-w-md">
                          You don't have any pending join requests for your servers.
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  )
}
