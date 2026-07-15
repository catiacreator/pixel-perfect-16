import { createFileRoute } from "@tanstack/react-router";
import CriarProduto from "@/page-views/CriarProduto";

export const Route = createFileRoute("/criar-produto")({
  head: () => ({
    meta: [
      { title: "Criar Produto — do zero à venda" },
      { name: "description", content: "Ideias de produto, landing page, stories e posts prontos a copiar (ChatGPT/Claude), no método Cat.IA." },
    ],
  }),
  component: CriarProduto,
});
