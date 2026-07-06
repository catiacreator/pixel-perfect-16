import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ShieldCheck, Shield, GraduationCap, Lock, Check, Star } from "lucide-react";
import { notify } from "@/lib/toast";
import { getPapeis, setPapeis } from "@/lib/admin.functions";
import { ESTRUTURA, type Nodo, type NodoTipo } from "@/lib/estrutura";

export const Route = createFileRoute("/_authenticated/admin/papeis 8")({
  component: PapeisPage,
});

const TIPO_LABEL: Record<NodoTipo, string> = { modulo: "Módulo", pilar: "Pilar", pagina: "Página", subpagina: "Subpágina" };

type Papeis = { aluno: string[]; moderador: string[] };

function PapeisPage() {
  const fetchFn = useServerFn(getPapeis);
  const saveFn = useServerFn(setPapeis);
  const qc = useQueryClient();
  const { data } = useSuspenseQuery({ queryKey: ["admin-papeis"], queryFn: () => fetchFn() });
  const papeis = data as Papeis;

  const mut = useMutation({
    mutationFn: (next: Papeis) => saveFn({ data: next }),
    onError: (e: unknown) => notify(e instanceof Error ? e.message : "Erro ao guardar", "error"),
  });

  const [aberto, setAberto] = useState<"aluno" | "moderador" | null>("aluno");

  const toggle = (papel: "aluno" | "moderador", nodeId: string) => {
    const atual = papeis[papel];
    const next: Papeis = {
      ...papeis,
      [papel]: atual.includes(nodeId) ? atual.filter((x) => x !== nodeId) : [...atual, nodeId],
    };
    // atualização otimista via cache do react-query
    qc.setQueryData(["admin-papeis"], next);
    mut.mutate(next);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <p className="text-[10px] font-semibold tracking-[0.24em] uppercase text-terracotta mb-1">Leveza no Digital</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Papéis & Permissões</h1>
      <p className="text-sm text-ink/60 mt-1 max-w-xl">
        O que cada nível de acesso vê por defeito. O <b>papel é a base</b>; uma <b>turma</b> específica pode sobrepor-se
        (em <b>Turmas</b>). O <b>Admin</b> vê sempre tudo.
      </p>

      <div className="mt-6 space-y-3">
        {/* Admin — fixo */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </span>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-ink">Admin</h2>
            <p className="text-[13px] text-ink/55">Gere tudo e vê todos os módulos, páginas e subpáginas.</p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-full bg-terracotta/10 text-terracotta">
            <Star size={12} /> Acesso a tudo
          </span>
        </div>

        <PapelCard
          id="moderador"
          icon={<Shield size={20} />}
          titulo="Moderador"
          descricao="Nível intermédio. Escolha o que pode ver."
          grants={papeis.moderador}
          aberto={aberto === "moderador"}
          onAbrir={() => setAberto(aberto === "moderador" ? null : "moderador")}
          onToggle={(nid) => toggle("moderador", nid)}
        />

        <PapelCard
          id="aluno"
          icon={<GraduationCap size={20} />}
          titulo="Aluno"
          descricao="O que os alunos veem por defeito (sem turma atribuída)."
          grants={papeis.aluno}
          aberto={aberto === "aluno"}
          onAbrir={() => setAberto(aberto === "aluno" ? null : "aluno")}
          onToggle={(nid) => toggle("aluno", nid)}
        />
      </div>
    </div>
  );
}

function PapelCard({
  icon, titulo, descricao, grants, aberto, onAbrir, onToggle,
}: {
  id: string;
  icon: React.ReactNode;
  titulo: string;
  descricao: string;
  grants: string[];
  aberto: boolean;
  onAbrir: () => void;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
      <button onClick={onAbrir} className="w-full flex items-center gap-3 p-5 text-left hover:bg-ink/[0.02] transition-colors">
        <span className="w-10 h-10 rounded-xl bg-ink/5 text-ink/70 flex items-center justify-center shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-ink">{titulo}</h2>
          <p className="text-[13px] text-ink/55">{descricao}</p>
        </div>
        <span className="text-[12px] text-ink/50 shrink-0">{grants.length} acesso(s)</span>
      </button>
      {aberto && (
        <div className="border-t border-[var(--color-border)] px-4 py-1">
          <AccessTree grants={grants} onToggle={onToggle} />
        </div>
      )}
    </div>
  );
}

function AccessTree({ grants, onToggle }: { grants: string[]; onToggle: (id: string) => void }) {
  const set = new Set(grants);
  const render = (nodos: Nodo[], depth: number, paiConcedido: boolean) =>
    nodos.map((n) => {
      const raw = set.has(n.id);
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
