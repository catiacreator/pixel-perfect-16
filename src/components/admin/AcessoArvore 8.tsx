import { useState } from "react";
import { ChevronDown, Lock, Check } from "lucide-react";
import { ESTRUTURA, type Nodo, type NodoTipo } from "@/lib/estrutura";

// Árvore de permissões em acordeão: um card por módulo (colapsável), com toggle
// do módulo inteiro e, ao expandir, toggle de cada página/subpágina.
// `grants` = ids concedidos. Dar acesso a um pai concede aos filhos (herdado);
// para escolher página a página, deixe o módulo sem acesso e ligue as que quiser.

const TIPO_LABEL: Record<NodoTipo, string> = { modulo: "Módulo", pilar: "Pilar", pagina: "Página", subpagina: "Subpágina" };

function ToggleAcesso({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors shrink-0 ${
        on ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-ink/[0.03] border-[var(--color-border)] text-ink/45 hover:text-ink"
      }`}
    >
      {on ? <Check size={11} /> : <Lock size={11} />}
      {on ? "Com acesso" : "Sem acesso"}
    </button>
  );
}

function Filhos({ nodos, depth, paiConcedido, set, onToggle }: {
  nodos: Nodo[]; depth: number; paiConcedido: boolean; set: Set<string>; onToggle: (id: string) => void;
}) {
  return (
    <>
      {nodos.map((n) => {
        const raw = set.has(n.id);
        const efetivo = raw || paiConcedido;
        return (
          <div key={n.id}>
            <div className="flex items-center gap-2.5 py-2 border-b border-[var(--color-border)] last:border-0" style={{ paddingLeft: depth * 20 }}>
              <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full font-semibold bg-ink/5 text-ink/45 shrink-0">{TIPO_LABEL[n.tipo]}</span>
              <span className={`text-[13px] flex-1 min-w-0 truncate ${efetivo ? "text-ink" : "text-ink/45"}`}>{n.label}</span>
              {paiConcedido ? (
                <span className="text-[11px] text-emerald-600/70 italic shrink-0">herdado</span>
              ) : (
                <ToggleAcesso on={raw} onClick={() => onToggle(n.id)} />
              )}
            </div>
            {n.filhos && <Filhos nodos={n.filhos} depth={depth + 1} paiConcedido={efetivo} set={set} onToggle={onToggle} />}
          </div>
        );
      })}
    </>
  );
}

function ModuloAccordion({ modulo, set, onToggle }: { modulo: Nodo; set: Set<string>; onToggle: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const granted = set.has(modulo.id);
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
          <ChevronDown size={16} className={`text-ink/40 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
          <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full font-semibold bg-terracotta/10 text-terracotta shrink-0">Módulo</span>
          <span className="text-sm font-semibold text-ink truncate">{modulo.label}</span>
        </button>
        <ToggleAcesso on={granted} onClick={() => onToggle(modulo.id)} />
      </div>
      {open && modulo.filhos && (
        <div className="border-t border-[var(--color-border)] px-3.5 py-1 bg-cream-warm/20">
          <Filhos nodos={modulo.filhos} depth={0} paiConcedido={granted} set={set} onToggle={onToggle} />
        </div>
      )}
    </div>
  );
}

export default function AcessoArvore({ grants, onToggle }: { grants: string[]; onToggle: (id: string) => void }) {
  const set = new Set(grants);
  return (
    <div className="space-y-2.5">
      {ESTRUTURA.map((mod) => (
        <ModuloAccordion key={mod.id} modulo={mod} set={set} onToggle={onToggle} />
      ))}
    </div>
  );
}
