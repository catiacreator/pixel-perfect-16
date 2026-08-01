import { createFileRoute } from "@tanstack/react-router";
import MaquinaAnalises from "@/page-views/MaquinaAnalises";

// A Máquina de Análises abre a partir do fluxo da jornada, sem menu lateral.
function MaquinaAnalisesRoute() {
  return (
    <div className="theme-redes">
      <MaquinaAnalises />
    </div>
  );
}

export const Route = createFileRoute("/maquina-analises")({
  head: () => ({ meta: [{ title: "Máquina de Análises — Cátia Creator" }] }),
  component: MaquinaAnalisesRoute,
});
