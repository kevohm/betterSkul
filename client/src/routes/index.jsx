import { createFileRoute } from "@tanstack/react-router";
import Landing from "../Landing";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return  <Landing/>
}
