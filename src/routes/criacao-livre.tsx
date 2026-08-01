import { createFileRoute } from "@tanstack/react-router";
import CriacaoLivre from "@/page-views/CriacaoLivre";

export const Route = createFileRoute("/criacao-livre")({
  head: () => ({ meta: [{ title: "Criação Livre — Cátia Creator" }] }),
  component: () => (
    <div className="theme-redes">
      <CriacaoLivre />
    </div>
  ),
});
