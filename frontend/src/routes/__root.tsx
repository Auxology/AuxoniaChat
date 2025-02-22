import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import NavBar from "@/components/NavBar";
import {Footer} from "@/components/Footer";

export const Route = createRootRoute({
  component: () => (
    <>
        <NavBar />
      <Outlet />
      <TanStackRouterDevtools />
        <Footer />
    </>
  ),
})