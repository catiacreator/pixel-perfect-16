import { createFileRoute } from "@tanstack/react-router";
import Ferramentas from "@/page-views/Ferramentas";

export const Route = createFileRoute("/ferramentas")({
  head: () => ({ meta: [{ title: "Ferramentas Essenciais — Cátia Creator" }] }),
  component: () => (
    <div className="theme-jornada">
      <Ferramentas />
    </div>
  ),
});
