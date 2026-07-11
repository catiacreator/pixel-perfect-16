import { createFileRoute } from "@tanstack/react-router";
import MiniCurso from "@/page-views/MiniCurso";

export const Route = createFileRoute("/conteudo-ia")({
  head: () => ({
    meta: [
      { title: "Primeiro Mês de Posts — Mini-curso grátis" },
      { name: "description", content: "Aulas grátis para criar conteúdo com IA e publicar com consistência. A porta de entrada para o método completo." },
    ],
  }),
  component: MiniCurso,
});
