import { createFileRoute } from "@tanstack/react-router";
import Jornada from "@/page-views/Jornada";

export const Route = createFileRoute("/metodo/")({
  head: () => ({ meta: [{ title: "A sua jornada — Cátia Creator" }] }),
  component: () => (
    <div className="theme-jornada">
      <Jornada />
    </div>
  ),
});
