import { createFileRoute } from "@tanstack/react-router";
import Produtividade from "@/page-views/pilar1/Produtividade";

export const Route = createFileRoute("/metodo/pilar-1/aprenda-ia/produtividade")({
  head: () => ({ meta: [{ title: "Ferramentas de produtividade — Cátia Creator" }] }),
  component: Produtividade,
});
