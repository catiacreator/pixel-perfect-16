import { createFileRoute } from "@tanstack/react-router";
import { Pilar4Page } from "@/page-views/pilar4/Pilar4Page";

export const Route = createFileRoute("/metodo/pilar-4/low-ticket")({
  component: () => (
    <Pilar4Page
      etapa="Etapa 5 · Escala"
      titulo="Venda de low ticket"
      subtitulo="Produtos até R$ 197 — estratégia diferente, escala diferente."
      emBreve
      emBreveTexto="Em breve você vai aprender validação, recuperar vendas e escalar produtos low ticket."
    />
  ),
});
