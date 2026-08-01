import { createFileRoute, redirect } from "@tanstack/react-router";

// Página intermédia escondida — vai direto para o fluxo da jornada.
export const Route = createFileRoute("/protocolo")({
  beforeLoad: () => {
    throw redirect({ to: "/metodo" });
  },
});
