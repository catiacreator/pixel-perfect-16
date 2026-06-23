import { createFileRoute } from "@tanstack/react-router";
import MinhaBase from "@/page-views/MinhaBase";

export const Route = createFileRoute("/minha-base")({
  head: () => ({
    meta: [
      { title: "Minha base — Leveza no Digital" },
      { name: "description", content: "Sua jornada, documentos, rotina do dia, calendário e conquistas." },
    ],
  }),
  component: MinhaBase,
});
