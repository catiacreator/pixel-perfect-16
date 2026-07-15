import { createFileRoute } from "@tanstack/react-router";
import MiniCursoOculto from "@/page-views/MiniCursoOculto";

export const Route = createFileRoute("/mini-curso-oculto")({
  head: () => ({ meta: [{ title: "Mini-curso" }] }),
  component: MiniCursoOculto,
});
