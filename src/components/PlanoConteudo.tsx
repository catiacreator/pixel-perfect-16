import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import {
  ClipboardPaste, Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight, Check, Link2,
  Trophy, CalendarDays, Clock, Sparkles, ArrowRight,
} from "lucide-react";
import { useProgresso } from "@/lib/use-progresso";
import { chaveMes, chaveSemana } from "@/lib/gamificacao";
import { getRankingMes } from "@/lib/gamificacao.functions";

// Plano de Conteúdo — a aluna cola até 4 resultados do ChatGPT; a plataforma
// parte-os em posts, ela agenda dia/mês/hora, e tudo aparece no calendário
// editorial. Por publicar = tag amarela; publicado (com link) = tag verde. Cada
// post publicado vale pontos nas Vitórias.

const KEY = "leveza.plano-conteudo.v1";
const PONTOS_KEY = "leveza.posts-publicados.v1";
const PONTOS_POR_POST = 15;

type Post = { id: string; tipo: string; titulo: string; conteudo: string; link: string; data: string; hora: string; pubId?: string };

const FONTES = [
  { id: "roteiros-simples", label: "Yap Content", cor: "#2E7CB8", multi: true },
  { id: "reels-virais", label: "Reels virais", cor: "#C8487E", multi: true },
  { id: "stories", label: "Stories", cor: "#F0A766", multi: false },
  { id: "carrosseis", label: "Carrosséis", cor: "#9E7FEC", multi: false },
];

const MESES = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const MES_CURTO = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const DIAS_SEMANA = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const iso = (y: number, m: number, d: number) => `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

function partir(texto: string, multi: boolean): string[] {
  const t = texto.trim();
  if (!t) return [];
  if (!multi) return [t];
  let partes = t.split(/\n\s*(?:[-—–]{3,}|={3,}|\*{3,})\s*\n/);
  if (partes.length < 2) partes = t.split(/\n(?=\s*(?:reel|ideia|roteiro|post)\s*#?\s*\d+\b)/i);
  const limpas = partes.map((p) => p.trim()).filter((p) => p.length > 15);
  return limpas.length ? limpas : [t];
}

function tituloDe(conteudo: string): string {
  const linha = conteudo.split("\n").map((l) => l.trim()).find((l) => l.length > 0) || "Post";
  const limpa = linha.replace(/^[#*>\-–—•\d\.\)\s]+/, "").replace(/\*\*/g, "").trim();
  return (limpa || linha).slice(0, 70);
}

export default function PlanoConteudo() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [aberto, setAberto] = useState<string | null>(null);
  const [aviso, setAviso] = useState("");
  const [mes, setMes] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });

  // Gamificação: publicar um post grava-o no servidor (conta para pontos e para
  // a competição mensal). postsServidor = posts publicados (fonte de verdade).
  const { registar, remover: removerPostServidor, posts: postsServidor } = useProgresso();
  const hojeD = new Date();
  const hojeYMD = iso(hojeD.getFullYear(), hojeD.getMonth(), hojeD.getDate());
  const semanaAtual = chaveSemana(hojeYMD);
  const mesAtual = chaveMes(hojeYMD);
  const nHoje = postsServidor.filter((p) => p.data === hojeYMD).length;
  const nSemana = postsServidor.filter((p) => chaveSemana(p.data) === semanaAtual).length;
  const nMes = postsServidor.filter((p) => chaveMes(p.data) === mesAtual).length;

  const togglePublicado = async (p: Post) => {
    if (p.pubId) {
      await removerPostServidor(p.pubId);
      setPost(p.id, { pubId: "" });
    } else {
      const dataYMD = p.data || hojeYMD;
      const novoId = await registar(dataYMD, p.titulo, p.tipo);
      if (novoId) setPost(p.id, { pubId: novoId, data: dataYMD });
    }
  };

  // Carrega uma vez (só leitura).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const p = raw ? JSON.parse(raw) : null;
      if (Array.isArray(p?.posts)) setPosts(p.posts.map((x: any) => ({ data: "", hora: "", ...x })));
    } catch { /* ignora */ }
  }, []);

  // Persistência EXPLÍCITA em cada alteração — evita a corrida de mount que apagava os dados.
  const persist = (next: Post[]) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ posts: next }));
      localStorage.setItem(PONTOS_KEY, String(next.filter((p) => !!p.pubId).length));
    } catch { /* ignora */ }
  };
  const update = (fn: (prev: Post[]) => Post[]) => setPosts((prev) => { const next = fn(prev); persist(next); return next; });

  const flash = (msg: string) => { setAviso(msg); window.setTimeout(() => setAviso(""), 2600); };

  const adicionar = (fonteId: string, label: string, multi: boolean) => {
    const pecas = partir(drafts[fonteId] || "", multi);
    if (!pecas.length) { flash("Cole o resultado do ChatGPT primeiro."); return; }
    const novos: Post[] = pecas.map((c) => ({ id: uid(), tipo: label, titulo: tituloDe(c), conteudo: c, link: "", data: "", hora: "" }));
    update((prev) => [...prev, ...novos]);
    setDrafts((d) => ({ ...d, [fonteId]: "" }));
    flash(`${novos.length} ${novos.length === 1 ? "post adicionado" : "posts adicionados"} — agora agende no calendário ✓`);
  };

  const setPost = (id: string, patch: Partial<Post>) => update((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remover = (id: string) => update((prev) => prev.filter((p) => p.id !== id));

  const corDe = (label: string) => FONTES.find((f) => f.label === label)?.cor || "#C8487E";
  const publicado = (p: Post) => !!p.pubId;

  const publicados = posts.filter(publicado).length;

  // ordem cronológica (sem data vai para o fim)
  const ordenados = [...posts].sort((a, b) => (a.data || "9999").localeCompare(b.data || "9999") || (a.hora || "99").localeCompare(b.hora || "99"));

  // grelha do mês visível
  const first = new Date(mes.y, mes.m, 1);
  const startDay = (first.getDay() + 6) % 7; // segunda = 0
  const diasNoMes = new Date(mes.y, mes.m + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= diasNoMes; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const postsNoDia = (d: number) => posts.filter((p) => p.data === iso(mes.y, mes.m, d));
  const mudarMes = (delta: number) => setMes(({ y, m }) => { const nm = m + delta; return { y: y + Math.floor(nm / 12), m: ((nm % 12) + 12) % 12 }; });

  const Tag = ({ p }: { p: Post }) =>
    publicado(p) ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full shrink-0">
        <Check size={12} /> Publicado
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-full shrink-0">
        <Clock size={12} /> Por publicar
      </span>
    );

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] tracking-[0.2em] uppercase text-terracotta font-semibold mb-1">Passo 3 · Agendar & publicar</p>
        <h3 className="font-serif text-xl text-ink mb-1.5">O seu plano de posts</h3>
        <p className="text-sm text-ink/60 leading-relaxed max-w-2xl">
          Cole o que o ChatGPT lhe devolveu — a plataforma parte em posts. Depois escolha o <b>dia, mês e hora</b> de cada
          post; eles aparecem no <b>calendário editorial</b>. Ao publicar, cole o link: fica <b className="text-emerald-700">verde</b> e ganha pontos.
        </p>
      </div>

      {/* Progresso + histórico (dia / semana / mês) */}
      <div className="rounded-2xl border border-border bg-white shadow-sm p-5">
        <div className="flex flex-wrap items-center gap-5">
          <Stat icon={<CalendarDays size={20} />} n={posts.length} label="posts no plano" tint="terracotta" />
          <Stat icon={<Check size={20} />} n={publicados} label="já publicados" tint="sage" />
          <p className="text-xs text-ink/50 ml-auto max-w-[240px] leading-relaxed">
            Quem publicar <b className="text-ink">mais posts no mês</b> ganha uma <b className="text-terracotta">sessão de 30 min</b> com a Cátia. Pontos nas <Link to="/conquistas" className="text-terracotta font-semibold">Vitórias</Link>.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2.5 mt-4 pt-4 border-t border-border">
          <Resumo n={nHoje} label="hoje" />
          <Resumo n={nSemana} label="esta semana" meta={5} bonus={30} />
          <Resumo n={nMes} label="este mês" meta={20} bonus={150} destaque />
        </div>
      </div>

      {/* Colar resultados */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">1 · Cole os resultados do ChatGPT (até 4 tipos)</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {FONTES.map((f) => (
            <div key={f.id} className="rounded-2xl border border-border bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: f.cor }} />
                <p className="text-sm font-semibold text-ink">{f.label}</p>
                <span className="text-[10px] text-ink/40 ml-auto">{f.multi ? "vira vários posts" : "vira 1 post"}</span>
              </div>
              <textarea
                rows={3}
                value={drafts[f.id] || ""}
                onChange={(e) => setDrafts((d) => ({ ...d, [f.id]: e.target.value }))}
                placeholder={`Cole aqui o resultado de "${f.label}"…`}
                className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-terracotta transition-colors resize-none mb-2"
              />
              <button onClick={() => adicionar(f.id, f.label, f.multi)} className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-ink text-cream hover:bg-terracotta transition-colors">
                <Plus size={14} /> Adicionar ao plano
              </button>
            </div>
          ))}
        </div>
        {aviso && <p className="text-xs text-sage mt-3 font-medium">{aviso}</p>}
      </div>

      {/* Lista de posts (agendar) */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">2 · Agende cada post</p>
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-cream-warm/30 p-8 text-center">
            <ClipboardPaste size={22} className="mx-auto text-ink/30 mb-3" />
            <p className="text-sm text-ink/55">Ainda não há posts. Cole um resultado acima para começar.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {ordenados.map((p) => {
              const expandido = aberto === p.id;
              const [Y, M, D] = p.data ? p.data.split("-").map(Number) : [0, 0, 0];
              return (
                <div key={p.id} id={`plano-${p.id}`} className="rounded-2xl border border-border bg-white shadow-sm overflow-hidden scroll-mt-24">
                  <div className="flex items-center gap-3 p-3.5">
                    <div className="flex flex-col items-center justify-center shrink-0 w-12 h-12 rounded-xl bg-cream-warm/60 border border-border">
                      {p.data ? (
                        <>
                          <span className="text-lg font-bold text-ink leading-none tabular-nums">{D}</span>
                          <span className="text-[9px] uppercase text-ink/50">{MES_CURTO[M - 1]}</span>
                        </>
                      ) : (
                        <CalendarDays size={17} className="text-ink/30" />
                      )}
                    </div>
                    <span className="w-1 self-stretch rounded-full" style={{ background: corDe(p.tipo) }} />
                    <button onClick={() => setAberto(expandido ? null : p.id)} className="flex-1 min-w-0 text-left">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: corDe(p.tipo) }}>
                        {p.tipo}{p.hora ? ` · ${p.hora}` : ""}
                      </span>
                      <p className="text-sm text-ink truncate">{p.titulo}</p>
                    </button>
                    <Tag p={p} />
                    <button onClick={() => setAberto(expandido ? null : p.id)} className="text-ink/40 shrink-0" aria-label="Abrir">
                      <ChevronDown size={17} className={`transition-transform ${expandido ? "rotate-180" : ""}`} />
                    </button>
                  </div>

                  {expandido && (
                    <div className="px-3.5 pb-4 border-t border-border pt-3">
                      <pre className="text-xs bg-cream rounded-xl p-3 whitespace-pre-wrap text-ink/70 leading-relaxed max-h-64 overflow-y-auto mb-3">{p.conteudo}</pre>

                      <div className="grid sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Data (dia e mês)</label>
                          <input type="date" value={p.data} onChange={(e) => setPost(p.id, { data: e.target.value })}
                            className="w-full rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta transition-colors" />
                        </div>
                        <div>
                          <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Hora</label>
                          <input type="time" value={p.hora} onChange={(e) => setPost(p.id, { hora: e.target.value })}
                            className="w-full rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta transition-colors" />
                        </div>
                      </div>

                      <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Link do post (opcional)</label>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-ink/30"><Link2 size={15} /></span>
                        <input value={p.link} onChange={(e) => setPost(p.id, { link: e.target.value })} placeholder="https://instagram.com/p/…"
                          className="flex-1 rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta transition-colors" />
                      </div>

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <button
                          onClick={() => togglePublicado(p)}
                          className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                            publicado(p)
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                              : "bg-ink text-cream border-transparent hover:bg-terracotta"
                          }`}
                          title={p.data ? `Conta no dia ${p.data}` : "Conta no dia de hoje"}
                        >
                          <Check size={14} /> {publicado(p) ? "Publicado ✓ (desfazer)" : "Marcar como publicado"}
                          {!publicado(p) && <span className="text-[11px] text-cream/70">+10</span>}
                        </button>
                        <button onClick={() => remover(p.id)} className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-terracotta">
                          <Trash2 size={13} /> Remover
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Calendário editorial (mês) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink">Calendário editorial</p>
          <div className="flex items-center gap-1">
            <button onClick={() => mudarMes(-1)} className="w-8 h-8 rounded-lg border border-border text-ink/60 hover:bg-ink/5 flex items-center justify-center" aria-label="Mês anterior"><ChevronLeft size={16} /></button>
            <span className="text-sm font-medium text-ink w-32 text-center">{MESES[mes.m]} {mes.y}</span>
            <button onClick={() => mudarMes(1)} className="w-8 h-8 rounded-lg border border-border text-ink/60 hover:bg-ink/5 flex items-center justify-center" aria-label="Mês seguinte"><ChevronRight size={16} /></button>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-white overflow-hidden">
          <div className="grid grid-cols-7 border-b border-border bg-cream-warm/50">
            {DIAS_SEMANA.map((d) => (
              <div key={d} className="text-[10px] tracking-[0.1em] uppercase text-ink/45 font-medium text-center py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((d, i) => {
              const dayPosts = d ? postsNoDia(d) : [];
              return (
                <div key={i} className={`min-h-[74px] border-b border-r border-border/60 p-1.5 ${d ? "" : "bg-cream-warm/20"}`}>
                  {d && <span className="text-[11px] text-ink/50 tabular-nums">{d}</span>}
                  <div className="space-y-1 mt-0.5">
                    {dayPosts.slice(0, 3).map((p) => {
                      const pub = publicado(p);
                      return (
                        <button
                          key={p.id}
                          onClick={() => { setAberto(p.id); document.getElementById(`plano-${p.id}`)?.scrollIntoView(); }}
                          title={p.titulo}
                          className={`block w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded border truncate ${pub ? "bg-emerald-100 border-emerald-300 text-emerald-800" : "bg-amber-100 border-amber-300 text-amber-800"}`}
                        >
                          {p.hora ? `${p.hora} ` : ""}{p.titulo}
                        </button>
                      );
                    })}
                    {dayPosts.length > 3 && <span className="text-[9px] text-ink/40 pl-1">+{dayPosts.length - 3}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-ink/55">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> Por publicar</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> Publicado</span>
        </div>
      </div>

      <RankingMes />

      <Link to="/metodo/pilar-2/redes-sociais?aba=criar" className="inline-flex items-center gap-2 text-sm font-semibold text-terracotta hover:text-terracotta-dark transition-colors">
        <Sparkles size={15} /> Criar mais conteúdo com os agentes <ArrowRight size={14} />
      </Link>
    </div>
  );
}

// Ranking do mês por nº de posts publicados. Quem lidera ganha uma sessão de 30 min.
function RankingMes() {
  const [dados, setDados] = useState<{ mes: string; ranking: { pos: number; nome: string; posts: number; isMe: boolean }[] } | null>(null);
  useEffect(() => {
    let vivo = true;
    getRankingMes().then((r: any) => { if (vivo) setDados(r); }).catch(() => {});
    return () => { vivo = false; };
  }, []);

  if (!dados || dados.ranking.length === 0) return null;

  return (
    <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-5">
      <div className="flex items-center gap-2 mb-1">
        <Trophy size={16} className="text-terracotta" />
        <p className="text-sm font-semibold text-ink">Ranking do mês · quem publica mais ganha</p>
      </div>
      <p className="text-xs text-ink/55 mb-3">O 1.º lugar ganha uma <b className="text-terracotta">sessão de 30 min</b> com a Cátia.</p>
      <div className="space-y-1">
        {dados.ranking.slice(0, 5).map((r) => (
          <div
            key={r.pos}
            className={`flex items-center gap-3 px-3 py-2 rounded-xl ${r.isMe ? "bg-terracotta/10" : "bg-white/60"}`}
          >
            <span className={`text-sm font-bold tabular-nums w-6 ${r.pos === 1 ? "text-terracotta" : "text-ink/40"}`}>{r.pos}º</span>
            <span className="text-sm text-ink flex-1 truncate">{r.nome}{r.isMe ? " (você)" : ""}</span>
            <span className="text-sm font-semibold text-ink tabular-nums">{r.posts} <span className="text-ink/50 font-normal text-xs">posts</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ icon, n, label, tint }: { icon: React.ReactNode; n: number; label: string; tint: string }) {
  const bg = tint === "sage" ? "bg-sage/10 text-sage" : tint === "gold" ? "bg-gold/15 text-terracotta" : "bg-terracotta/10 text-terracotta";
  return (
    <div className="flex items-center gap-3">
      <span className={`w-11 h-11 rounded-xl flex items-center justify-center ${bg}`}>{icon}</span>
      <div>
        <p className="text-2xl font-bold text-ink tabular-nums leading-none">{n}</p>
        <p className="text-xs text-ink/55 mt-1">{label}</p>
      </div>
    </div>
  );
}

// Contagem de posts publicados numa janela (hoje / semana / mês), com o bónus.
function Resumo({ n, label, meta, bonus, destaque }: { n: number; label: string; meta?: number; bonus?: number; destaque?: boolean }) {
  const atingiu = meta != null && n >= meta;
  return (
    <div className={`rounded-xl border p-3 text-center ${destaque ? "border-terracotta/30 bg-terracotta/5" : "border-border bg-cream-warm/30"}`}>
      <p className="text-2xl font-bold text-ink tabular-nums leading-none">{n}</p>
      <p className="text-[11px] text-ink/55 mt-1">posts {label}</p>
      {meta != null && (
        <p className={`text-[10px] mt-1.5 font-semibold ${atingiu ? "text-emerald-600" : "text-ink/40"}`}>
          {atingiu ? `✓ bónus +${bonus}` : `${meta} → +${bonus}`}
        </p>
      )}
    </div>
  );
}
