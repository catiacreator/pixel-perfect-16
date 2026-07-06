import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Plus, Trash2, Users, X, Save } from "lucide-react";
import { notify } from "@/lib/toast";
import { getTurmas, setTurmas, listMentoradas } from "@/lib/admin.functions";
import { CORES_TURMA, novoTurmaId, type Turma } from "@/lib/turmas";
import AcessoArvore from "@/components/admin/AcessoArvore";

export const Route = createFileRoute("/_authenticated/admin/turmas")({
  component: TurmasPage,
});

function TurmasPage() {
  const fetchTurmas = useServerFn(getTurmas);
  const fetchAlunos = useServerFn(listMentoradas);
  const save = useServerFn(setTurmas);
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: turmasData } = useSuspenseQuery({ queryKey: ["admin-turmas"], queryFn: () => fetchTurmas() });
  const { data: alunosData } = useSuspenseQuery({ queryKey: ["admin-mentoradas"], queryFn: () => fetchAlunos() });
  type AlunoLinha = { id: string; nome?: string; email?: string; tier?: string; pontos?: number };
  const alunos = (alunosData as AlunoLinha[]) || [];
  const nomeAluno = (id: string) => {
    const a = alunos.find((x) => x.id === id);
    return a?.nome || a?.email || "Aluno";
  };

  const serverTurmas = (turmasData as Turma[]) || [];
  // Edição local — só grava quando clica em "Guardar alterações".
  const [turmas, setTurmas_] = useState<Turma[]>(serverTurmas);
  const [dirty, setDirty] = useState(false);
  const [selId, setSelId] = useState<string | null>(serverTurmas[0]?.id ?? null);
  const [tabTurma, setTabTurma] = useState<string | null>(null);

  // Re-sincroniza com o servidor quando não há alterações por guardar (carga inicial / após guardar).
  useEffect(() => { if (!dirty) setTurmas_(serverTurmas); /* eslint-disable-next-line */ }, [turmasData, dirty]);

  const mut = useMutation({
    mutationFn: (next: Turma[]) => save({ data: { turmas: next } }),
    onSuccess: () => { setDirty(false); notify("Alterações guardadas ✓", "success"); qc.invalidateQueries({ queryKey: ["admin-turmas"] }); },
    onError: (e: unknown) => notify(e instanceof Error ? e.message : "Erro ao guardar", "error"),
  });
  const guardar = () => mut.mutate(turmas);

  const editarLocal = (fn: (ts: Turma[]) => Turma[]) => { setTurmas_((ts) => fn(ts)); setDirty(true); };

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
    editarLocal((ts) => [...ts, nova]);
    setSelId(nova.id);
  }
  function apagarTurma(id: string) {
    if (!window.confirm("Apagar esta turma? Os alunos deixam de ter as permissões dela.")) return;
    editarLocal((ts) => ts.filter((t) => t.id !== id));
    if (selId === id) setSelId(turmas.find((t) => t.id !== id)?.id ?? null);
  }
  function editar(id: string, patch: Partial<Turma>) {
    editarLocal((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function setAcessos(id: string, next: string[]) {
    editar(id, { acessos: next });
  }
  function removerMembro(id: string, uid: string) {
    editarLocal((ts) => ts.map((t) => (t.id === id ? { ...t, membros: t.membros.filter((m) => m !== uid) } : t)));
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
        <div className="flex items-center gap-2 shrink-0">
          {dirty && <span className="text-[12px] text-amber-600 font-medium hidden sm:inline">Alterações por guardar</span>}
          <button
            onClick={criarTurma}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-full border border-[var(--color-border)] bg-white text-ink text-sm font-semibold hover:border-terracotta/50 transition-colors"
          >
            <Plus size={16} /> Nova turma
          </button>
          <button
            onClick={guardar}
            disabled={!dirty || mut.isPending}
            className="inline-flex items-center gap-2 h-10 px-5 rounded-full bg-ink text-cream text-sm font-semibold hover:bg-terracotta transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save size={15} /> {mut.isPending ? "A guardar…" : "Guardar alterações"}
          </button>
        </div>
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
                <div
                  key={t.id}
                  onClick={() => setSelId(t.id)}
                  className={`group w-full flex items-center gap-2.5 px-3.5 py-3 rounded-xl border text-left transition-colors cursor-pointer ${on ? "border-terracotta bg-terracotta/5" : "border-[var(--color-border)] bg-white hover:border-terracotta/40"}`}
                >
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: t.cor || "#999" }} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-ink truncate">{t.nome}</span>
                    <span className="block text-[11px] text-ink/45">{t.membros.length} aluno(s) · {t.acessos.length} acesso(s)</span>
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); apagarTurma(t.id); }}
                    className="text-ink/30 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    aria-label={`Apagar ${t.nome}`}
                    title="Apagar turma"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
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
                  placeholder="Nome da turma"
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
              <AcessoArvore grants={sel.acessos} onChange={(next) => setAcessos(sel.id, next)} />
              <p className="text-[11px] text-ink/40 mt-2">Dar acesso a um módulo dá acesso às suas páginas. Para escolher página a página, deixe o módulo sem acesso e ligue as que quiser.</p>
            </div>
          )}
        </div>
      )}

      {/* Alunos por turma — tabs para navegar e ver quem está em cada turma */}
      {turmas.length > 0 && (() => {
        const tabAtual = tabTurma ?? turmas[0]?.id ?? null;
        const membros = turmas.find((t) => t.id === tabAtual)?.membros ?? [];
        const alunosTab = membros
          .map((uid) => alunos.find((a) => a.id === uid))
          .filter((a): a is AlunoLinha => !!a);
        return (
          <div className="mt-10">
            <h2 className="text-base font-semibold text-ink">Alunos por turma</h2>
            <p className="text-[13px] text-ink/55 mb-3">Clique num aluno para o abrir na tabela de <b>Alunos</b>.</p>

            <div className="flex gap-2 flex-wrap mb-3">
              {turmas.map((t) => {
                const on = t.id === tabAtual;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTabTurma(t.id)}
                    className={`inline-flex items-center gap-2 text-[13px] px-3.5 py-1.5 rounded-full border transition-colors ${on ? "bg-ink text-cream border-transparent" : "bg-white border-[var(--color-border)] text-ink/70 hover:border-terracotta/50"}`}
                  >
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: t.cor || "#999" }} />
                    {t.nome} <span className="opacity-60">({t.membros.length})</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
              {alunosTab.length === 0 ? (
                <p className="p-8 text-sm text-ink/50 text-center">Sem alunos nesta turma. Atribua na tabela de <b>Alunos</b>.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-[11px] uppercase tracking-wider text-ink/50">
                    <tr className="border-b border-[var(--color-border)]">
                      <th className="text-left px-5 py-3 font-medium">Nome</th>
                      <th className="text-left px-5 py-3 font-medium">E-mail</th>
                      <th className="text-left px-5 py-3 font-medium">Nível</th>
                      <th className="text-right px-5 py-3 font-medium">Pontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {alunosTab.map((a) => (
                      <tr
                        key={a.id}
                        onClick={() => navigate({ to: "/admin/mentoradas", search: { aluno: a.id } })}
                        className="border-b border-[var(--color-border)] last:border-0 cursor-pointer hover:bg-terracotta/5 transition-colors"
                      >
                        <td className="px-5 py-3 font-medium text-ink">{a.nome || "—"}</td>
                        <td className="px-5 py-3 text-ink/60">{a.email}</td>
                        <td className="px-5 py-3 text-ink/60">{a.tier || "Início"}</td>
                        <td className="px-5 py-3 text-right font-medium tabular-nums">{a.pontos ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
