import { createLazyFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx";
import {Footer} from "@/components/Footer.tsx";

export const Route = createLazyFileRoute('/about/')({
  component: RouteComponent,
})


function RouteComponent() {
    return (
        <main>
            <NavBar />

            <h1>Hello</h1>

            <Footer />

        </main>
    )
}
