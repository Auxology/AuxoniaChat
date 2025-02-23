import {createFileRoute} from '@tanstack/react-router'

export const Route = createFileRoute('/about/goals')({
    component: RouteComponent,
})

function RouteComponent() {
    return <div>Hello "/about/goals"!</div>
}
