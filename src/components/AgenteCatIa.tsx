import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Lock, ShieldCheck, Check, X, Search, Save, ChevronDown } from "lucide-react";
import ConteudoAssistente from "@/components/ConteudoAssistente";
import {
  podeUsarAgente,
  getAgentePerms,
  setAgentePerms,
  getTurmas,
  listMentoradas,
} from "@/lib/admin.functions";

const AGENTE_ID = "cat-ia";

type Turma = { id: string; nome: string; membros?: string[] };
type Aluno = { id: string; nome?: string; email?: string };

// Painel de permissões (só admin): que turmas e/ou alunos podem usar o agente.
function PainelPermissoes() {
  const fetchTurmas = useServerFn(getTurmas);
  const fetchAlunos = useServerFn(listMentoradas);
  const fetchPerms = useServerFn(getAgentePerms);
  const savePerms = useServerFn(setAgentePerms);

  const [aberto, setAberto] = useState(false);
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [selTurmas, setSelTurmas] = useState<Set<string>>(new Set());
  const [selAlunos, setSelAlunos] = useState<Set<string>>(new Set());
  const [q, setQ] = useState("");
  const [carregado, setCarregado] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    let vivo = true;
    Promise.all([
      fetchTurmas().catch(() => []),
      fetchAlunos().catch(() => []),
      fetchPerms({ data: { agente: AGENTE_ID } }).catch(() => ({ turmas: [], alunos: [] })),
    ]).then(([t, a, p]) => {
      if (!vivo) return;
      setTurmas((t as Turma[]) ?? []);
      setAlunos((a as Aluno[]) ?? []);
      setSelTurmas(new Set((p as { turmas: string[] }).turmas ?? []));
      setSelAlunos(new Set((p as { alunos: string[] }).alunos ?? []));
      setCarregado(true);
    });
    return () => { vivo = false; };
  }, [fetchTurmas, fetchAlunos, fetchPerms]);

  const nomeAluno = (id: string) => {
    const a = alunos.find((x) => x.id === id);
    return a?.nome || a?.email || "Aluno";
  };
  const resultados = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return alunos
      .filter((a) => !selAlunos.has(a.id) && ((a.nome || "").toLowerCase().includes(term) || (a.email || "").toLowerCase().includes(term)))
      .slice(0, 6);
  }, [q, alunos, selAlunos]);

  const toggleTurma = (id: string) => setSelTurmas((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const addAluno = (id: string) => { setSelAlunos((s) => new Set(s).add(id)); setQ(""); };
  const removeAluno = (id: string) => setSelAlunos((s) => { const n = new Set(s); n.delete(id); return n; });

  async function guardar() {
    setAGuardar(true);
    try {
      await savePerms({ data: { agente: AGENTE_ID, turmas: [...selTurmas], alunos: [...selAlunos] } });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <div className="mb-6 rounded-2xl border border-terracotta/30 bg-terracotta/[0.05]">
      <button
        onClick={() => setAberto((v) => !v)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-semibold text-ink"
      >
        <ShieldCheck size={16} className="text-terracotta" />
        Permissões de uso (só admin)
        <ChevronDown size={15} className={`ml-auto text-ink/50 transition-transform ${aberto ? "rotate-180" : ""}`} />
      </button>

      {aberto && (
        <div className="border-t border-terracotta/20 px-4 py-4">
          {!carregado ? (
            <div className="flex items-center gap-2 text-sm text-ink/50"><Loader2 size={15} className="animate-spin" /> A carregar…</div>
          ) : (
            <div className="space-y-5">
              <p className="text-[13px] text-ink/60">
                Escolhe quem pode usar a Cat.IA. Só as turmas e alunos aqui marcados terão acesso (tu, admin, tens sempre).
              </p>

              {/* Turmas */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">Turmas com acesso</p>
                {turmas.length === 0 ? (
                  <p className="text-[13px] text-ink/45">Ainda não há turmas.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {turmas.map((t) => {
                      const on = selTurmas.has(t.id);
                      return (
                        <button
                          key={t.id}
                          onClick={() => toggleTurma(t.id)}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                            on ? "border-terracotta bg-terracotta text-cream" : "border-[var(--color-border)] bg-white text-ink hover:border-terracotta/50"
                          }`}
                        >
                          {on && <Check size={12} />} {t.nome}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Alunos específicos */}
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/45">Alunos específicos</p>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {[...selAlunos].map((id) => (
                    <span key={id} className="inline-flex items-center gap-1 rounded-full bg-ink/8 px-2 py-0.5 text-[11px] text-ink">
                      {nomeAluno(id)}
                      <button onClick={() => removeAluno(id)} className="text-ink/40 hover:text-rose-600" aria-label="Tirar"><X size={11} /></button>
                    </span>
                  ))}
                  {selAlunos.size === 0 && <span className="text-[13px] text-ink/40">Nenhum aluno específico.</span>}
                </div>
                <div className="relative max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Procurar aluno por nome ou email…"
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white py-2 pl-9 pr-3 text-sm text-ink outline-none focus:border-terracotta"
                  />
                  {resultados.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-lg">
                      {resultados.map((a) => (
                        <button
                          key={a.id}
                          onClick={() => addAluno(a.id)}
                          className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-ink/5"
                        >
                          {a.nome || a.email} {a.nome && a.email && <span className="text-ink/40">· {a.email}</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={guardar}
                  disabled={aGuardar}
                  className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60"
                >
                  {aGuardar ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar permissões
                </button>
                {guardado && <span className="inline-flex items-center gap-1 text-sm text-success"><Check size={15} /> Guardado</span>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgenteCatIa() {
  const check = useServerFn(podeUsarAgente);
  const [estado, setEstado] = useState<{ pode: boolean; admin: boolean } | null>(null);

  useEffect(() => {
    let vivo = true;
    check({ data: { agente: AGENTE_ID } })
      .then((r) => { if (vivo) setEstado(r as { pode: boolean; admin: boolean }); })
      .catch(() => { if (vivo) setEstado({ pode: false, admin: false }); });
    return () => { vivo = false; };
  }, [check]);

  if (!estado) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-ink/50">
        <Loader2 size={18} className="animate-spin" /> A carregar…
      </div>
    );
  }

  if (!estado.pode && !estado.admin) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta/12 text-terracotta">
          <Lock size={22} />
        </span>
        <h3 className="mb-1 font-serif text-xl text-ink">Assistente Cat.IA</h3>
        <p className="text-[15px] text-ink/60">
          Este assistente está disponível para turmas selecionadas. Fala com a Cátia para teres acesso.
        </p>
      </div>
    );
  }

  return (
    <div>
      {estado.admin && <PainelPermissoes />}
      <ConteudoAssistente />
    </div>
  );
}
