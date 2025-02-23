import { createLazyFileRoute } from '@tanstack/react-router'
import NavBar from "@/components/NavBar.tsx";
import {Footer} from "@/components/Footer.tsx";

export const Route = createLazyFileRoute('/security/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <main>

          <NavBar />

          <h1>Hello World</h1>

          <Footer />

      </main>
  )
}
