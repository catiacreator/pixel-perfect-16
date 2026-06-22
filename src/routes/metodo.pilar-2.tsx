import { createFileRoute } from "@tanstack/react-router";
import Pilar2Hub from "@/page-views/pilar2/Pilar2Hub";

export const Route = createFileRoute("/metodo/pilar-2")({
  head: () => ({ meta: [{ title: "Pilar 2 — Leveza no Digital" }] }),
  component: Pilar2Hub,
});
