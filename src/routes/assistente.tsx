import { createFileRoute } from "@tanstack/react-router";
import Assistente from "@/page-views/Assistente";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente IA — Cátia Creator" },
      {
        name: "description",
        content: "Conversa com o assistente Cátia Creator sobre o método, conteúdo, vendas e IA.",
      },
    ],
  }),
  component: Assistente,
});
