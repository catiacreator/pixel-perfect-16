import { createFileRoute } from "@tanstack/react-router";
import Identidade from "@/page-views/pilar2/Identidade";

export const Route = createFileRoute("/metodo/pilar-2/identidade")({
  head: () => ({ meta: [{ title: "Identidade — Leveza no Digital" }] }),
  component: Identidade,
});
