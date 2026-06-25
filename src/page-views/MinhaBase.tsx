import { useEffect, useMemo, useRef, useState } from "react";
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
  X,
  Pencil,
  Trash2,
} from "lucide-react";

const CALENDAR_STORAGE_KEY = "leveza.calendario.v1";

type DayEntry = {
  formato: string;
  tema: string;
  stories: string;
  observacoes: string;
};

function loadCalendar(): Record<string, DayEntry> {
  try { return JSON.parse(localStorage.getItem(CALENDAR_STORAGE_KEY) || "{}"); } catch { return {}; }
}

function saveCalendar(data: Record<string, DayEntry>) {
  localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(data));
}

function DayModal({ date, onClose, onCalendarChange }: { date: Date; onClose: () => void; onCalendarChange: () => void }) {
  const key = date.toISOString().slice(0, 10);
  const [all, setAll] = useState<Record<string, DayEntry>>(loadCalendar);
  const existing = all[key];
  const hasContent = existing && Object.values(existing).some(v => v.trim() !== "");

  // Start in view mode if there's already saved content, edit mode otherwise
  const [mode, setMode] = useState<"edit" | "view">(hasContent ? "view" : "edit");
  const [draft, setDraft] = useState<DayEntry>(existing ?? { formato: "", tema: "", stories: "", observacoes: "" });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const label = date.toLocaleDateString("pt-BR", { day: "numeric", month: "long" });

  function handleSave() {
    const isEmpty = Object.values(draft).every(v => v.trim() === "");
    const next = { ...all };
    if (isEmpty) {
      delete next[key];
    } else {
      next[key] = draft;
    }
    saveCalendar(next);
    setAll(next);
    onCalendarChange();
    if (!isEmpty) setMode("view");
    else onClose();
  }

  function handleDelete() {
    const next = { ...all };
    delete next[key];
    saveCalendar(next);
    setAll(next);
    onCalendarChange();
    onClose();
  }

  function handleEdit() {
    setDraft(all[key] ?? { formato: "", tema: "", stories: "", observacoes: "" });
    setMode("edit");
    setConfirmDelete(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" />
      <div
        className="relative w-full sm:max-w-lg bg-[#F5EFE6] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <p className="font-serif text-lg text-ink capitalize">{label}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-ink/10 transition-colors">
            <X size={16} className="text-ink/60" />
          </button>
        </div>

        {/* VIEW MODE */}
        {mode === "view" && existing && (
          <div className="space-y-4">
            {existing.formato && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Formato</p>
                <p className="text-sm text-ink bg-white/60 rounded-xl px-4 py-2.5">{existing.formato}</p>
              </div>
            )}
            {existing.tema && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-ink/50 font-semibold mb-1">Tema / Conteúdo do Post</p>
                <p className="text-sm text-ink bg-white/60 rounded-xl px-4 py-2.5 whitespace-pre-wrap">{existing.tema}</p>
              </div>
            )}
            {existing.stories && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-ink/50 font-semibold mb-1">Stories do Dia</p>
                <p className="text-sm text-ink bg-white/60 rounded-xl px-4 py-2.5 whitespace-pre-wrap">{existing.stories}</p>
              </div>
            )}
            {existing.observacoes && (
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase text-ink/50 font-semibold mb-1">Observações</p>
                <p className="text-sm text-ink bg-white/60 rounded-xl px-4 py-2.5 whitespace-pre-wrap">{existing.observacoes}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-ink/60">Confirmar exclusão?</p>
                  <button onClick={handleDelete} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-red-500 text-white">Excluir</button>
                  <button onClick={() => setConfirmDelete(false)} className="text-xs px-3 py-1.5 rounded-full border border-ink/20 text-ink/60">Cancelar</button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 text-xs text-ink/40 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} /> Excluir
                </button>
              )}
              <button
                onClick={handleEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-ink text-cream text-sm font-medium hover:bg-ink/80 transition-colors"
              >
                <Pencil size={13} /> Editar
              </button>
            </div>
          </div>
        )}

        {/* EDIT MODE */}
        {mode === "edit" && (
          <div className="space-y-4">
            {/* FORMATO */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold block mb-1.5">Formato</label>
              <input
                type="text"
                value={draft.formato}
                onChange={e => setDraft(d => ({ ...d, formato: e.target.value }))}
                placeholder="Ex: Reels, Carrossel, Post Único..."
                className="w-full rounded-xl border-2 border-terracotta/50 focus:border-terracotta bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors"
              />
            </div>

            {/* TEMA */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-ink/50 font-semibold block mb-1.5">Tema / Conteúdo do Post</label>
              <textarea
                value={draft.tema}
                onChange={e => setDraft(d => ({ ...d, tema: e.target.value }))}
                placeholder="O que você vai postar? Qual o tema, gancho ou ideia principal..."
                rows={4}
                className="w-full rounded-xl border border-ink/15 focus:border-ink/40 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors resize-none"
              />
            </div>

            {/* STORIES */}
            <div>
              <label className="flex items-center gap-1.5 text-[10px] tracking-[0.2em] uppercase text-ink/50 font-semibold mb-1.5">
                <span className="w-3 h-3 rounded bg-ink/20 inline-block" />
                Stories do Dia
              </label>
              <textarea
                value={draft.stories}
                onChange={e => setDraft(d => ({ ...d, stories: e.target.value }))}
                placeholder="O que você vai fazer nos stories? Bastidor, enquete, caixinha..."
                rows={3}
                className="w-full rounded-xl border border-ink/15 focus:border-ink/40 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors resize-none"
              />
            </div>

            {/* OBSERVAÇÕES */}
            <div>
              <label className="text-[10px] tracking-[0.2em] uppercase text-ink/50 font-semibold block mb-1.5">Observações</label>
              <textarea
                value={draft.observacoes}
                onChange={e => setDraft(d => ({ ...d, observacoes: e.target.value }))}
                placeholder="Notas, referências, lembretes..."
                rows={3}
                className="w-full rounded-xl border border-ink/15 focus:border-ink/40 bg-transparent px-4 py-2.5 text-sm text-ink placeholder:text-ink/30 outline-none transition-colors resize-none"
              />
            </div>

            {/* Save / Cancel */}
            <div className="flex items-center justify-between pt-1">
              {hasContent && (
                <button onClick={() => setMode("view")} className="text-sm text-ink/45 hover:text-ink transition-colors">
                  Cancelar
                </button>
              )}
              <button
                onClick={handleSave}
                className="ml-auto px-5 py-2.5 rounded-full bg-terracotta text-cream text-sm font-semibold hover:bg-terracotta-dark transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

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
    titulo: "O Seu Método",
    sub: "Passos, promessa e diferencial do seu método",
    to: "/metodo/pilar-2/metodo",
  },
];

const ACESSO_RAPIDO = [
  { icon: Sparkles, label: "Aprender IA", to: "/metodo/pilar-1/aprenda-ia", color: "text-violet-500" },
  { icon: Star, label: "Identidade de Marca", to: "/metodo/pilar-2/identidade", color: "text-pink-500" },
  { icon: Target, label: "Redes Sociais", to: "/metodo/pilar-2/redes-sociais", color: "text-sage" },
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
  { id: "detetive", icon: Search, titulo: "Mapa do Tempo", sub: "Descobriu onde o tempo vai", desbloqueada: true },
  { id: "arq", icon: Compass, titulo: "Arquétipos Decifrados", sub: "Você + cliente com clareza", desbloqueada: true },
  { id: "voz", icon: Mic, titulo: "Voz Definida", sub: "Sua marca tem som próprio", desbloqueada: false },
  { id: "visual", icon: Palette, titulo: "Identidade Visual", sub: "Paleta, tipografia e mood", desbloqueada: false },
  { id: "metodo", icon: Target, titulo: "Método Próprio", sub: "Sabe o que ensina", desbloqueada: true },
  { id: "pagina", icon: Globe, titulo: "Página Profissional", sub: "Página profissional no ar", desbloqueada: true },
  { id: "linha", icon: BookOpen, titulo: "Linha Editorial", sub: "Conteúdo com estratégia", desbloqueada: false },
  { id: "bio", icon: Star, titulo: "Bio do Instagram", sub: "Bio publicada no perfil", desbloqueada: false },
  { id: "rainha", icon: Crown, titulo: "Rainha da Jornada", sub: "Concluiu todos os pilares", desbloqueada: false },
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
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [calVersion, setCalVersion] = useState(0);

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
              <div className="rounded-2xl border border-terracotta/30 bg-white px-4 py-3 text-center min-w-[92px]">
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
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-terracotta shrink-0">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-base text-ink leading-tight">{d.titulo}</p>
                    <p className="text-xs text-ink/55 mt-0.5">{d.sub}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Link
                      to={d.to}
                      className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-ink/70 hover:bg-white"
                      aria-label="Abrir"
                    >
                      <ExternalLink size={14} />
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="w-9 h-9 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-ink/70 hover:bg-white"
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
                          ? "border-sage/40 bg-sage/10/60 text-sage line-through"
                          : "border-[var(--color-border)] text-ink hover:bg-white"
                      }`}
                    >
                      {p.feita ? (
                        <CheckCircle2 size={16} className="text-sage shrink-0" />
                      ) : (
                        <Circle size={16} className="text-ink/40 shrink-0" />
                      )}
                      <span className="truncate">{p.nome}</span>
                    </button>
                    <button
                      className="w-10 h-10 rounded-lg border border-[var(--color-border)] flex items-center justify-center text-terracotta hover:bg-white"
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
                          ? "bg-sage/100 border-sage text-white"
                          : "border-[var(--color-border)] text-ink/50 bg-white"
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
                  className="w-full mt-1 flex items-center justify-center gap-1.5 text-sm text-ink/55 rounded-lg border border-dashed border-[var(--color-border)] py-2.5 hover:bg-white"
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
                    ? "bg-sage/10 border-sage/30 text-sage"
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
              <div className="inline-flex rounded-full bg-white p-1 text-[12px]">
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
                const key = d.toISOString().slice(0, 10);
                // calVersion ensures dots refresh after save/delete
                const cal = calVersion >= 0 ? loadCalendar() : {};
                const entry = cal[key];
                const hasContent = entry && Object.values(entry).some(v => v.trim() !== "");
                return (
                  <div
                    key={d.toISOString()}
                    onClick={() => setSelectedDay(d)}
                    className={`bg-white p-2 min-h-[72px] cursor-pointer hover:bg-cream-warm/60 transition-colors ${
                      isToday ? "ring-1 ring-terracotta ring-inset" : ""
                    } ${isOther ? "opacity-40" : ""}`}
                  >
                    <p className={`text-[11px] font-semibold ${isToday ? "text-terracotta" : "text-ink/70"}`}>
                      {fmtDay(d)}
                    </p>
                    {hasContent && (
                      <div className="mt-1.5 space-y-0.5">
                        {entry.formato && (
                          <p className="text-[9px] leading-tight text-terracotta font-medium truncate">{entry.formato}</p>
                        )}
                        <span className="block w-1.5 h-1.5 rounded-full bg-terracotta" />
                      </div>
                    )}
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
                  className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 flex items-center gap-3 hover:bg-white transition-colors"
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
          <h2 className="font-display text-lg text-ink mb-1">Vitórias da jornada</h2>
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
              <h2 className="font-display text-lg text-ink">Suas vitórias</h2>
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

      {selectedDay && (
        <DayModal
          date={selectedDay}
          onClose={() => setSelectedDay(null)}
          onCalendarChange={() => setCalVersion(v => v + 1)}
        />
      )}
    </Layout>
  );
}
