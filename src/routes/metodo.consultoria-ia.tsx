import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/metodo/consultoria-ia")({
  component: () => <Outlet />,
});
