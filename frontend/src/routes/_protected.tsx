import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { api } from "../lib/axios";

export const Route = createFileRoute("/_protected")({
  component: RouteComponent,
  loader: async () => {
    try {
      const { data } = await api.get("/auth/me"); // your backend /me endpoint
      return data; // { userId, role }
    } catch (err) {
      throw redirect({ to: "/login" });
    }
  },
});

function RouteComponent() {
  return <Outlet/>
}
