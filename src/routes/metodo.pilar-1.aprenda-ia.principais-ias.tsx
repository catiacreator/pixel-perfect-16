import { createFileRoute } from "@tanstack/react-router";
import PrincipaisIAs from "@/page-views/pilar1/PrincipaisIAs";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/principais-ias")({
  head: () => ({ meta: [{ title: "Principais IAs — Leveza no Digital" }] }),
  component: PrincipaisIAs,
});
