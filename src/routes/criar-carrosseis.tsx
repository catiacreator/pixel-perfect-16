import { createFileRoute } from "@tanstack/react-router";
import CriarCarrosseis from "@/page-views/CriarCarrosseis";

export const Route = createFileRoute("/criar-carrosseis")({
  head: () => ({ meta: [{ title: "Criar no Carousel Snap — Cátia Creator" }] }),
  component: () => (
    <div className="theme-redes">
      <CriarCarrosseis />
    </div>
  ),
});
