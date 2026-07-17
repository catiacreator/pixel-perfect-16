import { createFileRoute } from "@tanstack/react-router";
import MaquinaAnalises from "@/page-views/MaquinaAnalises";

export const Route = createFileRoute("/maquina-analises")({
  head: () => ({ meta: [{ title: "Máquina de Análises — Cátia Creator" }] }),
  component: MaquinaAnalises,
});
