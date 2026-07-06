import { createFileRoute } from "@tanstack/react-router";
import Saude from "@/page-views/Saude";

export const Route = createFileRoute("/metodo/saude")({
  head: () => ({
    meta: [
      { title: "Área da Saúde — Cátia Creator" },
      { name: "description", content: "Caminho por segmento: IA para profissionais de saúde." },
    ],
  }),
  component: () => (
    <div className="theme-jornada">
      <Saude />
    </div>
  ),
});
