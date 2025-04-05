import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient, useQuery } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { axiosInstance } from "@/lib/axios";
import { initializeSocket } from "@/utils/socket";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const { data: userData } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await axiosInstance.get('/user/profile');
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Initialize socket once when user data is available
  useEffect(() => {
    if (userData?.id) {
      initializeSocket(userData.id, queryClient);
    }
  }, [userData?.id]);
    
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Outlet />
        <Toaster richColors position="top-right" />
      </div>
    </QueryClientProvider>
  );
}