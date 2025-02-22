import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/security')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/security"!</div>
}
