import { createFileRoute } from "@tanstack/react-router";
import Assistente from "@/page-views/Assistente";

export const Route = createFileRoute("/assistente")({
  head: () => ({
    meta: [
      { title: "Assistente IA — Leveza no Digital" },
      {
        name: "description",
        content: "Conversa com o assistente Leveza no Digital sobre o método, conteúdo, vendas e IA.",
      },
    ],
  }),
  component: Assistente,
});
