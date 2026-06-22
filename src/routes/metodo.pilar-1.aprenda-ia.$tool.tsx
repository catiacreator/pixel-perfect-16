import { createFileRoute } from "@tanstack/react-router";
import ToolHub from "@/page-views/pilar1/ToolHub";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/$tool")({
  head: () => ({ meta: [{ title: "Ferramenta — Paraíso Digital" }] }),
  component: ToolHub,
});
