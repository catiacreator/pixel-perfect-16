import { createFileRoute } from "@tanstack/react-router";
import ConsultoriaIA from "@/page-views/consultoria/ConsultoriaIA";

export const Route = createFileRoute("/metodo/consultoria-ia")({
  head: () => ({ meta: [{ title: "Consultoria IA — Leveza no Digital" }] }),
  component: ConsultoriaIA,
});
