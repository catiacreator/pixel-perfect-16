import { createFileRoute } from "@tanstack/react-router";
import InstagramFormato from "@/page-views/pilar2/InstagramFormato";

export const Route = createFileRoute("/metodo/pilar-2/redes-sociais/instagram/$formato")({
  head: () => ({ meta: [{ title: "Formato — Cátia Creator" }] }),
  component: InstagramFormato,
});
