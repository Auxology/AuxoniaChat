import { createRootRoute, Outlet } from "@tanstack/react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useSocket } from "@/hooks/useSocket";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  useSocket();
    
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Outlet />
        <Toaster richColors position="top-right" />
      </div>
    </QueryClientProvider>
  );
}