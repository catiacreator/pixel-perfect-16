import { createFileRoute } from "@tanstack/react-router";
import FormatosHub from "@/page-views/FormatosHub";

export const Route = createFileRoute("/formatos")({
  head: () => ({ meta: [{ title: "Formatos de Conteúdo — Cátia Creator" }] }),
  component: () => (
    <div className="theme-redes">
      <FormatosHub />
    </div>
  ),
});
