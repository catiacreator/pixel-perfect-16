import { useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import { Link } from "@/lib/router-compat";
import {
  COLUNAS,
  ColunaId,
  Tarefa,
  AgendaState,
  loadAgenda,
  saveAgenda,
  uid,
} from "@/lib/agenda-storage";
import { CalendarDays, Plus, X, Trash2, GripVertical, Link2 } from "lucide-react";

export default function Agenda() {
  const [state, setState] = useState<AgendaState>({ tarefas: [] });
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState<Tarefa | null>(null);
  const [dragOver, setDragOver] = useState<ColunaId | null>(null);
  const dragId = useRef<string | null>(null);

  useEffect(() => {
    const load = () => setState(loadAgenda());
    load();
    setHydrated(true);
    window.addEventListener("leveza:hydrated", load);
    return () => window.removeEventListener("leveza:hydrated", load);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveAgenda(state);
  }, [state, hydrated]);

  const upd = (id: string, patch: Partial<Tarefa>) =>
    setState((s) => ({ tarefas: s.tarefas.map((t) => (t.id === id ? { ...t, ...patch } : t)) }));

  const remover = (id: string) =>
    setState((s) => ({ tarefas: s.tarefas.filter((t) => t.id !== id) }));

  const novaTarefa = (coluna: ColunaId) => {
    const nova: Tarefa = { id: uid(), titulo: "", notas: "", coluna, aulas: [], criadaEm: Date.now() };
    setState((s) => ({ tarefas: [...s.tarefas, nova] }));
    setEditing(nova);
  };

  const mover = (id: string, coluna: ColunaId) => upd(id, { coluna });

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

        <div className="grid md:grid-cols-3 gap-4 md:gap-5">
          {COLUNAS.map((col) => {
            const tarefas = state.tarefas.filter((t) => t.coluna === col.id);
            return (
              <div
                key={col.id}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(col.id);
                }}
                onDragLeave={() => setDragOver((c) => (c === col.id ? null : c))}
                onDrop={() => {
                  if (dragId.current) mover(dragId.current, col.id);
                  dragId.current = null;
                  setDragOver(null);
                }}
                className={`rounded-2xl border p-3 transition-colors min-h-[160px] ${
                  dragOver === col.id ? "border-terracotta bg-terracotta/[0.06]" : "border-[var(--color-border)] bg-cream-warm/40"
                }`}
              >
                <div className="flex items-center justify-between px-2 py-1.5 mb-2">
                  <span className="text-[11px] tracking-[0.18em] uppercase text-ink/60 font-medium">
                    {col.titulo}
                  </span>
                  <span className="text-[11px] text-ink/40 tabular-nums">{tarefas.length}</span>
                </div>

                <div className="space-y-2.5">
                  {tarefas.map((t) => (
                    <article
                      key={t.id}
                      draggable
                      onDragStart={() => (dragId.current = t.id)}
                      onDragEnd={() => (dragId.current = null)}
                      onClick={() => setEditing(t)}
                      className="group bg-white rounded-xl border border-[var(--color-border)] p-3.5 shadow-sm cursor-pointer hover:border-terracotta/45 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical size={14} className="text-ink/25 mt-0.5 shrink-0" />
                        <p className="flex-1 text-sm text-ink leading-snug font-medium">
                          {t.titulo || <span className="text-ink/35">Sem título</span>}
                        </p>
                      </div>
                      {t.notas && <p className="text-xs text-ink/50 mt-1.5 line-clamp-2 pl-6">{t.notas}</p>}
                      {t.aulas.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5 pl-6">
                          {t.aulas.map((a) => (
                            <Link
                              key={a.url}
                              to={a.url}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-terracotta/[0.08] text-terracotta hover:bg-terracotta/15 transition-colors max-w-full"
                            >
                              <Link2 size={10} className="shrink-0" />
                              <span className="truncate">{a.titulo}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                <button
                  onClick={() => novaTarefa(col.id)}
                  className="mt-2.5 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-ink/55 hover:text-terracotta hover:bg-white border border-dashed border-[var(--color-border)] transition-colors"
                >
                  <Plus size={15} /> Adicionar tarefa
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {editing && (
        <EditModal
          tarefa={state.tarefas.find((t) => t.id === editing.id) ?? editing}
          onClose={() => setEditing(null)}
          onChange={(patch) => upd(editing.id, patch)}
          onDelete={() => {
            remover(editing.id);
            setEditing(null);
          }}
          onMover={(c) => mover(editing.id, c)}
        />
      )}
    </Layout>
  );
}

function EditModal({
  tarefa,
  onClose,
  onChange,
  onDelete,
  onMover,
}: {
  tarefa: Tarefa;
  onClose: () => void;
  onChange: (patch: Partial<Tarefa>) => void;
  onDelete: () => void;
  onMover: (c: ColunaId) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[var(--color-border)] shadow-xl p-6 mt-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta">Editar tarefa</p>
          <button onClick={onClose} className="text-ink/50 hover:text-ink" aria-label="Fechar">
            <X size={18} />
          </button>
        </div>

        <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Título</label>
        <input
          autoFocus
          value={tarefa.titulo}
          onChange={(e) => onChange({ titulo: e.target.value })}
          placeholder="O que precisa de fazer?"
          className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta mb-4"
        />

        <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1">Notas</label>
        <textarea
          value={tarefa.notas}
          onChange={(e) => onChange({ notas: e.target.value })}
          rows={3}
          placeholder="Detalhes, links, lembretes…"
          className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta resize-none mb-4"
        />

        <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1.5">Coluna</label>
        <div className="flex gap-2 mb-4">
          {COLUNAS.map((c) => (
            <button
              key={c.id}
              onClick={() => onMover(c.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                tarefa.coluna === c.id
                  ? "bg-terracotta text-cream border-terracotta"
                  : "border-border text-ink/60 hover:border-terracotta/50"
              }`}
            >
              {c.titulo}
            </button>
          ))}
        </div>

        {tarefa.aulas.length > 0 && (
          <div className="mb-4">
            <label className="text-[11px] tracking-[0.18em] uppercase text-muted block mb-1.5">Aulas anexadas</label>
            <div className="space-y-1.5">
              {tarefa.aulas.map((a) => (
                <div key={a.url} className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
                  <Link2 size={13} className="text-terracotta shrink-0" />
                  <span className="flex-1 text-sm text-ink truncate">{a.titulo}</span>
                  <button
                    onClick={() => onChange({ aulas: tarefa.aulas.filter((x) => x.url !== a.url) })}
                    className="text-ink/40 hover:text-terracotta"
                    aria-label="Remover aula"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
          <button
            onClick={onDelete}
            className="inline-flex items-center gap-1.5 text-sm text-ink/55 hover:text-terracotta transition-colors"
          >
            <Trash2 size={14} /> Eliminar
          </button>
          <button
            onClick={onClose}
            className="text-sm font-semibold px-4 py-2 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
