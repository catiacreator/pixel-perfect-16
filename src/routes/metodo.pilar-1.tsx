import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/metodo/pilar-1")({
  component: () => <Outlet />,
});
