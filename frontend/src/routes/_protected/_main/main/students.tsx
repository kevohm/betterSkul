import { createFileRoute } from '@tanstack/react-router'
import Students from '../../../../pages/instructor/Students'

export const Route = createFileRoute('/_protected/_main/main/students')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Students/>
}
