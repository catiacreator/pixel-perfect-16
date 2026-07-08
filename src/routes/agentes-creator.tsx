import { createFileRoute } from "@tanstack/react-router";
import AgentesCreator from "@/page-views/AgentesCreator";

export const Route = createFileRoute("/agentes-creator")({
  head: () => ({
    meta: [
      { title: "Agentes Creator — Coleção de Agentes IA" },
      { name: "description", content: "Explora os agentes IA que criei, aprende como funcionam e começa a usá-los." },
    ],
  }),
  component: AgentesCreator,
});
