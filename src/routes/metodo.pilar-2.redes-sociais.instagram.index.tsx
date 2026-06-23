import { createFileRoute } from "@tanstack/react-router";
import Instagram from "@/page-views/pilar2/Instagram";

export const Route = createFileRoute("/metodo/pilar-2/redes-sociais/instagram/")({
  head: () => ({ meta: [{ title: "Instagram — Leveza no Digital" }] }),
  component: Instagram,
});
