import { useEffect, useState } from "react";
import { Link } from "@/lib/router-compat";
import {
  ClipboardPaste, Plus, Trash2, ChevronDown, ChevronLeft, ChevronRight, Check, Link2,
  Trophy, CalendarDays, Clock, Sparkles, Download, Printer, Sheet,
} from "lucide-react";
import { useProgresso } from "@/lib/use-progresso";
import { chaveMes, chaveSemana } from "@/lib/gamificacao";
import { getRankingMes } from "@/lib/gamificacao.functions";
import { parsePlanoLeveza, type PecaLeveza } from "@/data/prompts/plano-leveza";

// Plano de Conteúdo — a aluna cola até 4 resultados do ChatGPT; a plataforma
// parte-os em posts, ela agenda dia/mês/hora, e tudo aparece no calendário
// editorial. Por publicar = tag amarela; publicado (com link) = tag verde. Cada
// post publicado vale pontos nas Vitórias.

const KEY = "leveza.plano-conteudo.v1";
const PONTOS_KEY = "leveza.posts-publicados.v1";
const SHEETS_KEY = "leveza.plano-sheets-url.v1";
const PONTOS_POR_POST = 15;

type Resultado = "bom" | "medio" | "mau";
type Post = { id: string; tipo: string; titulo: string; conteudo: string; link: string; data: string; hora: string; pubId?: string; agendado?: boolean; resultado?: Resultado; nota?: string };

const FONTES = [
  { id: "roteiros-simples", label: "Yap Content", cor: "#2E7CB8", multi: true },
  { id: "reels-virais", label: "Reels virais", cor: "#C8487E", multi: true },
  { id: "stories", label: "Stories", cor: "#F0A766", multi: false },
  { id: "carrosseis", label: "Carrosséis", cor: "#9E7FEC", multi: false },
  { id: "post-estatico", label: "Post estático", cor: "#3A9E88", multi: false },
];

const RESULTADO_LABEL: Record<Resultado, string> = { bom: "Resultou", medio: "Assim-assim", mau: "Não resultou" };

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
  const [planoLevezaDraft, setPlanoLevezaDraft] = useState("");
  const [abaImport, setAbaImport] = useState<"plano-leveza" | "pecas">("plano-leveza");
  const [mes, setMes] = useState(() => { const d = new Date(); return { y: d.getFullYear(), m: d.getMonth() }; });
  const [sheetsUrl, setSheetsUrl] = useState<string>(() => { try { return localStorage.getItem(SHEETS_KEY) || ""; } catch { return ""; } });
  const [sheetsOpen, setSheetsOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

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
      // Só conta como publicado COM o link da publicação.
      if (!p.link.trim()) return;
      const dataYMD = p.data || hojeYMD;
      const novoId = await registar(dataYMD, p.titulo, p.tipo);
      if (novoId) setPost(p.id, { pubId: novoId, data: dataYMD, agendado: false });
    }
  };

  // "Agendado" — validação leve que NÃO conta como publicado (não dá pontos).
  const toggleAgendado = (p: Post) => setPost(p.id, { agendado: !p.agendado });

  // Carrega ao montar e recarrega quando o estado é hidratado/muda de perfil —
  // o plano de posts pertence ao perfil ativo, por isso tem de refletir a troca.
  useEffect(() => {
    const carregar = () => {
      try {
        const raw = localStorage.getItem(KEY);
        const p = raw ? JSON.parse(raw) : null;
        setPosts(Array.isArray(p?.posts) ? p.posts.map((x: any) => ({ data: "", hora: "", ...x })) : []);
      } catch { setPosts([]); }
    };
    carregar();
    window.addEventListener("leveza:hydrated", carregar);
    return () => window.removeEventListener("leveza:hydrated", carregar);
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

  // Importa o Plano Leveza completo: já traz o tipo e o dia de cada peça, por
  // isso agendamos logo (Dia 1 = hoje, Dia 2 = amanhã, …).
  const TIPO_LABEL: Record<PecaLeveza["tipo"], string> = {
    Reel: "Reels virais",
    Carrossel: "Carrosséis",
    Noite: "Stories",
  };
  const importarPlanoLeveza = () => {
    const pecas = parsePlanoLeveza(planoLevezaDraft);
    if (!pecas.length) {
      flash('Não encontrei o bloco do Plano Estratégico. Cola o resultado inteiro do Claude (com as linhas @@DIA).');
      return;
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const novos: Post[] = pecas.map((p) => {
      const d = new Date(hoje);
      d.setDate(d.getDate() + Math.max(0, p.dia - 1));
      return {
        id: uid(),
        tipo: TIPO_LABEL[p.tipo],
        titulo: p.titulo,
        conteudo: p.conteudo,
        link: "",
        data: iso(d.getFullYear(), d.getMonth(), d.getDate()),
        hora: "",
      };
    });
    update((prev) => [...prev, ...novos]);
    setPlanoLevezaDraft("");
    flash(`${novos.length} posts do Plano Estratégico importados e agendados a partir de hoje ✓`);
  };

  const setPost = (id: string, patch: Partial<Post>) => update((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  const remover = (id: string) => update((prev) => prev.filter((p) => p.id !== id));

  const corDe = (label: string) => FONTES.find((f) => f.label === label)?.cor || "#C8487E";
  const publicado = (p: Post) => !!p.pubId;
  const agendado = (p: Post) => !!p.agendado && !p.pubId;

  const publicados = posts.filter(publicado).length;

  // ordem cronológica (sem data vai para o fim)
  const ordenados = [...posts].sort((a, b) => (a.data || "9999").localeCompare(b.data || "9999") || (a.hora || "99").localeCompare(b.hora || "99"));

  const estadoDe = (p: Post) => (publicado(p) ? "Publicado" : agendado(p) ? "Agendado" : "Por publicar");

  // Exporta o plano em CSV — abre no Trello (importar CSV), Google Sheets e Excel.
  const exportarCSV = () => {
    if (!posts.length) { flash("Ainda não há posts para exportar."); return; }
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const cols = ["Data", "Hora", "Tipo", "Título", "Estado", "Resultado", "Nota", "Link", "Conteúdo"];
    const linhas = ordenados.map((p) => [
      p.data || "",
      p.hora || "",
      p.tipo,
      p.titulo,
      estadoDe(p),
      p.resultado ? RESULTADO_LABEL[p.resultado] : "",
      p.nota || "",
      p.link || "",
      (p.conteudo || "").replace(/\r?\n/g, " "),
    ].map(esc).join(","));
    // BOM (﻿) para o Excel abrir os acentos corretamente.
    const csv = "﻿" + [cols.map(esc).join(","), ...linhas].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plano-conteudo-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    flash(`${posts.length} posts exportados em CSV ✓`);
  };

  // Exporta o plano numa vista limpa para imprimir / "Guardar como PDF".
  const exportarPDF = () => {
    if (!posts.length) { flash("Ainda não há posts para exportar."); return; }
    const w = window.open("", "_blank");
    if (!w) { flash("Permite pop-ups para gerar o PDF."); return; }
    const escH = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const estilo = (p: Post) => {
      const e = estadoDe(p);
      if (e === "Publicado") return "color:#0f766e;background:#d1fae5";
      if (e === "Agendado") return "color:#0369a1;background:#e0f2fe";
      return "color:#b45309;background:#fef3c7";
    };
    const linhas = ordenados.map((p) => `
      <tr>
        <td>${p.data ? escH(p.data) : "—"}${p.hora ? `<br><span class="muted">${escH(p.hora)}</span>` : ""}</td>
        <td>${escH(p.tipo)}</td>
        <td><strong>${escH(p.titulo)}</strong></td>
        <td><span class="tag" style="${estilo(p)}">${escH(estadoDe(p))}</span></td>
        <td>${p.resultado ? escH(RESULTADO_LABEL[p.resultado]) : "—"}${p.nota ? `<br><span class="muted">${escH(p.nota)}</span>` : ""}</td>
      </tr>`).join("");
    const doc = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Plano de Posts</title>
<style>
  *{box-sizing:border-box} body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#2b2521;margin:32px}
  h1{font-size:24px;margin:0 0 2px;color:#be6a43} .sub{color:#8a8078;font-size:13px;margin:0 0 22px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th{text-align:left;text-transform:uppercase;font-size:10px;letter-spacing:.08em;color:#8a8078;border-bottom:2px solid #eee;padding:8px 10px}
  td{padding:10px;border-bottom:1px solid #f0ece4;vertical-align:top}
  .muted{color:#8a8078;font-size:11px} .tag{font-size:11px;font-weight:600;padding:2px 9px;border-radius:999px;white-space:nowrap}
  @media print{body{margin:12mm}}
</style></head><body>
  <h1>Plano de Posts</h1>
  <p class="sub">Leveza no Digital &middot; ${escH(new Date().toLocaleDateString("pt-PT"))} &middot; ${posts.length} posts &middot; ${publicados} publicados</p>
  <table>
    <thead><tr><th>Data</th><th>Tipo</th><th>Título</th><th>Estado</th><th>Resultado / notas</th></tr></thead>
    <tbody>${linhas}</tbody>
  </table>
</body></html>`;
    w.document.write(doc);
    w.document.close();
    w.focus();
    window.setTimeout(() => { try { w.print(); } catch { /* ignora */ } }, 350);
    flash('Abri a vista de impressão — escolhe "Guardar como PDF" ✓');
  };

  const guardarSheetsUrl = (v: string) => {
    setSheetsUrl(v);
    try { localStorage.setItem(SHEETS_KEY, v.trim()); } catch { /* ignora */ }
  };

  // Envia o plano para a Google Sheet da aluna (via Apps Script Web App que ela cria).
  const sincronizarSheets = async () => {
    const url = sheetsUrl.trim();
    if (!url) { flash("Cola primeiro o link do teu Google Sheets."); return; }
    setSyncing(true);
    try {
      const payload = {
        exported_at: new Date().toISOString(),
        posts: ordenados.map((p) => ({
          data: p.data || "",
          hora: p.hora || "",
          tipo: p.tipo,
          titulo: p.titulo,
          estado: estadoDe(p),
          resultado: p.resultado ? RESULTADO_LABEL[p.resultado] : "",
          nota: p.nota || "",
          link: p.link || "",
          conteudo: (p.conteudo || "").replace(/\r?\n/g, " "),
        })),
      };
      // no-cors: o Apps Script recebe o corpo; a resposta é opaca (não a lemos).
      await fetch(url, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      flash(`${posts.length} posts enviados para o Google Sheets ✓ — confere a tua folha.`);
    } catch {
      flash("Não consegui enviar. Confirma o link do Sheets e tenta de novo.");
    } finally {
      setSyncing(false);
    }
  };

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
    ) : agendado(p) ? (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-100 border border-sky-300 px-2.5 py-1 rounded-full shrink-0">
        <Clock size={12} /> Agendado
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

      {/* Importar — duas formas, em abas: o Plano Leveza inteiro ou peça a peça. */}
      <div>
        <p className="text-sm font-semibold text-ink mb-3">1 · Traz os teus posts</p>
        <div className="flex gap-1.5 mb-4 p-1 rounded-full bg-ink/5 w-fit">
          {([
            { id: "plano-leveza", label: "Plano Estratégico" },
            { id: "pecas", label: "Peça a peça" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setAbaImport(t.id)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${
                abaImport === t.id ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {abaImport === "plano-leveza" && (
          <div className="rounded-2xl border p-5" style={{ borderColor: "#C8487E40", background: "#C8487E0d" }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: "#C8487E" }} />
              <p className="text-sm font-semibold text-ink">Importar o teu Plano Estratégico</p>
            </div>
            <p className="text-[13px] text-ink/60 mb-3 leading-relaxed">
              Fizeste o <Link to="/metodo/pilar-2/redes-sociais?aba=criar" className="font-semibold" style={{ color: "#C8487E" }}>Plano Estratégico</Link> e
              correste-o no Claude? Cola aqui o resultado <b>inteiro</b>. Cada peça entra já com o tipo certo e
              <b> agendada dia a dia a partir de hoje</b> — não tens de colar uma a uma.
            </p>
            <textarea
              rows={3}
              value={planoLevezaDraft}
              onChange={(e) => setPlanoLevezaDraft(e.target.value)}
              placeholder="Cola aqui tudo o que o Claude devolveu (com as linhas @@DIA)…"
              className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-[#C8487E] transition-colors resize-none mb-2 bg-white"
            />
            <button
              onClick={importarPlanoLeveza}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full text-cream transition-colors"
              style={{ background: "#C8487E" }}
            >
              <Sparkles size={14} /> Importar e agendar
            </button>
          </div>
        )}

        {abaImport === "pecas" && (
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
        )}

        {aviso && <p className="text-xs text-sage mt-3 font-medium">{aviso}</p>}
      </div>

      {/* Lista de posts (agendar) */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
          <p className="text-sm font-semibold text-ink">2 · Agende cada post</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportarCSV}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-full border border-border bg-white text-ink/70 hover:border-terracotta hover:text-terracotta transition-colors"
              title="Descarrega o teu plano em CSV — abre no Trello, Google Sheets e Excel"
            >
              <Download size={14} /> Exportar CSV (Trello)
            </button>
            <button
              onClick={exportarPDF}
              className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-full border border-border bg-white text-ink/70 hover:border-terracotta hover:text-terracotta transition-colors"
              title="Abre uma vista limpa para imprimir ou guardar como PDF"
            >
              <Printer size={14} /> PDF / imprimir
            </button>
            <button
              onClick={() => setSheetsOpen((v) => !v)}
              className={`inline-flex items-center gap-1.5 text-[13px] font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
                sheetsOpen || sheetsUrl
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                  : "border-border bg-white text-ink/70 hover:border-emerald-300 hover:text-emerald-700"
              }`}
              title="Enviar o plano para a tua Google Sheet (link fixo que se atualiza)"
            >
              <Sheet size={14} /> Google Sheets
            </button>
          </div>
        </div>

        {sheetsOpen && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Sheet size={16} className="text-emerald-600" />
              <p className="text-sm font-semibold text-ink">Sincronizar com a tua Google Sheet</p>
            </div>
            <p className="text-[13px] text-ink/60 mb-3 leading-relaxed">
              Cria uma vez o "recetor" na tua folha (Extensões → Apps Script → Implementar como App Web) e cola aqui o link que termina em <b>/exec</b>. Depois é só <b>Sincronizar</b> — o plano é escrito na tua folha e o link fica sempre igual.
            </p>
            <input
              value={sheetsUrl}
              onChange={(e) => guardarSheetsUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/…/exec"
              className="w-full rounded-xl border border-border p-2.5 text-sm outline-none focus:border-emerald-500 transition-colors mb-2 bg-white"
            />
            <button
              onClick={sincronizarSheets}
              disabled={syncing || !sheetsUrl.trim()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
            >
              <Sheet size={14} /> {syncing ? "A enviar…" : "Sincronizar agora"}
            </button>
          </div>
        )}
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
                      <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Título</label>
                      <input
                        value={p.titulo}
                        onChange={(e) => setPost(p.id, { titulo: e.target.value })}
                        className="w-full rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta transition-colors mb-3"
                      />

                      <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Conteúdo do post</label>
                      <textarea
                        value={p.conteudo}
                        onChange={(e) => setPost(p.id, { conteudo: e.target.value })}
                        rows={8}
                        className="w-full text-xs bg-cream rounded-xl p-3 leading-relaxed text-ink/80 outline-none focus:border-terracotta border border-border resize-y mb-3 font-mono"
                      />

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

                      <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Link da publicação <span className="text-terracotta normal-case">(obrigatório para validar)</span></label>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-ink/30"><Link2 size={15} /></span>
                        <input value={p.link} onChange={(e) => setPost(p.id, { link: e.target.value })} placeholder="https://instagram.com/p/…"
                          className="flex-1 rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta transition-colors" />
                      </div>

                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* Agendado — validação leve, não conta como publicado */}
                          {!publicado(p) && (
                            <button
                              onClick={() => toggleAgendado(p)}
                              className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-colors ${
                                agendado(p)
                                  ? "bg-sky-50 border-sky-200 text-sky-700 hover:bg-sky-100"
                                  : "bg-white border-border text-ink/70 hover:border-sky-300 hover:text-sky-700"
                              }`}
                              title="Agendado não conta para os pontos — só publicado com link conta"
                            >
                              <Clock size={14} /> {agendado(p) ? "Agendado ✓ (desfazer)" : "Marcar como agendado"}
                            </button>
                          )}

                          {/* Publicado — só com o link */}
                          <button
                            onClick={() => togglePublicado(p)}
                            disabled={!publicado(p) && !p.link.trim()}
                            className={`inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-colors disabled:opacity-45 disabled:cursor-not-allowed ${
                              publicado(p)
                                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                                : "bg-ink text-cream border-transparent hover:bg-terracotta"
                            }`}
                            title={publicado(p) ? "Desfazer publicação" : !p.link.trim() ? "Cola o link da publicação para validar" : p.data ? `Conta no dia ${p.data}` : "Conta no dia de hoje"}
                          >
                            <Check size={14} /> {publicado(p) ? "Publicado ✓ (desfazer)" : "Validar como publicado"}
                            {!publicado(p) && <span className="text-[11px] text-cream/70">+10</span>}
                          </button>
                        </div>
                        <button onClick={() => remover(p.id)} className="inline-flex items-center gap-1 text-xs text-ink/50 hover:text-terracotta">
                          <Trash2 size={13} /> Remover
                        </button>
                      </div>
                      {!publicado(p) && !p.link.trim() && (
                        <p className="text-[11px] text-ink/45 mt-2">Só conta como publicado depois de colares o <b className="text-ink/70">link da publicação</b>.</p>
                      )}

                      <div className="mt-4 pt-3 border-t border-border">
                        <label className="text-[11px] tracking-[0.1em] uppercase text-ink/45 mb-1.5 block">Resultado <span className="normal-case text-ink/35">— o que funcionou?</span></label>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {([
                            { id: "bom", label: "👍 Resultou" },
                            { id: "medio", label: "😐 Assim-assim" },
                            { id: "mau", label: "👎 Não resultou" },
                          ] as const).map((r) => (
                            <button
                              key={r.id}
                              onClick={() => setPost(p.id, { resultado: p.resultado === r.id ? undefined : r.id })}
                              className={`text-sm font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
                                p.resultado === r.id
                                  ? "bg-ink text-cream border-transparent"
                                  : "bg-white border-border text-ink/70 hover:border-terracotta hover:text-terracotta"
                              }`}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={p.nota || ""}
                          onChange={(e) => setPost(p.id, { nota: e.target.value })}
                          rows={2}
                          placeholder="Notas: o que resultou, o que mudarias para a próxima…"
                          className="w-full rounded-lg border border-border p-2 text-sm outline-none focus:border-terracotta transition-colors resize-none"
                        />
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
                      const cor = publicado(p)
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : agendado(p)
                          ? "bg-sky-100 border-sky-300 text-sky-800"
                          : "bg-amber-100 border-amber-300 text-amber-800";
                      return (
                        <button
                          key={p.id}
                          onClick={() => { setAberto(p.id); document.getElementById(`plano-${p.id}`)?.scrollIntoView(); }}
                          title={p.titulo}
                          className={`block w-full text-left text-[10px] leading-tight px-1.5 py-1 rounded border truncate ${cor}`}
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
        <div className="flex items-center gap-4 mt-3 text-xs text-ink/55 flex-wrap">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 border border-amber-300" /> Por publicar</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-sky-100 border border-sky-300" /> Agendado</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300" /> Publicado <span className="text-ink/40">(conta pontos)</span></span>
        </div>
      </div>

      <RankingMes />
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
