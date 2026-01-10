import { createFileRoute, redirect } from "@tanstack/react-router";


export const Route = createFileRoute("/_protected/home")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/home"!</div>;
}
