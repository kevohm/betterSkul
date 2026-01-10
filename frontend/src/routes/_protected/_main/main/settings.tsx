import { createFileRoute } from '@tanstack/react-router'
import Settings from '../../../../pages/instructor/Settings'

export const Route = createFileRoute('/_protected/_main/main/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Settings/>
}
