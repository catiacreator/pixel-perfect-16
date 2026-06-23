import { useEffect, useMemo, useState } from "react";
import { Link } from "@/lib/router-compat";
import Layout from "../components/Layout";
import {
  FileText,
  Mic2,
  Palette,
  BookOpen,
  ExternalLink,
  Download,
  Sun,
  CheckCircle2,
  Sparkles,
  Circle,
  Plus,
  Calendar as CalendarIcon,
  Zap,
  Star,
  Search,
  Compass,
  Mic,
  Target,
  Globe,
  Crown,
  Lock,
  Rocket,
  Flame,
} from "lucide-react";

const STORAGE_KEY = "leveza.minha-base.v1";
const DOC_KEY = "leveza.doc-mestre.v1";

type Postagem = { id: string; nome: string; feita: boolean };
type Tarefa = { id: string; texto: string; feita: boolean };
type Marco = { id: string; titulo: string; data: string };

type BaseState = {
  streak: number;
  postagens: Postagem[];
  tarefas: Tarefa[];
  calView: "7" | "30";
  marcos: Marco[];
};

const DEFAULT_POSTAGENS: Postagem[] = [
  { id: "stories", nome: "Stories", feita: true },
  { id: "carrossel", nome: "Post de Carrossel", feita: true },
  { id: "reels", nome: "Reels", feita: true },
];

const DEFAULT_TAREFAS: Tarefa[] = [
  { id: "t1", texto: "", feita: false },
  { id: "t2", texto: "", feita: false },
  { id: "t3", texto: "", feita: false },
];

const EMPTY: BaseState = {
  streak: 1,
  postagens: DEFAULT_POSTAGENS,
  tarefas: DEFAULT_TAREFAS,
  calView: "30",
  marcos: [],
};

function loadState(): BaseState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function loadName(): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = window.localStorage.getItem(DOC_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw);
    return (parsed?.nome || "").split(" ")[0] || "";
  } catch {
    return "";
  }
}

const DOCS = [
  {
    icon: FileText,
    titulo: "Documento Mestre",
    sub: "Seu posicionamento, público, método e tom de voz",
    to: "/doc-mestre",
  },
  {
    icon: Mic2,
    titulo: "Arquétipos e Tom de Voz",
    sub: "Seu arquétipo dominante, comunicação e crenças",
    to: "/metodo/pilar-2/tom-de-voz",
  },
  {
    icon: Palette,
    titulo: "Identidade Visual",
    sub: "Paleta, tipografia, estilo de imagem e elementos visuais",
    to: "/metodo/pilar-2/identidade-visual",
  },
  {
    icon: BookOpen,
    titulo: "Esboço do Método",
    sub: "Passos, promessa e diferencial do seu método",
    to: "/metodo/pilar-2/metodo",
  },
];

const ACESSO_RAPIDO = [
  { icon: Sparkles, label: "Aprender IA", to: "/metodo/pilar-1/aprenda-ia", color: "text-violet-500" },
  { icon: Star, label: "Identidade de Marca", to: "/metodo/pilar-2/identidade", color: "text-pink-500" },
  { icon: Target, label: "Redes Sociais", to: "/metodo/pilar-2/redes-sociais", color: "text-emerald-600" },
  { icon: FileText, label: "Documento Mestre", to: "/doc-mestre", color: "text-amber-600" },
];

type Conquista = {
  id: string;
  icon: typeof FileText;
  titulo: string;
  sub: string;
  desbloqueada: boolean;
};

const CONQUISTAS: Conquista[] = [
  { id: "doc", icon: FileText, titulo: "Documento Mestre", sub: "Se conheceu de verdade", desbloqueada: true },
  { id: "detetive", icon: Search, titulo: "Detetive do Tempo", sub: "Descobriu onde o tempo vai", desbloqueada: true },
  { id: "arq", icon: Compass, titulo: "Arquétipos Decifrados", sub: "Você + cliente com clareza", desbloqueada: true },
  { id: "voz", icon: Mic, titulo: "Voz Definida", sub: "Sua marca tem som próprio", desbloqueada: false },
  { id: "visual", icon: Palette, titulo: "Identidade Visual", sub: "Paleta, tipografia e mood", desbloqueada: false },
  { id: "metodo", icon: Target, titulo: "Método Próprio", sub: "Sabe o que ensina", desbloqueada: true },
  { id: "pagina", icon: Globe, titulo: "Página Profissional", sub: "Página profissional no ar", desbloqueada: true },
  { id: "linha", icon: BookOpen, titulo: "Linha Editorial", sub: "Conteúdo com estratégia", desbloqueada: false },
  { id: "bio", icon: Star, titulo: "Bio do Instagram", sub: "Bio publicada no perfil", desbloqueada: false },
  { id: "rainha", icon: Crown, titulo: "Rainha da Trilha", sub: "Concluiu todos os pilares", desbloqueada: false },
];

function weekStartMonday(d: Date) {
  const x = new Date(d);
  const day = x.getDay(); // 0 sun .. 6 sat
  const diff = (day + 6) % 7;
  x.setDate(x.getDate() - diff);
  x.setHours(0, 0, 0, 0);
  return x;
}

function fmtDay(d: Date) {
  const isFirst = d.getDate() === 1;
  return isFirst
    ? `${d.getDate()} ${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "").toUpperCase()}`
    : `${d.getDate()}`;
}

export default function MinhaBase() {
  const [state, setState] = useState<BaseState>(EMPTY);
  const [nome, setNome] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setState(loadState());
    setNome(loadName());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, mounted]);

  const hoje = useMemo(() => new Date(), []);
  const dataExtenso = hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const calendarDays = useMemo(() => {
    const start = weekStartMonday(hoje);
    const total = state.calView === "7" ? 7 : 35;
    return Array.from({ length: total }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [hoje, state.calView]);

  const togglePostagem = (id: string) =>
    setState((s) => ({
      ...s,
      postagens: s.postagens.map((p) => (p.id === id ? { ...p, feita: !p.feita } : p)),
    }));

  const toggleTarefa = (id: string) =>
    setState((s) => ({
      ...s,
      tarefas: s.tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t)),
    }));

  const setTarefaTexto = (id: string, texto: string) =>
    setState((s) => ({
      ...s,
      tarefas: s.tarefas.map((t) => (t.id === id ? { ...t, texto } : t)),
    }));

  const addTarefa = () =>
    setState((s) => ({
      ...s,
      tarefas: [...s.tarefas, { id: `t${Date.now()}`, texto: "", feita: false }],
    }));

  const conquistasFeitas = CONQUISTAS.filter((c) => c.desbloqueada).length;
  const nivel = Math.min(10, Math.max(1, Math.round((conquistasFeitas / CONQUISTAS.length) * 10)));
  const progresso = Math.round((conquistasFeitas / CONQUISTAS.length) * 100);

  const addMarco = () => {
    const titulo = window.prompt("Título do marco (ex.: Lancei minha página)");
    if (!titulo) return;
    setState((s) => ({
      ...s,
      marcos: [
        ...s.marcos,
        { id: `m${Date.now()}`, titulo, data: new Date().toLocaleDateString("pt-BR") },
      ],
    }));
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-8 md:py-10">
        {/* HERO */}
        <section className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-cream-warm/70 via-white to-gold/10 p-6 md:p-8 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-6">
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-terracotta mb-2">Sua jornada</p>
              <h1 className="font-display text-3xl md:text-4xl text-ink tracking-tight">
                Olá, {nome || "você"}! <span className="inline-block">👋</span>
              </h1>
              <p className="text-sm text-ink/55 mt-1 capitalize">{dataExtenso}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-center min-w-[72px]">
                <Flame className="mx-auto text-terracotta" size={18} />
                <p className="font-display text-xl text-ink mt-1">{state.streak}</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-ink/50">Dia</p>
              </div>
              <div className="rounded-2xl border border-terracotta/30 bg-cream-warm px-4 py-3 text-center min-w-[92px]">
                <Rocket className="mx-auto text-terracotta" size={18} />
                <p className="text-[13px] font-semibold text-ink mt-1">Em Movimento</p>
                <p className="text-[11px] text-ink/55">{nivel}/10</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-[11px] text-ink/55 mb-1.5">
              <span>Em Movimento</span>
              <span className="flex items-center gap-1.5">
                <Star size={12} className="text-gold" />
                Expert em Formação em {Math.max(1, 10 - conquistasFeitas)} conquista
                {10 - conquistasFeitas !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-ink/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-terracotta to-gold"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>
        </section>

        {/* MEUS DOCUMENTOS */}
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-terracotta" />
            <h2 className="font-display text-lg text-ink">Meus documentos</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DOCS.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.titulo}
                  className="rounded-2xl border border-[var(--color-border)] bg-white p-4 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-cream-warm flex items-center justify-center text-terracotta shrink-0">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base text-ink leading-tight">{d.titulo}</p>
                    <p className="text-xs text-ink/55 mt-0.5">{d.sub}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      to={d.to}
                      className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-ink/70 hover:bg-cream-warm"
                      aria-label="Abrir"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-ink/70 hover:bg-cream-warm"
                      aria-label="Baixar"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* HOJE */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold/30 text-terracotta flex items-center justify-center">
              <Sun size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg text-ink leading-tight">Hoje</h2>
              <p className="text-xs text-ink/55">Rotina do dia</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Postagens */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink/55 mb-3">Postagens</p>
              <div className="space-y-2">
                {state.postagens.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <button
                      onClick={() => togglePostagem(p.id)}
                      className={`flex-1 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        p.feita
                          ? "border-emerald-300 bg-emerald-50/60 text-emerald-700 line-through"
                          : "border-[var(--color-border)] text-ink hover:bg-cream-warm"
                      }`}
                    >
                      {p.feita ? (
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      ) : (
                        <Circle size={16} className="text-ink/40 shrink-0" />
                      )}
                      <span className="truncate">{p.nome}</span>
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-terracotta hover:bg-cream-warm"
                      aria-label="Ideias com IA"
                      title="3 ideias + prompt para o ChatGPT"
                    >
                      <Sparkles size={15} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-ink/50 mt-3 flex items-center gap-1.5">
                <Sparkles size={11} className="text-terracotta" />
                Clique em <Sparkles size={11} className="inline text-terracotta" /> para ver 3 ideias + prompt para o ChatGPT
              </p>
            </div>

            {/* Tarefas */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <p className="text-[11px] tracking-[0.2em] uppercase text-ink/55 mb-3 flex items-center gap-2">
                <FileText size={11} /> Tarefas do dia
              </p>
              <div className="space-y-2">
                {state.tarefas.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <button
                      onClick={() => toggleTarefa(t.id)}
                      className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] font-semibold shrink-0 ${
                        t.feita
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-[var(--color-border)] text-ink/50 bg-cream-warm"
                      }`}
                    >
                      {t.feita ? "✓" : i + 1}
                    </button>
                    <input
                      value={t.texto}
                      onChange={(e) => setTarefaTexto(t.id, e.target.value)}
                      placeholder={`Tarefa ${i + 1}...`}
                      className={`flex-1 rounded-lg border border-[var(--color-border)] bg-cream-warm/40 px-3 py-2 text-sm outline-none focus:border-terracotta ${
                        t.feita ? "line-through text-ink/40" : "text-ink"
                      }`}
                    />
                  </div>
                ))}
                <button
                  onClick={addTarefa}
                  className="w-full mt-1 flex items-center justify-center gap-1.5 text-sm text-ink/55 rounded-lg border border-dashed border-[var(--color-border)] py-2.5 hover:bg-cream-warm"
                >
                  <Plus size={14} /> Adicionar mais uma tarefa
                </button>
              </div>
            </div>
          </div>

          {/* Tag row */}
          <div className="flex flex-wrap gap-2 mt-4">
            {state.postagens.map((p) => (
              <span
                key={p.id}
                className={`text-[11px] px-2.5 py-1 rounded-full border ${
                  p.feita
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-white border-[var(--color-border)] text-ink/50"
                }`}
              >
                {p.nome.replace("Post de ", "")} {p.feita ? "✓" : ""}
              </span>
            ))}
          </div>
        </section>

        {/* CALENDÁRIO */}
        <section className="mt-10">
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-terracotta" />
                <h2 className="font-display text-base text-ink">Calendário Editorial</h2>
              </div>
              <div className="inline-flex rounded-full bg-cream-warm p-1 text-[12px]">
                {(["7", "30"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setState((s) => ({ ...s, calView: v }))}
                    className={`px-3 py-1 rounded-full transition-colors ${
                      state.calView === v ? "bg-terracotta text-cream" : "text-ink/60"
                    }`}
                  >
                    {v} dias
                  </button>
                ))}
              </div>
              <Link to="/metodo/pilar-2/redes-sociais" className="text-[12px] text-terracotta hover:underline">
                Editar calendário →
              </Link>
            </div>

            <div className="grid grid-cols-7 text-[10px] tracking-[0.2em] uppercase text-ink/50 mb-1">
              {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
                <div key={d} className="px-2 py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px bg-[var(--color-border)] rounded-lg overflow-hidden">
              {calendarDays.map((d) => {
                const isToday = d.toDateString() === hoje.toDateString();
                const isOther = d.getMonth() !== hoje.getMonth();
                return (
                  <div
                    key={d.toISOString()}
                    className={`bg-white p-2 min-h-[72px] ${
                      isToday ? "ring-1 ring-terracotta ring-inset" : ""
                    } ${isOther ? "bg-cream-warm/30" : ""}`}
                  >
                    <p className={`text-[11px] font-semibold ${isToday ? "text-terracotta" : "text-ink/70"}`}>
                      {fmtDay(d)}
                    </p>
                    <p className="text-[10px] text-ink/30 mt-1">·</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ACESSAR RÁPIDO */}
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-terracotta" />
            <h2 className="font-display text-base text-ink">Acessar rápido</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ACESSO_RAPIDO.map((a) => {
              const Icon = a.icon;
              return (
                <Link
                  key={a.label}
                  to={a.to}
                  className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 flex items-center gap-3 hover:bg-cream-warm transition-colors"
                >
                  <Icon size={16} className={a.color} />
                  <span className="text-sm text-ink flex-1">{a.label}</span>
                  <span className="text-ink/40">→</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* CONQUISTAS */}
        <section className="mt-10">
          <h2 className="font-display text-lg text-ink mb-1">Conquistas da trilha</h2>
          <p className="text-xs text-ink/55 mb-4">Desbloqueadas automaticamente conforme você avança.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {CONQUISTAS.map((c) => {
              const Icon = c.desbloqueada ? c.icon : Lock;
              return (
                <div
                  key={c.id}
                  className={`rounded-2xl border p-4 flex items-center gap-3 ${
                    c.desbloqueada
                      ? "bg-white border-[var(--color-border)]"
                      : "bg-cream-warm/40 border-[var(--color-border)] opacity-70"
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      c.desbloqueada ? "bg-terracotta/15 text-terracotta" : "bg-ink/5 text-ink/40"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm text-ink leading-tight">{c.titulo}</p>
                    <p className="text-[11px] text-ink/55 mt-0.5">{c.sub}</p>
                    {c.desbloqueada && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-terracotta bg-gold/20 px-2 py-0.5 rounded-full mt-1.5 uppercase tracking-wider">
                        <Sparkles size={9} /> Desbloqueada
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MARCOS */}
        <section className="mt-10 mb-10">
          <div className="flex items-end justify-between gap-3 mb-3">
            <div>
              <h2 className="font-display text-lg text-ink">Seus marcos</h2>
              <p className="text-xs text-ink/55">Lançamentos, criações e vitórias que você quer guardar.</p>
            </div>
            <button
              onClick={addMarco}
              className="inline-flex items-center gap-1.5 bg-terracotta text-cream rounded-full px-4 py-2 text-sm font-medium hover:bg-terracotta-dark"
            >
              <Plus size={14} /> Adicionar marco
            </button>
          </div>
          {state.marcos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--color-border)] bg-cream-warm/30 p-10 text-center">
              <Crown size={24} className="mx-auto text-terracotta mb-3" />
              <p className="text-sm text-ink">Nada por aqui ainda.</p>
              <p className="text-xs text-ink/55 mt-1">
                Registre seu primeiro marco — uma página publicada, um lançamento, um cliente fechado.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {state.marcos.map((m) => (
                <li
                  key={m.id}
                  className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 flex items-center justify-between gap-3"
                >
                  <span className="text-sm text-ink">{m.titulo}</span>
                  <span className="text-xs text-ink/50">{m.data}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </Layout>
  );
}
