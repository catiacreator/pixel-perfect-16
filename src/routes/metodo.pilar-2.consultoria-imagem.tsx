import { createFileRoute } from "@tanstack/react-router";
import ConsultoriaImagem from "@/page-views/pilar2/ConsultoriaImagem";

export const Route = createFileRoute("/metodo/pilar-2/consultoria-imagem")({
  head: () => ({ meta: [{ title: "Consultoria de Imagem — Leveza no Digital" }] }),
  component: ConsultoriaImagem,
});
