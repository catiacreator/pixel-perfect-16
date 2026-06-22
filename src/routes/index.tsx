import { createFileRoute } from "@tanstack/react-router";
import Home from "@/page-views/Home";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leveza no Digital — Trilha Rápida" },
      { name: "description", content: "Seu ambiente de evolução com IA: trilha rápida, mentoria e ferramentas para criar autoridade." },
      { property: "og:title", content: "Leveza no Digital — Trilha Rápida" },
      { property: "og:description", content: "Seu ambiente de evolução com IA." },
    ],
  }),
  component: Home,
});
