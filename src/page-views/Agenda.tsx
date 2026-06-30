import Layout from "../components/Layout";
import AgendaBoard from "../components/AgendaBoard";
import { CalendarDays } from "lucide-react";

export default function Agenda() {
  return (
    <Layout>
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 pt-10 md:pt-14 pb-20">
        <div className="flex items-center gap-3 mb-2">
          <span className="w-11 h-11 rounded-2xl bg-terracotta text-cream flex items-center justify-center shrink-0">
            <CalendarDays size={20} strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta">/ A minha Agenda</p>
            <h1 className="font-display text-3xl md:text-5xl tracking-[-0.025em] text-ink leading-[1]">
              O seu quadro de tarefas
            </h1>
          </div>
        </div>
        <p className="text-sm text-ink/55 mb-8 max-w-2xl">
          Organize o que tem para fazer, arraste entre as colunas e anexe aulas a cada tarefa.
        </p>

        <AgendaBoard />
      </div>
    </Layout>
  );
}
