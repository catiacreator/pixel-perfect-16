import { createFileRoute } from "@tanstack/react-router";
import InstalarSkills from "@/page-views/pilar1/InstalarSkills";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/claude/instalar-skills")({
  head: () => ({ meta: [{ title: "Instalar Skills — Paraíso Digital" }] }),
  component: InstalarSkills,
});
