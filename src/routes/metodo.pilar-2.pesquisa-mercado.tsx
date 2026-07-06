import { createFileRoute } from "@tanstack/react-router";
import PesquisaMercado from "@/page-views/pilar2/PesquisaMercado";

export const Route = createFileRoute("/metodo/pilar-2/pesquisa-mercado")({
  head: () => ({ meta: [{ title: "Pesquisa de Mercado — Cátia Creator" }] }),
  component: PesquisaMercado,
});
