import { createFileRoute } from "@tanstack/react-router";
import DetetiveDoTempo from "@/page-views/pilar1/DetetiveDoTempo";

export const Route = createFileRoute("/metodo/pilar-1/detetive-do-tempo/")({
  head: () => ({ meta: [{ title: "Mapa do Tempo — Leveza no Digital" }] }),
  component: DetetiveDoTempo,
});
