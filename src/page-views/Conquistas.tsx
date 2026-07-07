import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import Layout from "../components/Layout";
import { getRanking } from "@/lib/admin.functions";
import { getRankingMes } from "@/lib/gamificacao.functions";
import { useProgresso } from "@/lib/use-progresso";
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
const POSTS_KEY = "leveza.posts-publicados.v1"; // posts publicados no Plano de Posts
const PILARES_KEY = "leveza.pilares-conteudo.v1";
const CONCLUSAO_KEYS = ["leveza.conclusao.p1", "leveza.conclusao.p2", "leveza.conclusao.p3", "leveza.conclusao.p4"];
const PONTOS_POR_POST = 15;
const PONTOS_POR_ETAPA = 5; // item de "Revise e celebre"
const PONTOS_POR_CAMPO_DOC = 10; // campo do Documento Mestre preenchido
const PONTOS_POR_PILAR = 5;

function readNumber(key: string): number {
  if (typeof window === "undefined") return 0;
  const n = Number(window.localStorage.getItem(key));
  return Number.isFinite(n) ? n : 0;
}

// Conta itens concluídos nas páginas "Revise e celebre" (arrays de índices).
function readConclusaoItems(): number {
  if (typeof window === "undefined") return 0;
  let total = 0;
  for (const k of CONCLUSAO_KEYS) {
    try { const arr = JSON.parse(window.localStorage.getItem(k) || "[]"); if (Array.isArray(arr)) total += arr.length; } catch { /* ignora */ }
  }
  return total;
}

// Conta campos preenchidos do Documento Mestre.
function readDocCampos(): number {
  if (typeof window === "undefined") return 0;
  try {
    const d = JSON.parse(window.localStorage.getItem(DOC_KEY) || "{}");
    let n = 0;
    for (const f of ["nome", "profissao", "oQueFaz", "comoResolve", "publico", "tomDeVoz"]) if ((d?.[f] || "").toString().trim()) n++;
    if (Array.isArray(d?.dores)) n += d.dores.filter((x: string) => (x || "").trim()).length;
    return n;
  } catch { return 0; }
}

function readPilaresDefinidos(): number {
  if (typeof window === "undefined") return 0;
  try {
    const arr = JSON.parse(window.localStorage.getItem(PILARES_KEY) || "[]");
    return Array.isArray(arr) ? arr.filter((p: { nome?: string }) => (p?.nome || "").trim()).length : 0;
  } catch { return 0; }
}

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
  const [postsPublicados, setPostsPublicados] = useState(0);
  const [extras, setExtras] = useState({ conclusao: 0, docCampos: 0, pilares: 0 });
  const [serverRanking, setServerRanking] = useState<{ pos: number; nome: string; tier: string; pontos: number; isMe: boolean; avatar?: string }[] | null>(null);
  const [rankingMes, setRankingMes] = useState<{ ranking: { pos: number; nome: string; posts: number; isMe: boolean }[] } | null>(null);

  const rankingFn = useServerFn(getRanking);
  // Pontos são a fonte de verdade do servidor (gamificação).
  const { pontos: pontosServidor } = useProgresso();

  useEffect(() => {
    setMounted(true);
    setAulasMap(readMap(AULAS_KEY));
    const doc = readJson<any>(DOC_KEY, {});
    if (doc?.nome) setNome(doc.nome.split(" ").slice(0, 2).join(" "));
    setBase(readJson<{ streak: number }>(BASE_KEY, { streak: 0 }));
    setPostsPublicados(readNumber(POSTS_KEY));
    setExtras({ conclusao: readConclusaoItems(), docCampos: readDocCampos(), pilares: readPilaresDefinidos() });
  }, []);

  const aulasFeitas = useMemo(
    () => Object.values(aulasMap).filter(Boolean).length,
    [aulasMap],
  );

  // Total autoritativo (servidor): tarefas + posts + Documento Mestre + prémios.
  const pontos = pontosServidor;

  // Carrega o ranking de todos os alunos.
  useEffect(() => {
    if (!mounted) return;
    let active = true;
    (async () => {
      try {
        const rows = (await rankingFn()) as typeof serverRanking;
        if (active && Array.isArray(rows) && rows.length) setServerRanking(rows);
      } catch { /* ranking indisponível — mostra só os teus pontos */ }
      try {
        const rm = (await getRankingMes()) as any;
        if (active && rm) setRankingMes(rm);
      } catch { /* competição indisponível */ }
    })();
    return () => { active = false; };
  }, [mounted, rankingFn]);

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

  // Ranking real (do servidor) quando disponível; senão mostra só o próprio.
  const listaRanking = useMemo(
    () => serverRanking ?? [{ pos: 1, nome: `${nome}`, tier: tier.label, pontos, isMe: true, avatar: undefined as string | undefined }],
    [serverRanking, nome, tier.label, pontos],
  );
  const ranking = useMemo(() => {
    if (serverRanking) { const me = serverRanking.find((r) => r.isMe); return me ? me.pos : serverRanking.length + 1; }
    return 1;
  }, [serverRanking]);

  const mesAno = mounted
    ? new Date().toLocaleDateString("pt-PT", { month: "long", year: "numeric" })
    : "";

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
            <PointRow emoji="🎒" label="Concluir uma aula ou etapa" pts="+15 pts" />
            <PointRow emoji="✅" label="Marcar tarefa em ‘Revise e celebre’" pts="+10 pts" />
            <PointRow emoji="📄" label="Preencher um campo do Documento Mestre" pts="+10 pts" />
            <PointRow emoji="🚀" label="Publicar um post no Plano" pts="+10 pts" />
            <PointRow emoji="🗓️" label="5 posts numa semana / 20 num mês" pts="+30 / +150" />
            <PointRow emoji="👑" label="Publicar mais posts no mês" pts="sessão 30 min + 300" />
          </div>
        </div>

        {/* Competição do Mês — quem publica mais posts */}
        <section className="bg-white rounded-2xl border border-[var(--color-border)] p-6 mb-8">
          <div className="flex items-center justify-between gap-3 mb-1">
            <h2 className="font-serif text-lg text-ink flex items-center gap-2">
              <Trophy size={18} className="text-amber-500" /> Competição do Mês
            </h2>
            <span className="text-[11px] uppercase tracking-[0.2em] text-ink/45">{mesAno}</span>
          </div>
          <p className="text-xs text-ink/55 mb-5 leading-relaxed">
            Quem <strong className="text-ink">publicar mais posts no mês</strong> (no Plano de Posts) ganha uma{" "}
            <strong className="text-terracotta">sessão de 30 min com a Cátia</strong>.
          </p>

          {rankingMes && rankingMes.ranking.length > 0 ? (
            <ul className="space-y-1.5">
              {rankingMes.ranking.slice(0, 3).map((r) => (
                <li
                  key={r.pos}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${r.isMe ? "bg-terracotta/8 border border-terracotta/25" : "bg-cream-warm/40"}`}
                >
                  <span className="text-lg w-7 text-center shrink-0">{r.pos === 1 ? "🥇" : r.pos === 2 ? "🥈" : "🥉"}</span>
                  <span className="text-sm text-ink flex-1 truncate">{r.nome}{r.isMe ? " (você)" : ""}</span>
                  <span className="text-sm font-semibold text-ink tabular-nums">{r.posts} <span className="text-ink/50 font-normal text-xs">posts</span></span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-cream-warm/30 p-5 text-center">
              <p className="text-sm text-ink/60">Ainda ninguém publicou este mês. Publique no <strong className="text-ink">Plano de Posts</strong> e lidere! 🚀</p>
            </div>
          )}
        </section>


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
            <div className="flex items-center justify-between gap-2 mb-4">
              <h2 className="font-serif text-lg text-ink">Ranking geral</h2>
              {!serverRanking && <span className="text-[10px] uppercase tracking-[0.14em] text-ink/40">a carregar…</span>}
            </div>
            <ul className="space-y-1">
              {listaRanking.map((r) => (
                <li
                  key={r.pos + r.nome}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${r.isMe ? "bg-terracotta/8 border border-terracotta/25" : ""}`}
                >
                  <span className="w-6 text-sm text-ink/50 tabular-nums">{r.pos}</span>
                  <div className="w-8 h-8 rounded-full bg-ink/10 overflow-hidden flex items-center justify-center text-[11px] font-medium text-ink/70 shrink-0">
                    {r.avatar ? (
                      <img src={r.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (r.nome || "?").split(" ").map((p) => p[0]).slice(0, 2).join("")
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink truncate">
                      {r.nome} {r.isMe && <span className="text-ink/45 text-xs">(você)</span>}
                    </p>
                    <p className="text-[11px] text-ink/50 flex items-center gap-1">
                      <Star size={10} className="text-amber-500" /> {r.tier}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-ink tabular-nums">{r.pontos}</span>
                </li>
              ))}
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

function PodiumSpot({ emoji, lugar, premio }: { emoji: string; lugar: string; premio: string }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-cream/60 p-4">
      <div className="flex items-center gap-2.5">
        <span className="text-2xl leading-none">{emoji}</span>
        <div>
          <p className="text-sm font-semibold text-ink">{lugar}</p>
          <p className="text-[11px] text-ink/45">Sem líder ainda este mês</p>
        </div>
      </div>
      <p className="text-xs text-ink/60 mt-3 leading-relaxed">{premio}</p>
    </div>
  );
}

