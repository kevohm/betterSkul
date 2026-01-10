import { createFileRoute } from '@tanstack/react-router'
import Settings from '../../../../pages/student/Settings'

export const Route = createFileRoute('/_protected/_home/home/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Settings/>
}
