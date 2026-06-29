import { useState } from "react";
import { CalendarPlus, Plus, Check, X } from "lucide-react";
import { loadAgenda, anexarAula, criarTarefa, type AgendaAula, type Tarefa } from "@/lib/agenda-storage";

/**
 * Botão "Adicionar à Agenda" — anexa a aula atual a uma tarefa do kanban
 * (existente ou nova). Pode ser usado em qualquer página de aula.
 */
export default function AddToAgenda({ aula }: { aula: AgendaAula }) {
  const [open, setOpen] = useState(false);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [novo, setNovo] = useState("");
  const [feito, setFeito] = useState<string | null>(null);

  const abrir = () => {
    setTarefas(loadAgenda().tarefas);
    setFeito(null);
    setNovo("");
    setOpen(true);
  };

  const anexar = (id: string, label: string) => {
    anexarAula(id, aula);
    setTarefas(loadAgenda().tarefas);
    setFeito(label);
  };

  const criar = () => {
    const titulo = novo.trim() || aula.titulo;
    criarTarefa(titulo, "todo", aula);
    setTarefas(loadAgenda().tarefas);
    setNovo("");
    setFeito(titulo);
  };

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        onClick={open ? () => setOpen(false) : abrir}
        className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-terracotta/40 text-terracotta hover:bg-terracotta hover:text-cream transition-colors"
      >
        <CalendarPlus size={15} /> Adicionar à Agenda
      </button>

      {open && (
        <>
          <span className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 left-0 top-11 w-[min(92vw,340px)] rounded-2xl border border-[var(--color-border)] glass shadow-[0_24px_60px_-24px_rgba(90,40,25,0.35)] p-4 text-left">
            <div className="flex items-start justify-between gap-3 mb-3">
              <p className="text-[11px] tracking-[0.18em] uppercase text-terracotta">Anexar esta aula</p>
              <button onClick={() => setOpen(false)} className="text-ink/40 hover:text-ink" aria-label="Fechar">
                <X size={15} />
              </button>
            </div>

            {feito ? (
              <div className="flex items-center gap-2 text-sm text-success py-2">
                <Check size={15} /> Anexada a “{feito}”.
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <div className="flex gap-2">
                    <input
                      value={novo}
                      onChange={(e) => setNovo(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && criar()}
                      placeholder="Criar tarefa nova…"
                      className="flex-1 rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta"
                    />
                    <button
                      onClick={criar}
                      className="shrink-0 inline-flex items-center justify-center w-9 rounded-lg bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
                      aria-label="Criar tarefa"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {tarefas.length > 0 && (
                  <>
                    <p className="text-[11px] tracking-[0.14em] uppercase text-ink/40 mb-1.5">Ou anexar a:</p>
                    <div className="max-h-52 overflow-y-auto space-y-1">
                      {tarefas.map((t) => {
                        const jaTem = t.aulas.some((a) => a.url === aula.url);
                        return (
                          <button
                            key={t.id}
                            disabled={jaTem}
                            onClick={() => anexar(t.id, t.titulo || "Sem título")}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm hover:bg-cream-warm disabled:opacity-50 disabled:cursor-default transition-colors"
                          >
                            <span className="flex-1 truncate text-ink">{t.titulo || "Sem título"}</span>
                            {jaTem && <Check size={13} className="text-success shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </>
      )}
    </span>
  );
}
