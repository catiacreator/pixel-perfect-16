import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import {
  Trophy,
  Sparkles,
  Flame,
  Medal,
  BookOpen,
  Calendar as CalendarIcon,
  ClipboardList,
  Landmark,
  Database,
  Star,
  Rocket,
} from "lucide-react";

const AULAS_KEY = "leveza.aulas-concluidas.v1";
const BASE_KEY = "leveza.minha-base.v1";
const DOC_KEY = "leveza.doc-mestre.v1";

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function readMap(key: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

type Tier = { label: string; min: number; next?: number; icon: typeof Star };
const TIERS: Tier[] = [
  { label: "Início", min: 0, next: 100, icon: Sparkles },
  { label: "Em Ação", min: 100, next: 500, icon: Rocket },
  { label: "Pro", min: 500, next: 1500, icon: Star },
  { label: "Master", min: 1500, next: 5000, icon: Medal },
  { label: "Lenda", min: 5000, icon: Trophy },
];

function tierFor(points: number) {
  let current = TIERS[0];
  for (const t of TIERS) if (points >= t.min) current = t;
  return current;
}

type TopRow = { nome: string; tier: string; pontos: number; avatar?: string };

const TOP_BASE: TopRow[] = [];


function fmtDate(d: Date) {
  return `${d.getDate()} de ${d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "")}.`;
}

export default function Conquistas() {
  const [mounted, setMounted] = useState(false);
  const [aulasMap, setAulasMap] = useState<Record<string, boolean>>({});
  const [nome, setNome] = useState("Você");
  const [base, setBase] = useState({ streak: 0 });

  useEffect(() => {
    setMounted(true);
    setAulasMap(readMap(AULAS_KEY));
    const doc = readJson<any>(DOC_KEY, {});
    if (doc?.nome) setNome(doc.nome.split(" ").slice(0, 2).join(" "));
    setBase(readJson<{ streak: number }>(BASE_KEY, { streak: 0 }));
  }, []);

  const aulasFeitas = useMemo(
    () => Object.values(aulasMap).filter(Boolean).length,
    [aulasMap],
  );

  const pontos = useMemo(() => {
    // 10 por aula + bônus de presença
    const base = aulasFeitas * 10;
    // pequeno bônus inicial para refletir uso (doc mestre, etc.)
    return base + (aulasFeitas > 0 ? 80 : 0);
  }, [aulasFeitas]);

  const tier = tierFor(pontos);
  const nextLabel = tier.next
    ? TIERS[TIERS.findIndex((t) => t.label === tier.label) + 1]?.label
    : null;
  const restante = tier.next ? Math.max(0, tier.next - pontos) : 0;
  const progresso = tier.next
    ? Math.min(100, Math.round(((pontos - tier.min) / (tier.next - tier.min)) * 100))
    : 100;

  const historico = useMemo(() => {
    const hoje = new Date();
    return Array.from({ length: Math.min(aulasFeitas, 12) }).map(() => ({
      titulo: "Aula concluída",
      data: fmtDate(hoje),
      delta: 10,
    }));
  }, [aulasFeitas]);

  const topComVoce = useMemo(() => {
    const linha: TopRow = { nome: `${nome} (você)`, tier: tier.label, pontos };
    const todos = [linha, ...TOP_BASE].sort((a, b) => b.pontos - a.pontos).slice(0, 20);
    return todos;
  }, [nome, tier.label, pontos]);

  const ranking = topComVoce.findIndex((r) => r.nome.endsWith("(você)")) + 1;

  if (!mounted) return <Layout><div className="h-[60vh]" /></Layout>;

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 py-12">
        {/* Hero */}
        <header className="flex items-start gap-4 mb-10">
          <div className="w-14 h-14 rounded-2xl bg-terracotta/15 flex items-center justify-center text-terracotta">
            <Trophy size={26} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="font-serif text-4xl md:text-5xl text-ink tracking-tight">As Minhas Vitórias</h1>
            <p className="text-ink/55 text-sm mt-2 max-w-2xl">
              Ganhe pontos a cada aula concluída, pilar finalizado, acesso diário,
              pesquisa respondida e uso da base de mentorado.
            </p>
          </div>
        </header>

        {/* Resumo */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-ink/45">
              <Sparkles size={13} /> Pontos Totais
            </div>
            <p className="font-serif text-5xl text-ink mt-3">{pontos}</p>
            <div className="flex items-center gap-2 mt-3">
              <Star size={14} className="text-amber-500" />
              <span className="text-sm text-ink/70">{tier.label}</span>
            </div>
            {tier.next && (
              <>
                <div className="h-1.5 bg-ink/5 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all"
                    style={{ width: `${progresso}%` }}
                  />
                </div>
                <p className="text-xs text-ink/55 mt-2">
                  Faltam <strong className="text-ink">{restante} pts</strong> para {nextLabel} 🔥
                </p>
              </>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-ink/45">
              <Flame size={13} /> Sequência
            </div>
            <p className="font-serif text-5xl text-ink mt-3">
              {base.streak || 1}<span className="text-base text-ink/55 ml-2 font-sans">dias seguidos</span>
            </p>
            <p className="text-xs text-ink/55 mt-4 leading-relaxed">
              Maior sequência: <strong className="text-ink">{base.streak || 1} dias</strong>. A cada 7 dias seguidos
              você ganha <strong className="text-ink">+5 pts</strong> de bônus.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-ink/45">
              <Medal size={13} /> Posição no Ranking
            </div>
            <p className="font-serif text-5xl text-ink mt-3">#{ranking}</p>
            <p className="text-xs text-ink/55 mt-4">Entre todas as mentoradas com pontos.</p>
          </div>
        </div>

        {/* Como ganhar pontos */}
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <h2 className="font-serif text-lg text-ink mb-4">Como ganhar pontos</h2>
          <div className="grid md:grid-cols-2 gap-x-10 gap-y-3 text-sm">
            <PointRow emoji="🎒" label="Concluir uma aula" pts="+10 pts" />
            <PointRow emoji="🏛️" label="Concluir um pilar" pts="+100 pts" />
            <PointRow emoji="📅" label="Acessar o sistema (1x por dia)" pts="+5 pts" />
            <PointRow emoji="🔥" label="Streak de 7 dias seguidos" pts="+5 pts bônus" />
            <PointRow emoji="📝" label="Responder uma pesquisa" pts="+50 pts" />
            <PointRow emoji="🍯" label="Usar a base de mentorado" pts="+5 pts/dia" />
          </div>
        </div>


        {/* Histórico + Top 20 */}
        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <h2 className="font-serif text-lg text-ink mb-4">Histórico recente</h2>
            {historico.length === 0 ? (
              <p className="text-sm text-ink/55">
                Quando concluir aulas, suas conquistas aparecem aqui.
              </p>
            ) : (
              <ul className="divide-y divide-[var(--color-border)]">
                {historico.map((h, i) => (
                  <li key={i} className="py-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center text-ink/70">
                      <BookOpen size={16} strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink">{h.titulo}</p>
                      <p className="text-xs text-ink/50">{h.data}</p>
                    </div>
                    <span className="text-sm font-medium text-sage">+{h.delta}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6">
            <h2 className="font-serif text-lg text-ink mb-4">Top 20 mentoradas</h2>
            <ul className="space-y-1">
              {topComVoce.map((r, i) => {
                const isYou = r.nome.endsWith("(você)");
                return (
                  <li
                    key={r.nome}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
                      isYou ? "bg-terracotta/8 border border-terracotta/25" : ""
                    }`}
                  >
                    <span className="w-6 text-sm text-ink/50 tabular-nums">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-ink/10 flex items-center justify-center text-[11px] font-medium text-ink/70">
                      {r.nome.replace(" (você)", "").split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-ink truncate">
                        {r.nome.replace(" (você)", "")}{" "}
                        {isYou && <span className="text-ink/45 text-xs">(você)</span>}
                      </p>
                      <p className="text-[11px] text-ink/50 flex items-center gap-1">
                        <Star size={10} className="text-amber-500" /> {r.tier}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-ink tabular-nums">{r.pontos}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}

function PointRow({
  emoji,
  label,
  pts,
}: {
  emoji: string;
  label: string;
  pts: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-base leading-none">{emoji}</span>
      <span className="text-ink/75">{label}</span>
      <span className="text-ink/40">—</span>
      <span className="font-semibold text-ink">{pts}</span>
    </div>
  );
}

