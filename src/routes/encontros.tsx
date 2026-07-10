import { createFileRoute } from "@tanstack/react-router";
import Encontros from "@/page-views/Encontros";

export const Route = createFileRoute("/encontros")({
  head: () => ({
    meta: [
      { title: "Encontros — Mentoria ao vivo" },
      { name: "description", content: "Sessões em direto com a Cátia Creator: dúvidas, feedback e acompanhamento em grupo." },
    ],
  }),
  component: Encontros,
});
