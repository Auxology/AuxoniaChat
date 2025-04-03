import {QueryClient, useMutation, useQueryClient} from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";
import {AxiosError} from "axios";
import { useNavigate } from "@tanstack/react-router";

// Server types
export interface Server {
    id: string;
    name: string;
    iconUrl: string | null;
    ownerId: string;
}

interface CreateServerRequest {
    name: string;
    iconUrl?: string;
    iconFile?: File;  // Add this for file uploads
}

// Create server mutation
export function useCreateServer() {
    const queryClient:QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateServerRequest) => {
            // If we have a file, use FormData to send it
            if (data.iconFile) {
                const formData = new FormData();
                formData.append('name', data.name);
                formData.append('server', data.iconFile);
                
                const response = await axiosInstance.post("/servers/create", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                return response.data;
            } else {
                // No file, just send the name
                const response = await axiosInstance.post("/servers/create", {
                    name: data.name
                });
                return response.data;
            }
        },
        onSuccess: (data):void => {
            // Invalidate and restart servers list
            queryClient.invalidateQueries({ queryKey: ["userServers"] }).finally(() :void => {
                toast.success("Server created", {
                    description: `${data.name || "Your server"} has been created successfully.`,
                    duration: 5000,
                });
            })
        },
        onError: (error:AxiosError):void => {
            const message = (error.response?.data as { message?: string })?.message || "There was an error creating the server.";
            toast.error("Failed to create server", {
                description: message,
                duration: 5000,
            });
            console.error("Server creation error:", error);
        },
    });
}

export function useJoinServer() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (serverId: string) => {
            const response = await axiosInstance.post("/servers/join", { serverId });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["userServers"] }).finally(():void => {
                // Show success notification
                toast.success("Joined server", {
                    description: "You have successfully joined the server.",
                    duration: 5000,
                });
            })
        },
        onError: (error:AxiosError) => {
            const message:string = (error.response?.data as { message?: string })?.message || "There was an error joining the server.";
            
            // Show error notification
            toast.error("Failed to join server", {
                description: message,
                duration: 5000,
            });
        },
    });
}

export function useLeaveServer() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (serverId: string) => {
            // Send server id to body
            const response = await axiosInstance.post("/servers/leave", { 
                serverId // Make sure serverId is properly passed in the body
            });
            return response.data;
        },
        onSuccess: () => {
            // Invalidate and restart servers list
            queryClient.invalidateQueries({ queryKey: ["userServers"] }).finally(():void => {
                // Show success notification
                toast.success("Left server", {
                    description: "You have successfully left the server.",
                    duration: 5000,
                });
            })
            // Navigate away from the server page to the chat home
            navigate({ to: '/chat' }).finally()

        },
        onError: (error: AxiosError) => {
            const message: string = (error.response?.data as { message?: string })?.message || "There was an error leaving the server.";
            
            // Show error notification
            toast.error("Failed to leave server", {
                description: message,
                duration: 5000,
            });
        },
    });
}

export function useRequestJoinServer() {
    return useMutation({
        mutationFn: async (serverId: string) => {
            const response = await axiosInstance.post("/servers/request-join", { serverId });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Join request sent", {
                description: "The server owner will review your request.",
                duration: 5000,
            });
        },
        onError: (error: AxiosError) => {
            const message: string = (error.response?.data as { message?: string })?.message 
                || "There was an error sending your join request.";
            
            toast.error("Failed to request server join", {
                description: message,
                duration: 5000,
            });
        },
    });
    
}

export function useApproveJoinRequest() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({requestId, serverId}: {requestId: string, serverId: string}) => {
            const response = await axiosInstance.post("/servers/approve-join", { requestId, serverId });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["serverJoinRequests", variables.serverId] }).then(() => {
                queryClient.invalidateQueries({ queryKey: ["serverMembers", variables.serverId] }).finally(() => {
                    toast.success("Request approved", {
                        description: "User has been added to the server.",
                        duration: 5000,
                    });
                })
            },);
        },
        onError: (error: AxiosError) => {
            const message: string = (error.response?.data as { message?: string })?.message 
                || "There was an error approving the join request.";
            
            toast.error("Failed to approve request", {
                description: message,
                duration: 5000,
            });
        },
    });
}

export function useRejectJoinRequest() {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({requestId, serverId}: {requestId: string, serverId: string}) => {
            const response = await axiosInstance.post("/servers/reject-join", { requestId, serverId });
            return response.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["serverJoinRequests", variables.serverId] }).then(() => {
                toast.success("Request rejected", {
                    description: "The join request has been rejected.",
                    duration: 5000,
                });
            },);
        },
        onError: (error: AxiosError) => {
            const message: string = (error.response?.data as { message?: string })?.message 
                || "There was an error rejecting the join request.";
            
            toast.error("Failed to reject request", {
                description: message,
                duration: 5000,
            });
        },
    });
}

// This function is used to update server details
export function useUpdateServerName() {
    const queryClient:QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({serverId, name}: {serverId: string, name: string}) => {
            const response = await axiosInstance.patch("/servers/name/update", { serverId, name });
            return response.data;
        },
        onSuccess: ():void => {
            queryClient.invalidateQueries({ queryKey: ["userServers"] }).then(():void => {
                queryClient.invalidateQueries({ queryKey: ["server"] }).finally(():void => {
                    toast.success("Server name updated", {
                        description: "The server name has been updated successfully.",
                        duration: 5000,
                    });
                })
            })

            toast.success("Server name updated", {
                description: "The server name has been updated successfully.",
                duration: 5000,
            });
        },
        onError: (error: AxiosError):void => {
            const message: string = (error.response?.data as { message?: string })?.message
                || "There was an error updating the server name.";

            toast.error("Failed to update server name", {
                description: message,
                duration: 5000,
            });
        },
    })
}

// This function is used to update server icon
export function useUpdateServerIcon() {
    const queryClient:QueryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({serverId, iconFile}: {serverId: string, iconFile: File}) => {
            const formData = new FormData();
            formData.append('serverId', serverId);
            formData.append('server', iconFile);

            const response = await axiosInstance.patch("/servers/icon/update", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        },
        onSuccess: ():void => {
            queryClient.invalidateQueries({ queryKey: ["userServers"] }).then(():void => {
                queryClient.invalidateQueries({ queryKey: ["server"] }).finally(():void => {
                    toast.success("Server icon updated", {
                        description: "The server icon has been updated successfully.",
                        duration: 5000,
                    });
                })
            },);
        },
        onError: (error: AxiosError):void => {
            const message: string = (error.response?.data as { message?: string })?.message
                || "There was an error updating the server icon.";

            toast.error("Failed to update server icon", {
                description: message,
                duration: 5000,
            });
        },
    })
}

export function useDeleteServer() {
    const queryClient:QueryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (serverId: string) => {
            const response = await axiosInstance.delete("/servers/delete", { data: { serverId } });
            return response.data;
        },
        onSuccess: ():void => {
            queryClient.invalidateQueries({ queryKey: ["userServers"] }).then(():void => {
                queryClient.invalidateQueries({ queryKey: ["server"] }).finally(():void => {
                    toast.success("Server deleted", {
                        description: "Server has been deleted successfully.",
                        duration: 5000,
                    })

                    // Optionally, you can navigate the user away from the server page
                    navigate({ to: '/chat' }).finally()
                },);
            },);
        },
        onError: (error: AxiosError):void => {
            const message: string = (error.response?.data as { message?: string })?.message
                || "There was an error deleting the server.";

            toast.error("Failed to delete server", {
                description: message,
                duration: 5000,
            });
        },
    })
}