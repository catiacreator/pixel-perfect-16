import { createFileRoute } from "@tanstack/react-router";
import ConclusaoPilar2 from "@/page-views/pilar2/ConclusaoPilar2";

export const Route = createFileRoute("/metodo/pilar-2/conclusao")({
  head: () => ({ meta: [{ title: "Conclusão Pilar 2 — Cátia Creator" }] }),
  component: ConclusaoPilar2,
});
