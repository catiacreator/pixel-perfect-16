import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";

export const Route = createFileRoute("/metodo/pilar-4/trafego-pago")({
  component: () => (
    <Pilar4Page
      etapa="Etapa 8 · Anúncio"
      titulo="Tráfego pago"
      subtitulo="Meta Ads + Criativos."
      emBreve
      emBreveTexto="Em breve você vai aprender tráfego pago para escalar suas vendas."
    />
  ),
});
