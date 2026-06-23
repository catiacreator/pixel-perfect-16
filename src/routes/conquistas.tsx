import { createFileRoute } from "@tanstack/react-router";
import Conquistas from "@/page-views/Conquistas";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas — Leveza no Digital" },
      { name: "description", content: "Pontos, sequência, ranking e histórico da sua trilha." },
    ],
  }),
  component: Conquistas,
});
