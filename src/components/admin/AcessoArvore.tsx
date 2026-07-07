import { useState } from "react";
import { ChevronDown, Lock, Check, Minus } from "lucide-react";
import { ESTRUTURA, type Nodo, type NodoTipo } from "@/lib/estrutura";

// Árvore de permissões: um card por módulo (acordeão). CADA nó (módulo, página,
// subpágina) tem o seu próprio interruptor. Ligar/desligar um nó liga/desliga
// tudo o que está dentro dele — mas depois podes ligar/desligar páginas e
// subpáginas individualmente. `grants` = ids concedidos (por nó).

const TIPO_LABEL: Record<NodoTipo, string> = { modulo: "Módulo", pilar: "Pilar", pagina: "Página", subpagina: "Subpágina" };

function subtreeIds(n: Nodo): string[] {
  const ids = [n.id];
  for (const f of n.filhos ?? []) ids.push(...subtreeIds(f));
  return ids;
}

type Estado = "tudo" | "parcial" | "nada";
function estadoDe(n: Nodo, set: Set<string>): Estado {
  const ids = subtreeIds(n);
  const on = ids.filter((id) => set.has(id)).length;
  return on === 0 ? "nada" : on === ids.length ? "tudo" : "parcial";
}

function Toggle({ estado, onClick }: { estado: Estado; onClick: () => void }) {
  const cfg =
    estado === "tudo"
      ? { cls: "bg-emerald-50 border-emerald-200 text-emerald-700", icon: <Check size={11} />, txt: "Com acesso" }
      : estado === "parcial"
        ? { cls: "bg-amber-50 border-amber-200 text-amber-700", icon: <Minus size={11} />, txt: "Parcial" }
        : { cls: "bg-ink/[0.03] border-[var(--color-border)] text-ink/45 hover:text-ink", icon: <Lock size={11} />, txt: "Sem acesso" };
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors shrink-0 ${cfg.cls}`}
    >
      {cfg.icon} {cfg.txt}
    </button>
  );
}

type ModoMap = Record<string, string>;

export default function AcessoArvore({ grants, onChange, globalBloqueado, modos, onModo }: { grants: string[]; onChange: (next: string[]) => void; globalBloqueado?: Set<string>; modos?: ModoMap; onModo?: (id: string, v: string) => void }) {
  const set = new Set(grants);
  const glob = globalBloqueado ?? new Set<string>();

  // Liga/desliga a subárvore de um nó.
  const alternar = (n: Nodo) => {
    const ids = subtreeIds(n);
    const next = new Set(set);
    const estado = estadoDe(n, set);
    if (estado === "tudo") ids.forEach((id) => next.delete(id));
    else ids.forEach((id) => next.add(id));
    onChange([...next]);
  };

  return (
    <div className="space-y-2.5">
      {ESTRUTURA.map((mod) => (
        <ModuloCard key={mod.id} modulo={mod} set={set} glob={glob} modos={modos} onModo={onModo} onAlternar={alternar} />
      ))}
    </div>
  );
}

function GeralBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shrink-0">
      <Lock size={9} /> Em breve (geral)
    </span>
  );
}

// Quando um nó está "Sem acesso", escolher o que o aluno vê: Em breve ou Bloqueado.
function ModoSelect({ id, modos, onModo }: { id: string; modos?: ModoMap; onModo?: (id: string, v: string) => void }) {
  if (!onModo) return null;
  return (
    <select
      value={modos?.[id] === "bloqueado" ? "bloqueado" : "em-breve"}
      onChange={(e) => { e.stopPropagation(); onModo(id, e.target.value); }}
      onClick={(e) => e.stopPropagation()}
      className="shrink-0 h-7 rounded-lg border border-[var(--color-border)] bg-white px-1.5 text-[11px]"
      title="Quando sem acesso, o aluno vê:"
    >
      <option value="em-breve">Em breve</option>
      <option value="bloqueado">Bloqueado</option>
    </select>
  );
}

function ModuloCard({ modulo, set, glob, modos, onModo, onAlternar }: { modulo: Nodo; set: Set<string>; glob: Set<string>; modos?: ModoMap; onModo?: (id: string, v: string) => void; onAlternar: (n: Nodo) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
      <div className="flex items-center gap-2.5 px-3.5 py-3">
        <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
          <ChevronDown size={16} className={`text-ink/40 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
          <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 rounded-full font-semibold bg-terracotta/10 text-terracotta shrink-0">Módulo</span>
          <span className="text-sm font-semibold text-ink truncate">{modulo.label}</span>
        </button>
        {glob.has(modulo.id) && <GeralBadge />}
        {estadoDe(modulo, set) === "nada" && <ModoSelect id={modulo.id} modos={modos} onModo={onModo} />}
        <Toggle estado={estadoDe(modulo, set)} onClick={() => onAlternar(modulo)} />
      </div>
      {open && modulo.filhos && (
        <div className="border-t border-[var(--color-border)] px-3.5 py-1 bg-cream-warm/20">
          <Filhos nodos={modulo.filhos} depth={0} set={set} glob={glob} modos={modos} onModo={onModo} onAlternar={onAlternar} />
        </div>
      )}
    </div>
  );
}

function Filhos({ nodos, depth, set, glob, modos, onModo, onAlternar }: { nodos: Nodo[]; depth: number; set: Set<string>; glob: Set<string>; modos?: ModoMap; onModo?: (id: string, v: string) => void; onAlternar: (n: Nodo) => void }) {
  return (
    <>
      {nodos.map((n) => {
        const estado = estadoDe(n, set);
        return (
          <div key={n.id}>
            <div className="flex items-center gap-2.5 py-2 border-b border-[var(--color-border)] last:border-0" style={{ paddingLeft: depth * 20 }}>
              <span className="text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 rounded-full font-semibold bg-ink/5 text-ink/45 shrink-0">{TIPO_LABEL[n.tipo]}</span>
              <span className={`text-[13px] flex-1 min-w-0 truncate ${estado !== "nada" ? "text-ink" : "text-ink/45"}`}>{n.label}</span>
              {glob.has(n.id) && <GeralBadge />}
              {estado === "nada" && <ModoSelect id={n.id} modos={modos} onModo={onModo} />}
              <Toggle estado={estado} onClick={() => onAlternar(n)} />
            </div>
            {n.filhos && <Filhos nodos={n.filhos} depth={depth + 1} set={set} glob={glob} modos={modos} onModo={onModo} onAlternar={onAlternar} />}
          </div>
        );
      })}
    </>
  );
}
