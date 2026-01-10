import { createFileRoute, redirect } from '@tanstack/react-router'
import HomeWrapper from '../../pages/student/HomeWrapper'
import { api } from '../../lib/axios';

export const Route = createFileRoute('/_protected/_home')({
  component: RouteComponent,
      loader: async () => {
        try {
          const { data } = await api.get("/auth/me"); // your backend /me endpoint
          if(data?.role !== "student"){
            throw redirect({ to: "/main" });
          }
          return data; // { userId, role }
        } catch (err) {
          throw redirect({ to: "/login" });
        }
      },
})

function RouteComponent() {
  return <HomeWrapper/>
}
