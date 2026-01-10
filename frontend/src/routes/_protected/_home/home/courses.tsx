import { createFileRoute } from '@tanstack/react-router'
import Courses from '../../../../pages/student/Courses'

export const Route = createFileRoute('/_protected/_home/home/courses')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Courses/>
}
