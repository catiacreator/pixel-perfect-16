import { createFileRoute } from "@tanstack/react-router";
import Videos from "@/page-views/pilar2/Videos";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/videos")({
  head: () => ({ meta: [{ title: "Vídeos com IA — Leveza no Digital" }] }),
  component: Videos,
});
