import { createFileRoute } from "@tanstack/react-router";
import Glossario from "@/page-views/Glossario";

export const Route = createFileRoute("/glossario")({
  head: () => ({
    meta: [
      { title: "Glossário de IA — Cátia Creator" },
      { name: "description", content: "Os termos técnicos da mentoria, explicados de forma simples." },
    ],
  }),
  component: Glossario,
});
