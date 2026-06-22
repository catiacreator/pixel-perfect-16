import { createFileRoute } from "@tanstack/react-router";
import RedesSociais from "@/page-views/pilar2/RedesSociais";

export const Route = createFileRoute("/metodo/pilar-2/redes-sociais")({
  head: () => ({ meta: [{ title: "Redes Sociais — Paraíso Digital" }] }),
  component: RedesSociais,
});
