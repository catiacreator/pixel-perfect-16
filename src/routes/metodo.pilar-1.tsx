import { createFileRoute } from "@tanstack/react-router";
import Pilar1Hub from "@/page-views/pilar1/Pilar1Hub";

export const Route = createFileRoute("/metodo/pilar-1")({
  head: () => ({ meta: [{ title: "Pilar 1 — Paraíso Digital" }] }),
  component: Pilar1Hub,
});
