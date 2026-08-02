import { createFileRoute } from "@tanstack/react-router";
import AgentesCreator from "@/page-views/AgentesCreator";

// Versão autónoma dos Agentes Creator, ligada a partir da Criação Livre
// (mesmo conteúdo da página do mini-curso, mas sem a barra lateral do curso).
export const Route = createFileRoute("/agentes")({
  head: () => ({
    meta: [
      { title: "Agentes Creator — Criação Livre" },
      { name: "description", content: "Explora os agentes IA que criei, aprende como funcionam e começa a usá-los." },
    ],
  }),
  component: () => <AgentesCreator basePath="/agentes" contexto="livre" />,
});
