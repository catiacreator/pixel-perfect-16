import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Save, Loader2, Check, KeyRound, Link2, ShieldCheck, X, Search } from "lucide-react";
import { notify } from "@/lib/toast";
import {
  getCatIaConfig, setCatIaConfig,
  getAgentePerms, setAgentePerms, getTurmas, listMentoradas,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/cat-ia")({
  component: CatIaPage,
});

const AGENTE_ID = "cat-ia";
type Turma = { id: string; nome: string; membros?: string[] };
type Aluno = { id: string; nome?: string; email?: string };

function CatIaPage() {
  const fetchCfg = useServerFn(getCatIaConfig);
  const saveCfg = useServerFn(setCatIaConfig);

  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [carregado, setCarregado] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    fetchCfg()
      .then((c) => { const cfg = c as { url: string; password: string }; setUrl(cfg.url); setPassword(cfg.password); })
      .catch(() => {})
      .finally(() => setCarregado(true));
  }, [fetchCfg]);

  async function guardarConfig() {
    setAGuardar(true);
    try {
      await saveCfg({ data: { url: url.trim(), password: password.trim() } });
      setGuardado(true);
      setTimeout(() => setGuardado(false), 2500);
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível guardar.", "error");
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-start gap-3 mb-1">
        <Bot size={22} className="text-terracotta mt-0.5" />
        <div>
          <h1 className="text-2xl font-semibold">Cat.IA</h1>
          <p className="text-sm text-ink/60 mt-1 max-w-xl">
            Define o <b>link do agente</b> e a <b>palavra-passe</b>, e controla <b>quem pode usar</b> a Cat.IA (por turma
            ou aluno). Estas definições são só tuas — os alunos não as veem.
          </p>
        </div>
      </div>

      {!carregado ? (
        <div className="mt-8 flex items-center gap-2 text-sm text-ink/50"><Loader2 size={16} className="animate-spin" /> A carregar…</div>
      ) : (
        <div className="mt-6 space-y-6">
          {/* ── Link + palavra-passe ── */}
          <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <h2 className="text-sm font-semibold text-ink">Link & palavra-passe</h2>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-muted">
                <Link2 size={13} /> Link do Cat.IA (ChatGPT)
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://chatgpt.com/g/g-…-cat-ia"
                className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-[15px] text-ink outline-none focus:border-terracotta"
              />
            </div>
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs uppercase tracking-[0.1em] text-muted">
                <KeyRound size={13} /> Palavra-passe
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ex.: VIRAL26"
                className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-[15px] tracking-wide text-ink outline-none focus:border-terracotta"
              />
              <p className="mt-1.5 text-[12.5px] text-ink/50">Mostrada em pequeno junto ao botão de abrir o Cat.IA.</p>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={guardarConfig}
                disabled={aGuardar || !url.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark disabled:opacity-60"
              >
                {aGuardar ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Guardar
              </button>
              {guardado && <span className="inline-flex items-center gap-1 text-sm text-success"><Check size={15} /> Guardado</span>}
            </div>
          </div>

          {/* ── Permissões de uso ── */}
          <PainelPermissoes />
        </div>
      )}
    </div>
  );
}

// Quem pode usar a Cat.IA — por turma e/ou aluno. Só nesta página de admin.
function PainelPermissoes() {
  const fetchTurmas = useServerFn(getTurmas);
  const fetchAlunos = useServerFn(listMentoradas);
  const fetchPerms = useServerFn(getAgentePerms);
  const savePerms = useServerFn(setAgentePerms);

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
    } catch (e) {
      notify(e instanceof Error ? e.message : "Não foi possível guardar.", "error");
    } finally {
      setAGuardar(false);
    }
  }

  return (
    <div className="space-y-5 rounded-2xl border border-[var(--color-border)] bg-white p-5">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-ink"><ShieldCheck size={16} className="text-terracotta" /> Permissões de uso</h2>
      {!carregado ? (
        <div className="flex items-center gap-2 text-sm text-ink/50"><Loader2 size={15} className="animate-spin" /> A carregar…</div>
      ) : (
        <>
          <p className="text-[13px] text-ink/60">Só as turmas e alunos aqui marcados podem usar a Cat.IA (tu, admin, tens sempre).</p>

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
        </>
      )}
    </div>
  );
}
