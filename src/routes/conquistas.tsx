import { createFileRoute } from "@tanstack/react-router";
import Conquistas from "@/page-views/Conquistas";

export const Route = createFileRoute("/conquistas")({
  head: () => ({
    meta: [
      { title: "Conquistas — Cátia Creator" },
      { name: "description", content: "Pontos, sequência, ranking e histórico da sua jornada." },
    ],
  }),
  component: Conquistas,
});
