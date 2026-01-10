import { createFileRoute } from '@tanstack/react-router'
import HomeWrapper from '../../pages/instructor/HomeWrapper'

export const Route = createFileRoute('/_protected/_main')({
  component: RouteComponent,
})

function RouteComponent() {
  return <HomeWrapper/>
}
