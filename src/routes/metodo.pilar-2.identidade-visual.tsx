import { createFileRoute } from "@tanstack/react-router";
import IdentidadeVisual from "@/page-views/pilar2/IdentidadeVisual";

export const Route = createFileRoute("/metodo/pilar-2/identidade-visual")({
  head: () => ({ meta: [{ title: "Identidade Visual — Paraíso Digital" }] }),
  component: IdentidadeVisual,
});
