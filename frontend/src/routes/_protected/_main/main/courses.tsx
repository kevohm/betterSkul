import { createFileRoute } from '@tanstack/react-router'
import Courses from '../../../../pages/instructor/Courses'

export const Route = createFileRoute('/_protected/_main/main/courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Courses/>
}
