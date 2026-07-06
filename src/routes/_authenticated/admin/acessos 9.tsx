import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { Search, ChevronDown, Check, Lock, Layers } from "lucide-react";
import { listMentoradas } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/acessos 9")({
  component: AcessosPage,
});

// Estrutura de cursos: produto → módulos. (Por agora a UI guarda localmente;
// depois liga-se a uma tabela na Supabase.)
type Modulo = { id: string; nome: string };
type Curso = { id: string; nome: string; cor: string; modulos: Modulo[] };

const CURSOS: Curso[] = [
  {
    id: "protocolo", nome: "Protocolo Viral", cor: "#C8487E",
    modulos: [
      { id: "doc-mestre", nome: "Documento Mestre" },
      { id: "pilar-1", nome: "Pilar 1 · Crie com leveza" },
      { id: "pilar-2", nome: "Pilar 2 · Criar autoridade" },
      { id: "pilar-3", nome: "Pilar 3 · Criar Soluções Digitais" },
      { id: "pilar-4", nome: "Pilar 4 · Aprender a vender" },
      { id: "instagram", nome: "Criar para o Instagram" },
    ],
  },
  {
    id: "academia", nome: "Academia de IA", cor: "#2E7CB8",
    modulos: [
      { id: "principais-ias", nome: "Principais IAs" },
      { id: "videos", nome: "Vídeos profissionais com IA" },
      { id: "produtividade", nome: "Ferramentas de produtividade" },
    ],
  },
  {
    id: "especiais", nome: "Caminhos especiais", cor: "#9E7FEC",
    modulos: [
      { id: "consultoria", nome: "Consultoria de IA" },
      { id: "saude", nome: "Área da Saúde" },
    ],
  },
];

const TOTAL_MODULOS = CURSOS.reduce((n, c) => n + c.modulos.length, 0);
const KEY = "leveza.admin.acessos.v1";

type Acessos = Record<string, Record<string, boolean>>; // userId -> moduloId -> bool

function readAcessos(): Acessos {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}

function Switch({ on, onClick, cor }: { on: boolean; onClick: () => void; cor?: string }) {
  return (
    <button
      onClick={onClick}
      role="switch"
      aria-checked={on}
      className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${on ? "" : "bg-ink/15"}`}
      style={on ? { background: cor || "#2FA98A" } : undefined}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : ""}`} />
    </button>
  );
}

function AcessosPage() {
  const fetchFn = useServerFn(listMentoradas);
  const { data } = useSuspenseQuery({ queryKey: ["admin-mentoradas"], queryFn: () => fetchFn() });
  const alunos = (data as { id: string; nome?: string; email?: string; role?: string }[]) || [];

  const [acessos, setAcessos] = useState<Acessos>(readAcessos);
  const [q, setQ] = useState("");
  const [aberto, setAberto] = useState<string | null>(null);

  const persist = (next: Acessos) => {
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignora */ }
  };
  const update = (fn: (prev: Acessos) => Acessos) =>
    setAcessos((prev) => { const next = fn(prev); persist(next); return next; });

  const has = (uid: string, mid: string) => !!acessos[uid]?.[mid];
  const toggleModulo = (uid: string, mid: string) =>
    update((prev) => ({ ...prev, [uid]: { ...prev[uid], [mid]: !prev[uid]?.[mid] } }));
  const setCurso = (uid: string, curso: Curso, on: boolean) =>
    update((prev) => {
      const u = { ...prev[uid] };
      curso.modulos.forEach((m) => { u[m.id] = on; });
      return { ...prev, [uid]: u };
    });

  const contarUser = (uid: string) => CURSOS.reduce((n, c) => n + c.modulos.filter((m) => has(uid, m.id)).length, 0);
  const cursoEstado = (uid: string, c: Curso) => {
    const on = c.modulos.filter((m) => has(uid, m.id)).length;
    return on === 0 ? "nenhum" : on === c.modulos.length ? "total" : "parcial";
  };

  const filtrados = useMemo(() => {
    const t = q.trim().toLowerCase();
    return alunos.filter((a) => !t || (a.nome || "").toLowerCase().includes(t) || (a.email || "").toLowerCase().includes(t));
  }, [alunos, q]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink">Acessos</h1>
          <p className="text-sm text-ink/55 mt-0.5">Gira o que cada aluno pode ver — por produto e por módulo.</p>
        </div>
      </div>

      {/* Nota (UI-only por agora) */}
      <div className="flex items-center gap-2 text-xs text-ink/55 bg-cream-warm/50 border border-[var(--color-border)] rounded-xl px-3 py-2 my-4">
        <Lock size={13} className="text-terracotta" />
        Pré-visualização: as permissões guardam-se localmente por agora. Quando aprovares o fluxo, ligo à Supabase para valer para todos os dispositivos.
      </div>

      {/* Pesquisa */}
      <div className="relative mb-4 max-w-sm">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Procurar aluno…"
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-[var(--color-border)] text-sm outline-none focus:border-terracotta bg-white"
        />
      </div>

      {/* Lista de alunos */}
      <div className="space-y-2.5">
        {filtrados.length === 0 && (
          <p className="text-sm text-ink/50 py-8 text-center">Nenhum aluno encontrado.</p>
        )}
        {filtrados.map((a) => {
          const open = aberto === a.id;
          const n = contarUser(a.id);
          return (
            <div key={a.id} className="rounded-xl border border-[var(--color-border)] bg-white overflow-hidden">
              <button onClick={() => setAberto(open ? null : a.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                <span className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-sm font-semibold shrink-0">
                  {(a.nome || a.email || "?").trim().charAt(0).toUpperCase()}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink truncate">{a.nome || "—"}</p>
                  <p className="text-xs text-ink/50 truncate">{a.email}</p>
                </div>
                <span className="text-xs text-ink/55 inline-flex items-center gap-1.5 shrink-0">
                  <Layers size={13} /> {n} / {TOTAL_MODULOS} módulos
                </span>
                <ChevronDown size={16} className={`text-ink/40 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
              </button>

              {open && (
                <div className="border-t border-[var(--color-border)] p-4 space-y-4 bg-cream-warm/20">
                  {CURSOS.map((c) => {
                    const estado = cursoEstado(a.id, c);
                    const tudo = estado === "total";
                    return (
                      <div key={c.id} className="rounded-lg border border-[var(--color-border)] bg-white">
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[var(--color-border)]">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.cor }} />
                          <p className="text-sm font-semibold text-ink flex-1">{c.nome}</p>
                          <span className={`text-[10px] font-semibold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full ${estado === "total" ? "bg-sage/15 text-sage" : estado === "parcial" ? "bg-gold/20 text-terracotta" : "bg-ink/5 text-ink/40"}`}>
                            {estado === "total" ? "Acesso total" : estado === "parcial" ? "Parcial" : "Sem acesso"}
                          </span>
                          <button
                            onClick={() => setCurso(a.id, c, !tudo)}
                            className="text-xs font-semibold text-terracotta hover:text-terracotta-dark"
                          >
                            {tudo ? "Remover tudo" : "Dar tudo"}
                          </button>
                        </div>
                        <div className="divide-y divide-[var(--color-border)]">
                          {c.modulos.map((m) => (
                            <div key={m.id} className="flex items-center gap-3 px-4 py-2">
                              <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${has(a.id, m.id) ? "text-sage" : "text-ink/20"}`}>
                                <Check size={14} strokeWidth={3} />
                              </span>
                              <span className="text-sm text-ink/80 flex-1">{m.nome}</span>
                              <Switch on={has(a.id, m.id)} onClick={() => toggleModulo(a.id, m.id)} cor={c.cor} />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
