import { createFileRoute } from '@tanstack/react-router'
import HomeWrapper from '../../pages/student/HomeWrapper'

export const Route = createFileRoute('/_protected/_home')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HomeWrapper/>
}
