import { createFileRoute } from "@tanstack/react-router";
import EstudioCreator from "@/page-views/EstudioCreator";

export const Route = createFileRoute("/estudio-creator")({
  head: () => ({ meta: [{ title: "Estúdio Creator — Interno" }] }),
  component: EstudioCreator,
});
