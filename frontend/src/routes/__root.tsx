import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "react-hot-toast";
import { api } from "../lib/axios";

const queryClient = new QueryClient();

const RootLayout = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <Toaster/>
      <Outlet />
    </QueryClientProvider>
    {/* <TanStackRouterDevtools /> */}
  </>
);

// 2. Root route with a loader for current user
export const Route = createRootRoute({
  component: RootLayout,
  loader: async () => {
    try {
      const { data } = await api.get("/auth/me"); // your backend /me endpoint
      return data; // { userId, role }
    } catch (err) {
      
      return null; // or throw redirect to /login
    }
  },
});

export const useAuth = ()=>{
  return Route.useLoaderData();
}

