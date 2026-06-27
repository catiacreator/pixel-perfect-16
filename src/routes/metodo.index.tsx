import { createFileRoute } from "@tanstack/react-router";
import Jornada from "@/page-views/Jornada";

export const Route = createFileRoute("/metodo/")({
  head: () => ({ meta: [{ title: "A sua jornada — Leveza no Digital" }] }),
  component: () => (
    <div className="theme-jornada">
      <Jornada />
    </div>
  ),
});
