import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/metodo/pilar-2")({
  component: () => <Outlet />,
});
