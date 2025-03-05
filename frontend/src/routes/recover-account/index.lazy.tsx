import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/recover-account/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/recover-account/"!</div>
}
