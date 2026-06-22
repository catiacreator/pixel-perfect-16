import { createFileRoute } from "@tanstack/react-router";
import ComoUsar from "@/page-views/consultoria/ComoUsar";

export const Route = createFileRoute("/metodo/consultoria-ia/como-usar")({
  head: () => ({ meta: [{ title: "Como Usar — Leveza no Digital" }] }),
  component: ComoUsar,
});
