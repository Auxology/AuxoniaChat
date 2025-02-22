import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/sign-up"!</div>
}
