import { createFileRoute } from "@tanstack/react-router";
import Agenda from "@/page-views/Agenda";

export const Route = createFileRoute("/agenda")({
  head: () => ({
    meta: [
      { title: "A minha Agenda — Cátia Creator" },
      { name: "description", content: "O seu quadro de tarefas tipo kanban, com aulas anexadas." },
    ],
  }),
  component: Agenda,
});
