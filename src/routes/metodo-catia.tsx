import { createFileRoute } from "@tanstack/react-router";
import MetodoCatia from "@/page-views/MetodoCatia";

export const Route = createFileRoute("/metodo-catia")({
  head: () => ({ meta: [{ title: "Método Cat.IA — Interno" }] }),
  component: MetodoCatia,
});
