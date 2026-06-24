import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";

export const Route = createFileRoute("/metodo/pilar-4/passo-a-passo")({
  component: () => (
    <Pilar4Page
      etapa="Etapa 1 · Caminho B"
      titulo="Caminho Passo a Passo"
      emBreve
      emBreveTexto="Em breve você vai estudar cada bloco de estratégia de venda no seu ritmo. 8 blocos disponíveis."
    />
  ),
});
