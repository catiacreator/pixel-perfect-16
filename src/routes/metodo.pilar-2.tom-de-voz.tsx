import { createFileRoute } from "@tanstack/react-router";
import TomDeVoz from "@/page-views/pilar2/TomDeVoz";

export const Route = createFileRoute("/metodo/pilar-2/tom-de-voz")({
  head: () => ({ meta: [{ title: "Tom de Voz — Leveza no Digital" }] }),
  component: TomDeVoz,
});
