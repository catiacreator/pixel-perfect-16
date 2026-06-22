import { createFileRoute } from "@tanstack/react-router";
import ConclusaoPilar1 from "@/page-views/pilar1/ConclusaoPilar1";

export const Route = createFileRoute("/metodo/pilar-1/conclusao")({
  head: () => ({ meta: [{ title: "Conclusão Pilar 1 — Leveza no Digital" }] }),
  component: ConclusaoPilar1,
});
