import { createFileRoute } from "@tanstack/react-router";
import PilarSidebar from "@/components/PilarSidebar";
import MaquinaAnalises from "@/page-views/MaquinaAnalises";

// A Máquina de Análises pertence ao módulo "Conteúdo Todo Dia", por isso mostra
// o mesmo menu do curso (à esquerda) e o link de voltar, como as outras páginas.
function MaquinaAnalisesRoute() {
  return (
    <div className="theme-redes">
      <PilarSidebar pilar="redes" />
      <div className="lg:pl-[280px]">
        <MaquinaAnalises />
      </div>
    </div>
  );
}

export const Route = createFileRoute("/maquina-analises")({
  head: () => ({ meta: [{ title: "Máquina de Análises — Cátia Creator" }] }),
  component: MaquinaAnalisesRoute,
});
