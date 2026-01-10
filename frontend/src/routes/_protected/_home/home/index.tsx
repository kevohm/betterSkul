import { createFileRoute } from '@tanstack/react-router'
import Home from '../../../../pages/student/Home'

export const Route = createFileRoute('/_protected/_home/home/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Home/>
}
