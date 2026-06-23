import { createFileRoute } from "@tanstack/react-router";
import AprendaIAHub from "@/page-views/pilar1/AprendaIAHub";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/")({
  head: () => ({ meta: [{ title: "Aprenda IA — Leveza no Digital" }] }),
  component: AprendaIAHub,
});
