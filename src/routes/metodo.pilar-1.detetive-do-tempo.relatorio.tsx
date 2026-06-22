import { createFileRoute } from "@tanstack/react-router";
import RelatorioDoTempo from "@/page-views/pilar1/RelatorioDoTempo";

export const Route = createFileRoute("/metodo/pilar-1/detetive-do-tempo/relatorio")({
  head: () => ({ meta: [{ title: "Relatório — Paraíso Digital" }] }),
  component: RelatorioDoTempo,
});
