import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/$tool")({
  head: () => ({ meta: [{ title: "Ferramenta — Cátia Creator" }] }),
  component: () => <Outlet />,
});
