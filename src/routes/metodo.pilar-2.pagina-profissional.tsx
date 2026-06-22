import { createFileRoute } from "@tanstack/react-router";
import PaginaProfissional from "@/page-views/pilar2/PaginaProfissional";

export const Route = createFileRoute("/metodo/pilar-2/pagina-profissional")({
  head: () => ({ meta: [{ title: "Página Profissional — Paraíso Digital" }] }),
  component: PaginaProfissional,
});
