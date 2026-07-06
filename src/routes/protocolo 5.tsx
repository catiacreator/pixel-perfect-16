import { createFileRoute } from "@tanstack/react-router";
import ProtocoloViral from "@/page-views/ProtocoloViral";

export const Route = createFileRoute("/protocolo 5")({
  head: () => ({
    meta: [
      { title: "Protocolo Viral — não é sorte, é método" },
      { name: "description", content: "A mentoria de criação e viralização no Instagram: a tua jornada + criar para o Instagram." },
    ],
  }),
  component: ProtocoloViral,
});
