import { createFileRoute } from "@tanstack/react-router";
import Videos from "@/page-views/pilar2/Videos";

export const Route = createFileRoute("/metodo/pilar-2/videos")({
  head: () => ({ meta: [{ title: "Vídeos — Paraíso Digital" }] }),
  component: Videos,
});
