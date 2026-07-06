import { createFileRoute } from "@tanstack/react-router";
import Home from "@/page-views/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cátia Creator — Jornada Rápida" },
      { name: "description", content: "Seu ambiente de evolução com IA: jornada rápida, mentoria e ferramentas para criar autoridade." },
      { property: "og:title", content: "Cátia Creator — Jornada Rápida" },
      { property: "og:description", content: "Seu ambiente de evolução com IA." },
    ],
  }),
  component: Home,
});
