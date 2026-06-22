import { createFileRoute } from "@tanstack/react-router";
import EsbocoMetodo from "@/page-views/pilar2/EsbocoMetodo";

export const Route = createFileRoute("/metodo/pilar-2/metodo")({
  head: () => ({ meta: [{ title: "Método — Paraíso Digital" }] }),
  component: EsbocoMetodo,
});
