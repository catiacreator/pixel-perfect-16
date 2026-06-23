import { createFileRoute } from "@tanstack/react-router";
import PlanoAutomatizacao from "@/page-views/pilar1/PlanoAutomatizacao";

export const Route = createFileRoute("/metodo/pilar-1/detetive-do-tempo/plano")({
  head: () => ({ meta: [{ title: "Plano de Automatização — Leveza no Digital" }] }),
  component: PlanoAutomatizacao,
});
