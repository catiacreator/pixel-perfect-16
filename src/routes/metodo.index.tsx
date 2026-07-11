import { createFileRoute } from "@tanstack/react-router";
import Jornada from "@/page-views/Jornada";

export const Route = createFileRoute("/metodo/")({
  head: () => ({ meta: [{ title: "O Teu Método — Cátia Creator" }] }),
  component: () => (
    <div className="theme-jornada">
      <Jornada />
    </div>
  ),
});
