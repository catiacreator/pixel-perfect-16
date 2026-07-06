import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Plus, Trash2, Users, Lock, X, Check } from "lucide-react";
import { notify } from "@/lib/toast";
import { getTurmas, setTurmas, listMentoradas } from "@/lib/admin.functions";
import { ESTRUTURA, type Nodo, type NodoTipo } from "@/lib/estrutura";
import { CORES_TURMA, novoTurmaId, type Turma } from "@/lib/turmas";

export const Route = createFileRoute("/_authenticated/admin/turmas 8")({
  component: TurmasPage,
});

const TIPO_LABEL: Record<NodoTipo, string> = {
  modulo: "Módulo", pilar: "Pilar", pagina: "Página", subpagina: "Subpágina",
};

function TurmasPage() {
  const fetchTurmas = useServerFn(getTurmas);
  const fetchAlunos = useServerFn(listMentoradas);
  const save = useServerFn(setTurmas);
  const qc = useQueryClient();

  const { data: turmasData } = useSuspenseQuery({ queryKey: ["admin-turmas"], queryFn: () => fetchTurmas() });
  const { data: alunosData } = useSuspenseQuery({ queryKey: ["admin-mentoradas"], queryFn: () => fetchAlunos() });
  const alunos = (alunosData as { id: string; nome?: string; email?: string }[]) || [];
  const nomeAluno = (id: string) => {
    const a = alunos.find((x) => x.id === id);
    return a?.nome || a?.email || "Aluno";
  };

  const turmas = (turmasData as Turma[]) || [];
  const [selId, setSelId] = useState<string | null>(turmas[0]?.id ?? null);

  const mut = useMutation({
    mutationFn: (next: Turma[]) => save({ data: { turmas: next } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-turmas"] }),
    onError: (e: unknown) => notify(e instanceof Error ? e.message : "Erro ao guardar", "error"),
  });
  const persist = (next: Turma[]) => mut.mutate(next);

  const sel = turmas.find((t) => t.id === selId) || null;

  function criarTurma() {
    const nome = `Turma ${turmas.length + 1}`;
    const nova: Turma = {
      id: novoTurmaId(nome, turmas.length),
      nome,
      cor: CORES_TURMA[turmas.length % CORES_TURMA.length],
      membros: [],
      acessos: [],
    };
    persist([...turmas, nova]);
    setSelId(nova.id);
  }
  function apagarTurma(id: string) {
    if (!window.confirm("Apagar esta turma? Os alunos deixam de ter as permissões dela.")) return;
    const next = turmas.filter((t) => t.id !== id);
    persist(next);
    if (selId === id) setSelId(next[0]?.id ?? null);
  }
  function editar(id: string, patch: Partial<Turma>) {
    persist(turmas.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function toggleAcesso(id: string, nodeId: string) {
    const t = turmas.find((x) => x.id === id);
    if (!t) return;
    const has = t.acessos.includes(nodeId);
    editar(id, { acessos: has ? t.acessos.filter((a) => a !== nodeId) : [...t.acessos, nodeId] });
  }
  function removerMembro(id: string, uid: string) {
    const t = turmas.find((x) => x.id === id);
    if (!t) return;
    editar(id, { membros: t.membros.filter((m) => m !== uid) });
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-terracotta mb-1">Leveza no Digital</p>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Turmas</h1>
          <p className="text-sm text-ink/55 mt-0.5 max-w-xl">
            Crie turmas (grupos de alunos) e escolha o que cada turma pode ver. Os alunos são atribuídos na tabela de{" "}
            <b>Alunos</b>. Um aluno numa turma só vê o que a turma permite.
          </p>
        </div>
        <button
          onClick={criarTurma}
          className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors shrink-0"
        >
          <Plus size={16} /> Nova turma
        </button>
      </div>

      {turmas.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] bg-white p-10 text-center">
          <Users size={26} className="mx-auto text-ink/30 mb-3" />
          <p className="text-sm text-ink/55">Ainda não há turmas. Crie a primeira para começar a dar permissões por grupo.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-5">
          {/* Lista de turmas */}
          <div className="space-y-2">
            {turmas.map((t) => {
              const on = t.id === selId;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelId(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-colors ${on ? "border-terracotta bg-terracotta/5" : "border-[var(--color-border)] bg-white hover:border-terracotta/40"}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.cor || "#999" }} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">{t.nome}</span>
                    <span className="block text-[11px] text-ink/45">{t.membros.length} aluno(s) · {t.acessos.length} acesso(s)</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Editor da turma selecionada */}
          {sel && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <div className="flex items-center gap-3 mb-4">
                <input
                  value={sel.nome}
                  onChange={(e) => editar(sel.id, { nome: e.target.value })}
                  className="flex-1 text-lg font-semibold text-ink bg-transparent outline-none border-b border-transparent focus:border-terracotta/40 py-1"
                />
                <div className="flex items-center gap-1">
                  {CORES_TURMA.slice(0, 6).map((c) => (
                    <button
                      key={c}
                      onClick={() => editar(sel.id, { cor: c })}
                      className={`w-5 h-5 rounded-full transition-transform ${sel.cor === c ? "ring-2 ring-offset-1 ring-ink/30 scale-110" : ""}`}
                      style={{ background: c }}
                      aria-label={`Cor ${c}`}
                    />
                  ))}
                </div>
                <button onClick={() => apagarTurma(sel.id)} className="text-ink/40 hover:text-rose-600 p-1.5" aria-label="Apagar turma">
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Membros */}
              <div className="mb-5">
                <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Alunos ({sel.membros.length})</p>
                {sel.membros.length === 0 ? (
                  <p className="text-[13px] text-ink/45">Sem alunos. Atribua alunos a esta turma na tabela <b>Alunos</b>.</p>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {sel.membros.map((uid) => (
                      <span key={uid} className="inline-flex items-center gap-1.5 text-[12px] bg-cream-warm/60 border border-[var(--color-border)] rounded-full pl-2.5 pr-1.5 py-1">
                        {nomeAluno(uid)}
                        <button onClick={() => removerMembro(sel.id, uid)} className="text-ink/40 hover:text-rose-600" aria-label="Remover">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Permissões (acesso à estrutura) */}
              <p className="text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Permissões — o que esta turma vê</p>
              <div className="rounded-xl border border-[var(--color-border)] px-3 py-1">
                <AccessTree turma={sel} onToggle={(nid) => toggleAcesso(sel.id, nid)} />
              </div>
              <p className="text-[11px] text-ink/40 mt-2">Dar acesso a um módulo/pilar dá acesso também às suas páginas.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AccessTree({ turma, onToggle }: { turma: Turma; onToggle: (id: string) => void }) {
  const grants = new Set(turma.acessos);
  const render = (nodos: Nodo[], depth: number, paiConcedido: boolean) =>
    nodos.map((n) => {
      const raw = grants.has(n.id);
      const efetivo = raw || paiConcedido;
      return (
        <div key={n.id}>
          <div className="flex items-center gap-2.5 py-2 border-b border-[var(--color-border)]" style={{ paddingLeft: depth * 20 }}>
            <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full font-semibold bg-ink/5 text-ink/45 shrink-0">{TIPO_LABEL[n.tipo]}</span>
            <span className={`text-[13px] flex-1 min-w-0 truncate ${efetivo ? "text-ink" : "text-ink/45"}`}>{n.label}</span>
            {paiConcedido ? (
              <span className="text-[11px] text-emerald-600/70 italic shrink-0">herdado</span>
            ) : (
              <button
                onClick={() => onToggle(n.id)}
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors shrink-0 ${raw ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-ink/[0.03] border-[var(--color-border)] text-ink/45 hover:text-ink"}`}
              >
                {raw ? <Check size={11} /> : <Lock size={11} />}
                {raw ? "Com acesso" : "Sem acesso"}
              </button>
            )}
          </div>
          {n.filhos && render(n.filhos, depth + 1, efetivo)}
        </div>
      );
    });
  return <>{render(ESTRUTURA, 0, false)}</>;
}
