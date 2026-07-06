import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Lock, Eye, ListTree } from "lucide-react";
import { notify } from "@/lib/toast";
import { ESTRUTURA, type Nodo, type NodoTipo } from "@/lib/estrutura";
import { useBloqueios, guardarBloqueios } from "@/lib/bloqueios";

export const Route = createFileRoute("/_authenticated/admin/estrutura 13")({
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

      <div className="flex items-center gap-4 text-[13px] text-ink/60 mt-4 mb-4">
        <span className="inline-flex items-center gap-1.5"><Lock size={13} className="text-amber-600" /> {total} bloqueado(s)</span>
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
        As alterações são guardadas automaticamente e aplicam-se a todos os alunos.
      </p>
    </div>
  );
}

function badgeCor(tipo: NodoTipo): string {
  switch (tipo) {
    case "modulo": return "bg-terracotta/10 text-terracotta";
    case "pilar": return "bg-indigo-50 text-indigo-600";
    case "pagina": return "bg-ink/5 text-ink/60";
    default: return "bg-ink/[0.03] text-ink/45";
  }
}
