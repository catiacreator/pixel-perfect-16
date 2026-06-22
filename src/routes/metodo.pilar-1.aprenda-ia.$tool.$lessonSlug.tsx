import { createFileRoute } from "@tanstack/react-router";
import AulaPage from "@/page-views/pilar1/AulaPage";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/$tool/$lessonSlug")({
  head: () => ({ meta: [{ title: "Aula — Leveza no Digital" }] }),
  component: AulaPage,
});
