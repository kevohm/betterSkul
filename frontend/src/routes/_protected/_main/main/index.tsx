import { createFileRoute } from '@tanstack/react-router'
import Home from '../../../../pages/instructor/Home'

export const Route = createFileRoute('/_protected/_main/main/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Home/>
}
