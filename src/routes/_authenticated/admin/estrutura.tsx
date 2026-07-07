import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Lock, Eye, ListTree } from "lucide-react";
import { notify } from "@/lib/toast";
import { ESTRUTURA, type Nodo, type NodoTipo } from "@/lib/estrutura";
import { useBloqueios, guardarBloqueios } from "@/lib/bloqueios";
import { getModoBloqueio, setModoBloqueio, getTurmas, setTurmas } from "@/lib/admin.functions";
import { type Turma } from "@/lib/turmas";
import AcessoArvore from "@/components/admin/AcessoArvore";

export const Route = createFileRoute("/_authenticated/admin/estrutura")({
  component: EstruturaPage,
});

const TIPO_LABEL: Record<NodoTipo, string> = {
  modulo: "Módulo",
  pilar: "Pilar",
  pagina: "Página",
  subpagina: "Subpágina",
};

function EstruturaPage() {
  const { ids, carregado } = useBloqueios();
  const [sel, setSel] = useState<Set<string>>(new Set(ids));
  const [seeded, setSeeded] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Modo por módulo: "em-breve" (nada a fazer) ou "bloqueado" (mostra contacto da Cátia).
  const getModoFn = useServerFn(getModoBloqueio);
  const saveModoFn = useServerFn(setModoBloqueio);
  const [modos, setModos] = useState<Record<string, string>>({});
  useEffect(() => {
    getModoFn().then((m) => setModos((m as Record<string, string>) || {})).catch(() => {});
  }, [getModoFn]);
  const mudarModo = (id: string, v: string) => {
    const next = { ...modos, [id]: v };
    setModos(next);
    saveModoFn({ data: { modos: next } }).catch((e: unknown) =>
      notify(e instanceof Error ? e.message : "Não foi possível guardar.", "error"),
    );
  };

  // Âmbito: "geral" (global, predominante) ou uma turma específica.
  const getTurmasFn = useServerFn(getTurmas);
  const saveTurmasFn = useServerFn(setTurmas);
  const [turmas, setTurmas_] = useState<Turma[]>([]);
  const [escopo, setEscopo] = useState<string>("geral");
  useEffect(() => {
    getTurmasFn().then((t) => setTurmas_((t as Turma[]) || [])).catch(() => {});
  }, [getTurmasFn]);
  const turmaSel = turmas.find((t) => t.id === escopo) || null;
  const salvarTurma = (turmaId: string, acessos: string[]) => {
    const next = turmas.map((t) => (t.id === turmaId ? { ...t, acessos } : t));
    setTurmas_(next);
    saveTurmasFn({ data: { turmas: next } }).catch((e: unknown) =>
      notify(e instanceof Error ? e.message : "Não foi possível guardar.", "error"),
    );
  };

  // Semeia o estado local assim que a config global carrega do servidor.
  useEffect(() => {
    if (carregado && !seeded) {
      setSel(new Set(ids));
      setSeeded(true);
    }
  }, [carregado, seeded, ids]);

  async function toggle(id: string) {
    const next = new Set(sel);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSel(next);
    setSavingId(id);
    try {
      await guardarBloqueios([...next]);
    } catch (e) {
      // reverte em caso de erro
      setSel(sel);
      notify(e instanceof Error ? e.message : "Não foi possível guardar.", "error");
    } finally {
      setSavingId(null);
    }
  }

  const total = sel.size;

  function renderNodos(nodos: Nodo[], depth: number, paiBloqueado: boolean) {
    return nodos.map((n) => {
      const raw = sel.has(n.id);
      const efetivo = raw || paiBloqueado;
      return (
        <div key={n.id}>
          <div
            className="flex items-center gap-3 py-2.5 border-b border-[var(--color-border)]"
            style={{ paddingLeft: depth * 22 }}
          >
            <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full font-semibold shrink-0 ${badgeCor(n.tipo)}`}>
              {TIPO_LABEL[n.tipo]}
            </span>
            <span className={`text-sm flex-1 min-w-0 truncate ${efetivo ? "text-ink/40" : "text-ink"}`}>
              {n.label}
            </span>

            {n.tipo === "modulo" && (
              <select
                value={modos[n.id] === "bloqueado" ? "bloqueado" : "em-breve"}
                onChange={(e) => mudarModo(n.id, e.target.value)}
                className="shrink-0 h-8 rounded-lg border border-[var(--color-border)] bg-white px-2 text-[12px]"
                title="Tag mostrada no card quando o módulo está bloqueado para o aluno"
              >
                <option value="em-breve">Tag: Em breve</option>
                <option value="bloqueado">Tag: Bloqueado (contacto)</option>
              </select>
            )}

            {paiBloqueado ? (
              <span className="text-[11px] text-ink/40 italic shrink-0">herdado (pai bloqueado)</span>
            ) : (
              <button
                onClick={() => toggle(n.id)}
                disabled={savingId === n.id}
                className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full border transition-colors shrink-0 disabled:opacity-50 ${
                  raw
                    ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100"
                    : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                }`}
                title={raw ? "Bloqueado (Em breve) — clique para libertar" : "Visível — clique para bloquear"}
              >
                {raw ? <Lock size={12} /> : <Eye size={12} />}
                {raw ? "Em breve" : "Visível"}
              </button>
            )}
          </div>
          {n.filhos && renderNodos(n.filhos, depth + 1, efetivo)}
        </div>
      );
    });
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-start gap-3 mb-1">
        <ListTree size={22} className="text-terracotta mt-0.5" />
        <div>
          <h1 className="text-2xl font-semibold">Estrutura & Bloqueios</h1>
          <p className="text-sm text-ink/60 mt-1 max-w-xl">
            Toda a estrutura da plataforma. Marque qualquer módulo, pilar, página ou subpágina como{" "}
            <b>Em breve</b> para a ocultar dos alunos — você (admin) continua a ver tudo. Bloquear um item
            bloqueia também os seus filhos.
          </p>
        </div>
      </div>

      {/* Âmbito: Geral (predominante) + cada turma */}
      <div className="flex flex-wrap gap-1.5 mt-5 mb-4 border-b border-[var(--color-border)] pb-3">
        <button onClick={() => setEscopo("geral")} className={tabCls(escopo === "geral")}>Geral</button>
        {turmas.map((t) => (
          <button key={t.id} onClick={() => setEscopo(t.id)} className={tabCls(escopo === t.id)}>
            {t.nome}
          </button>
        ))}
      </div>

      {escopo === "geral" ? (
        <>
          <div className="flex items-center gap-4 text-[13px] text-ink/60 mb-4">
            <span className="inline-flex items-center gap-1.5"><Lock size={13} className="text-amber-600" /> {total} em breve</span>
            {!carregado && <span className="text-ink/40">a carregar…</span>}
          </div>
          <div className="space-y-4">
            {ESTRUTURA.map((mod) => (
              <div key={mod.id} className="bg-white border border-[var(--color-border)] rounded-2xl px-4 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                {renderNodos([mod], 0, false)}
              </div>
            ))}
          </div>
          <p className="text-[12px] text-ink/40 mt-4">
            O <b>Geral</b> é predominante: o que marcar como <b>Em breve</b> aqui fica escondido para <b>todas</b> as turmas.
          </p>
        </>
      ) : turmaSel ? (
        <>
          <p className="text-[13px] text-ink/60 mb-3">
            Visibilidade da turma <b className="text-ink">{turmaSel.nome}</b> — ligue/desligue cada módulo, página ou subpágina.
            O <b>Em breve</b> do Geral continua a esconder para todos (predominante).
          </p>
          <AcessoArvore grants={turmaSel.acessos} onChange={(next) => salvarTurma(turmaSel.id, next)} globalBloqueado={sel} />
        </>
      ) : (
        <p className="text-sm text-ink/50 mt-4">Ainda não há turmas — crie em Admin → Turmas.</p>
      )}
    </div>
  );
}

function tabCls(active: boolean): string {
  return `px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
    active ? "bg-terracotta text-cream" : "text-ink/60 hover:bg-ink/5"
  }`;
}

function badgeCor(tipo: NodoTipo): string {
  switch (tipo) {
    case "modulo": return "bg-terracotta/10 text-terracotta";
    case "pilar": return "bg-indigo-50 text-indigo-600";
    case "pagina": return "bg-ink/5 text-ink/60";
    default: return "bg-ink/[0.03] text-ink/45";
  }
}
