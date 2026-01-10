import { createFileRoute, redirect } from '@tanstack/react-router'
import HomeWrapper from '../../pages/instructor/HomeWrapper'
import { api } from '../../lib/axios';

export const Route = createFileRoute('/_protected/_main')({
  component: RouteComponent,
    loader: async () => {
      try {
        const { data } = await api.get("/auth/me"); // your backend /me endpoint
        if(data?.role !== "instructor"){
          throw redirect({ to: "/home" });
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
