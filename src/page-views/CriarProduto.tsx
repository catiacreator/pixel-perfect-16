import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { useSearchParams, Link } from "@/lib/router-compat";
import {
  Package, Sparkles, Plus, Trash2, FileText, ChevronDown, Download, Lightbulb,
  Layers, ArrowRight, ArrowLeft, MessageCircle, LayoutGrid, Compass,
} from "lucide-react";
import PromptCard from "../components/PromptCard";
import ColarResultado from "../components/ColarResultado";
import { useCatIaConfig } from "@/lib/cat-ia";
import { type DocState, type Produto, EMPTY, padArray, loadInitial as loadDocPrincipal } from "@/lib/doc-mestre";
import {
  type Esteira, type NivelKey, type ProdutoNivel,
  ESTEIRA_EMPTY, ESTEIRA_KEY, NIVEIS,
  PRODUTO_DOC_KEY, loadProdutoDocMestre, loadEsteira,
  promptDescobrirPublico, parsePublicoResult, promptIdeiasEsteira, parseEsteiraIdeias,
  promptLandingPage, promptStories, promptPostsFunil, parsePostsFunil,
} from "@/lib/criar-produto";

const COR = "#2F9E6E"; // verde "Criar Produto"

const ABAS = [
  { id: "documento", n: 1, label: "Documento Mestre", desc: "A base (passos 1–2)", icon: FileText },
  { id: "esteira", n: 2, label: "A tua esteira", desc: "Ideias e produtos (3–5)", icon: Layers },
] as const;

// Passos do wizard da página "A tua esteira".
const PASSOS_ESTEIRA = [
  { n: 1, label: "Produtos que já tens" },
  { n: 2, label: "Desenha a tua esteira" },
  { n: 3, label: "Constrói cada produto" },
] as const;

// ──────────────────────────── campos ────────────────────────────
function Campo({ label, value, onChange, textarea, placeholder }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} placeholder={placeholder}
          className="w-full resize-y rounded-xl border border-border bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none focus:border-terracotta" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-border bg-white px-3.5 text-[15px] text-ink outline-none focus:border-terracotta" />
      )}
    </div>
  );
}

function ListaCampos({ label, valores, onChange }: { label: string; valores: string[]; onChange: (v: string[]) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-muted">{label}</label>
      <div className="space-y-2">
        {valores.map((v, i) => (
          <input key={i} value={v} onChange={(e) => onChange(valores.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={`${i + 1}.`}
            className="h-10 w-full rounded-xl border border-border bg-white px-3.5 text-sm text-ink outline-none focus:border-terracotta" />
        ))}
      </div>
    </div>
  );
}

// Instruções de uso no ChatGPT (mesmo tom do resto da plataforma).
function ComoUsar() {
  return (
    <div className="mb-5 rounded-2xl border border-terracotta/25 bg-terracotta/[0.05] p-5">
      <p className="flex items-center gap-2 text-sm font-semibold text-ink">
        <Sparkles size={16} className="text-terracotta" /> Como usar (no ChatGPT)
      </p>
      <ol className="mt-2 space-y-1.5 text-[13.5px] leading-relaxed text-ink/70">
        <li><strong className="text-ink/80">1.</strong> Carrega em <strong>“Copiar prompt”</strong> e depois em <strong>“Abrir agente no ChatGPT”</strong> (abre o teu Cat.IA).</li>
        <li><strong className="text-ink/80">2.</strong> No ChatGPT, <strong>cola (Ctrl/⌘ + V) e envia</strong>.</li>
        <li><strong className="text-ink/80">3.</strong> Copia a resposta e <strong>cola no campo</strong> logo por baixo de cada prompt.</li>
      </ol>
    </div>
  );
}

function NavRodape({ anterior, proximo, onIr }: { anterior?: { id: string; label: string }; proximo?: { id: string; label: string }; onIr: (id: string) => void }) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3 border-t border-border pt-5">
      {anterior ? (
        <button onClick={() => onIr(anterior.id)} className="inline-flex items-center gap-1.5 text-sm font-medium text-ink/60 hover:text-terracotta transition-colors">
          <ArrowLeft size={15} /> {anterior.label}
        </button>
      ) : <span />}
      {proximo && (
        <button onClick={() => onIr(proximo.id)} className="inline-flex items-center gap-2 rounded-full bg-terracotta px-5 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors">
          {proximo.label} <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
}

export default function CriarProduto() {
  const catIa = useCatIaConfig();
  const [params, setParams] = useSearchParams();
  const abaParam = params.get("aba") || "documento";
  const aba = ABAS.some((a) => a.id === abaParam) ? abaParam : "documento";
  const irPara = (id: string) => { setParams({ aba: id }); window.scrollTo({ top: 0 }); };

  const [doc, setDoc] = useState<DocState>(EMPTY);
  const [esteira, setEsteira] = useState<Esteira>(ESTEIRA_EMPTY);
  const [carregado, setCarregado] = useState(false);
  const [nivelAberto, setNivelAberto] = useState<Record<NivelKey, boolean>>({ low: true, medio: false, alto: false });
  const [passoEsteira, setPassoEsteira] = useState(1);
  const [nivelTab, setNivelTab] = useState<NivelKey>("low");
  const [colaPublico, setColaPublico] = useState("");
  const [preenchidoAviso, setPreenchidoAviso] = useState("");
  const [fonteDoc, setFonteDoc] = useState<"" | "principal" | "zero">("");
  const [avisoNiveis, setAvisoNiveis] = useState("");
  const [colaPosts, setColaPosts] = useState<Record<NivelKey, string>>({ low: "", medio: "", alto: "" });
  const [avisoPosts, setAvisoPosts] = useState<Record<NivelKey, string>>({ low: "", medio: "", alto: "" });

  useEffect(() => {
    setDoc(loadProdutoDocMestre());
    setEsteira(loadEsteira());
    setCarregado(true);
  }, []);

  // Documento Mestre PRÓPRIO deste produto (chave separada) — alimenta todos os prompts.
  const setDocCampo = <K extends keyof DocState>(k: K, v: DocState[K]) => {
    setDoc((prev) => {
      const next = { ...prev, [k]: v };
      try { window.localStorage.setItem(PRODUTO_DOC_KEY, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  };
  // Traz os dados do Documento Mestre PRINCIPAL (e da jornada) para este produto.
  // Só sobrepõe os campos que estão preenchidos no principal — não apaga nada.
  const buscarDoDocPrincipal = () => {
    const p = loadDocPrincipal();
    const merged: DocState = { ...doc };
    (Object.keys(p) as (keyof DocState)[]).forEach((k) => {
      const val = p[k] as unknown;
      const temValor = Array.isArray(val) ? val.some((x) => String(x ?? "").trim()) : String(val ?? "").trim();
      if (temValor) (merged as Record<string, unknown>)[k] = val;
    });
    setDoc(merged);
    try { window.localStorage.setItem(PRODUTO_DOC_KEY, JSON.stringify(merged)); } catch { /* quota */ }
    setFonteDoc("principal");
    setPreenchidoAviso("Trouxe os teus dados do Documento Mestre principal. Ajusta o que for específico deste produto.");
    window.setTimeout(() => setPreenchidoAviso(""), 4000);
  };

  const guardarEsteira = (next: Esteira) => {
    try { window.localStorage.setItem(ESTEIRA_KEY, JSON.stringify(next)); } catch { /* quota */ }
    return next;
  };
  const setIdeias = (v: string) => setEsteira((prev) => guardarEsteira({ ...prev, ideias: v }));
  const setNivel = (k: NivelKey, patch: Partial<ProdutoNivel>) =>
    setEsteira((prev) => guardarEsteira({ ...prev, niveis: { ...prev.niveis, [k]: { ...prev.niveis[k], ...patch } } }));

  // Cola-se o resultado do prompt "Descobrir público" e distribui-se pelos campos.
  const preencherPublico = () => {
    const { publico, dores, desejos } = parsePublicoResult(colaPublico);
    if (publico) setDocCampo("publico", publico);
    if (dores.length) setDocCampo("dores", padArray(dores, 5));
    if (desejos.length) setDocCampo("desejos", padArray(desejos, 5));
    const nada = !publico && !dores.length && !desejos.length;
    setPreenchidoAviso(
      nada
        ? "Não consegui ler o formato. Confirma que colaste o bloco com PÚBLICO / DORES / DESEJOS."
        : `Preenchido: ${publico ? "público, " : ""}${dores.length} dores e ${desejos.length} desejos. Revê os campos abaixo.`,
    );
    setTimeout(() => setPreenchidoAviso(""), 6000);
  };

  // Cola-se o resultado do prompt de ideias → preenche nome/formato/preço/transformação dos 3 níveis.
  const preencherNiveis = () => {
    const p = parseEsteiraIdeias(esteira.ideias);
    let n = 0;
    (["low", "medio", "alto"] as NivelKey[]).forEach((k) => {
      const v = p[k];
      const patch: Partial<ProdutoNivel> = {};
      if (v.nome) patch.nome = v.nome;
      if (v.formato) patch.formato = v.formato;
      if (v.transformacao) patch.transformacao = v.transformacao;
      if (v.preco) patch.preco = v.preco;
      if (Object.keys(patch).length) { setNivel(k, patch); n++; }
    });
    setAvisoNiveis(n
      ? `Preenchi os campos de ${n} nível(is). Revê abaixo.`
      : "Não consegui ler os níveis. Confirma o formato (=== LOW/MÉDIO/ALTO TICKET ===).");
    setTimeout(() => setAvisoNiveis(""), 6000);
  };

  // Cola-se o resultado dos posts → separa por topo/meio/fundo de funil.
  const distribuirPosts = (k: NivelKey) => {
    const { topo, meio, fundo } = parsePostsFunil(colaPosts[k]);
    const ok = !!(topo || meio || fundo);
    if (ok) setNivel(k, { postsTopo: topo, postsMeio: meio, postsFundo: fundo });
    setAvisoPosts((a) => ({ ...a, [k]: ok ? "Distribuído por topo/meio/fundo. Revê abaixo." : "Não consegui separar. Confirma os cabeçalhos TOPO/MEIO/FUNDO." }));
    setTimeout(() => setAvisoPosts((a) => ({ ...a, [k]: "" })), 6000);
  };

  const addProduto = () => setDocCampo("produtos", [...doc.produtos, { nome: "", descricao: "", ticketMedio: "" }]);
  const updProduto = (i: number, patch: Partial<Produto>) => setDocCampo("produtos", doc.produtos.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const delProduto = (i: number) => setDocCampo("produtos", doc.produtos.filter((_, j) => j !== i));

  const progresso = useMemo(() => {
    let feito = 0;
    (Object.keys(esteira.niveis) as NivelKey[]).forEach((k) => {
      const n = esteira.niveis[k];
      if (n.landing.trim()) feito++;
      if (n.stories.trim()) feito++;
      if ([n.postsTopo, n.postsMeio, n.postsFundo].some((x) => x.trim())) feito++;
    });
    return feito;
  }, [esteira]);

  const docPreenchido = !!(doc.nome.trim() && doc.publico.trim());

  const exportarEsteira = () => {
    const linhas: string[] = [`# A minha esteira de produtos — ${doc.nome || "Cátia Creator"}`, ""];
    NIVEIS.forEach(({ key, rotulo }) => {
      const n = esteira.niveis[key];
      linhas.push(`\n\n═══════════════════════════════\n${rotulo.toUpperCase()}${n.nome ? " — " + n.nome : ""}\n═══════════════════════════════`);
      if (n.formato) linhas.push(`Formato: ${n.formato}`);
      if (n.transformacao) linhas.push(`Transformação: ${n.transformacao}`);
      if (n.preco) linhas.push(`Preço: ${n.preco}`);
      if (n.landing) linhas.push(`\n── PÁGINA DE VENDAS ──\n${n.landing}`);
      if (n.stories) linhas.push(`\n── SEQUÊNCIA DE STORIES ──\n${n.stories}`);
      if (n.postsTopo || n.postsMeio || n.postsFundo) {
        linhas.push(`\n── POSTS DE FEED ──`);
        if (n.postsTopo) linhas.push(`\n[TOPO DE FUNIL]\n${n.postsTopo}`);
        if (n.postsMeio) linhas.push(`\n[MEIO DE FUNIL]\n${n.postsMeio}`);
        if (n.postsFundo) linhas.push(`\n[FUNDO DE FUNIL]\n${n.postsFundo}`);
      }
    });
    const blob = new Blob([linhas.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "esteira-de-produtos.txt"; a.click();
    URL.revokeObjectURL(url);
  };

  // Exporta a esteira numa vista limpa para imprimir / "Guardar como PDF".
  const exportarEsteiraPDF = () => {
    const w = window.open("", "_blank");
    if (!w) { setAvisoNiveis("Permite pop-ups para gerar o PDF."); window.setTimeout(() => setAvisoNiveis(""), 4000); return; }
    const escH = (v: unknown) => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const nl2br = (s: string) => escH(s).replace(/\r?\n/g, "<br>");
    const bloco = (titulo: string, txt?: string) => (txt && txt.trim()) ? `<h3>${escH(titulo)}</h3><div class="corpo">${nl2br(txt)}</div>` : "";

    const produtosAtuais = doc.produtos.filter((p) => (p.nome || p.descricao || p.ticketMedio).trim());
    const secProdutos = produtosAtuais.length
      ? `<section><h2>Produtos/serviços que já tens</h2><ul>${produtosAtuais.map((p) => `<li><b>${escH(p.nome)}</b>${p.ticketMedio ? ` — ${escH(p.ticketMedio)}` : ""}${p.descricao ? `<br><span class="meta">${escH(p.descricao)}</span>` : ""}</li>`).join("")}</ul></section>`
      : "";

    const secNiveis = NIVEIS.map(({ key, rotulo, cor }) => {
      const n = esteira.niveis[key];
      const temAlgo = [n.nome, n.formato, n.transformacao, n.preco, n.landing, n.stories, n.postsTopo, n.postsMeio, n.postsFundo].some((x) => (x || "").trim());
      if (!temAlgo) return "";
      const meta = [n.formato && `Formato: ${escH(n.formato)}`, n.preco && `Preço: ${escH(n.preco)}`, n.transformacao && `Transformação: ${escH(n.transformacao)}`].filter(Boolean).join(" &middot; ");
      const posts = (n.postsTopo || n.postsMeio || n.postsFundo)
        ? `<h3>Posts de feed</h3>${bloco("Topo de funil", n.postsTopo)}${bloco("Meio de funil", n.postsMeio)}${bloco("Fundo de funil", n.postsFundo)}`
        : "";
      return `<section>
        <h2 style="border-color:${cor}"><span class="dot" style="background:${cor}"></span>${escH(rotulo)}${n.nome ? ` — ${escH(n.nome)}` : ""}</h2>
        ${meta ? `<p class="meta">${meta}</p>` : ""}
        ${bloco("Página de vendas", n.landing)}
        ${bloco("Sequência de stories", n.stories)}
        ${posts}
      </section>`;
    }).join("");

    const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Esteira de produtos</title>
<style>
  *{box-sizing:border-box} body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#2b2521;margin:32px;line-height:1.5}
  h1{font-size:24px;margin:0 0 2px;color:#2f9e6e} .sub{color:#8a8078;font-size:13px;margin:0 0 22px}
  section{margin:0 0 26px;page-break-inside:avoid}
  h2{font-size:17px;margin:0 0 6px;padding-bottom:6px;border-bottom:2px solid #eee;display:flex;align-items:center;gap:8px}
  .dot{width:12px;height:12px;border-radius:3px;display:inline-block}
  h3{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#8a8078;margin:14px 0 4px}
  .meta{color:#6b6157;font-size:13px;margin:0 0 6px}
  .corpo{white-space:normal;font-size:13.5px;color:#2b2521;background:#faf7f2;border:1px solid #f0ece4;border-radius:8px;padding:10px 12px}
  ul{margin:0;padding-left:18px} li{margin:0 0 6px;font-size:13.5px}
  @media print{body{margin:12mm}}
</style></head><body>
  <h1>A minha esteira de produtos</h1>
  <p class="sub">${escH(doc.nome || "Cátia Creator")} &middot; ${escH(new Date().toLocaleDateString("pt-PT"))}</p>
  ${secProdutos}
  ${secNiveis || '<p class="meta">Ainda não há produtos preenchidos na esteira.</p>'}
</body></html>`;
    w.document.write(html);
    w.document.close();
    w.focus();
    window.setTimeout(() => { try { w.print(); } catch { /* ignora */ } }, 350);
  };

  if (!carregado) return <Layout><div className="py-20 text-center text-ink/40">A carregar…</div></Layout>;

  return (
    <div className="theme-verde">
    <Layout>
      <div className="mx-auto max-w-6xl px-5 md:px-8 pt-8 pb-16 flex flex-col md:flex-row gap-6 md:gap-10">
        {/* ── Menu lateral ── */}
        <aside className="md:w-60 lg:w-64 shrink-0">
          <div className="md:sticky md:top-24">
            <Link to="/" className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-ink/55 hover:text-terracotta transition-colors">
              <ArrowLeft size={14} /> Início
            </Link>
            <p className="mb-3 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-terracotta">
              <Package size={13} /> Criar Produto
            </p>
            <nav className="space-y-1.5">
              {ABAS.map((a) => {
                const ativo = aba === a.id;
                const Icon = a.icon;
                return (
                  <button
                    key={a.id}
                    onClick={() => irPara(a.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${ativo ? "bg-terracotta text-cream" : "text-ink/70 hover:bg-ink/5"}`}
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold ${ativo ? "bg-white/20" : "bg-ink/8 text-ink/60"}`}>
                      {a.n}
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-sm font-semibold"><Icon size={14} /> {a.label}</span>
                      <span className={`block text-[11px] ${ativo ? "text-cream/75" : "text-ink/45"}`}>{a.desc}</span>
                    </span>
                  </button>
                );
              })}
            </nav>
            <div className="mt-5 rounded-xl border border-border bg-cream-warm/30 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.1em] text-ink/45">Progresso</p>
              <p className="mt-0.5 text-sm text-ink/70"><strong className="text-terracotta">{progresso}/9</strong> entregáveis</p>
            </div>
          </div>
        </aside>

        {/* ── Conteúdo ── */}
        <main className="min-w-0 flex-1 max-w-3xl">
          {/* PÁGINA 1 — Documento Mestre */}
          {aba === "documento" && (
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
                <FileText size={13} /> Documento Mestre do produto
              </span>
              <h1 className="mb-2 font-serif text-3xl md:text-4xl leading-tight text-ink">Cria o teu Documento Mestre</h1>
              <p className="mb-6 max-w-2xl text-lg text-ink/70">
                Esta é a base deste produto — <strong>separada</strong> do teu Documento Mestre principal. É esta base que <strong>alimenta todos os prompts</strong> da página seguinte, por isso quanto melhor a preencheres, melhor o resultado.
              </p>

              {!fonteDoc && !doc.nome.trim() && (() => {
                const principal = loadDocPrincipal();
                const temPrincipal = !!(String(principal.nome ?? "").trim() || String(principal.oQueFaz ?? "").trim() || String(principal.publico ?? "").trim());
                return (
                  <div className="mb-6 rounded-2xl border-2 border-terracotta/25 bg-terracotta/[0.05] p-5">
                    <p className="text-sm font-semibold text-ink mb-1">Como queres começar esta base?</p>
                    <p className="text-[13px] text-ink/60 mb-3">Aproveita o teu <strong>Documento Mestre principal</strong> (e a tua jornada) — trago o nome, o que fazes, como resolves, o público, as dores e o tom de voz — ou começa do zero.</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={buscarDoDocPrincipal}
                        disabled={!temPrincipal}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-terracotta text-cream hover:bg-terracotta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <FileText size={14} /> Buscar do Documento Mestre
                      </button>
                      <button
                        onClick={() => setFonteDoc("zero")}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border border-border bg-white text-ink/70 hover:text-ink transition-colors"
                      >
                        Começar do zero
                      </button>
                    </div>
                    {!temPrincipal && (
                      <p className="text-[11px] text-ink/45 mt-2">O teu Documento Mestre principal ainda está vazio — preenche-o primeiro para o aproveitares aqui.</p>
                    )}
                  </div>
                );
              })()}

              <div className="space-y-6">
                <div className="rounded-2xl border border-border bg-cream-warm/30 p-5 space-y-4">
                  <h2 className="font-serif text-xl text-ink">1. Quem és e o que fazes</h2>
                  <Campo label="Nome" value={doc.nome} onChange={(v) => setDocCampo("nome", v)} />
                  <Campo label="Profissão / especialidade" value={doc.profissao} onChange={(v) => setDocCampo("profissao", v)} />
                  <Campo label="O que fazes (1 frase)" value={doc.oQueFaz} onChange={(v) => setDocCampo("oQueFaz", v)} textarea />
                  <Campo label="Como resolves" value={doc.comoResolve} onChange={(v) => setDocCampo("comoResolve", v)} textarea />
                  <Campo label="Tom de voz da marca" value={doc.tomDeVoz} onChange={(v) => setDocCampo("tomDeVoz", v)} textarea placeholder="Ex.: próximo, direto, sem jargão…" />
                </div>

                <div className="rounded-2xl border border-border bg-cream-warm/30 p-5 space-y-4">
                  <h2 className="font-serif text-xl text-ink">2. O teu público</h2>

                  {/* Ajudante: descobrir o público com o Cat.IA */}
                  <div className="rounded-xl border border-terracotta/25 bg-terracotta/[0.05] p-4">
                    <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Compass size={16} className="text-terracotta" /> Não sabes bem o teu público? Descobre com o Cat.IA
                    </p>
                    <p className="mt-1 text-[13px] text-ink/65">Escolhe uma das formas — depois copia o resultado para os campos abaixo.</p>
                    <ul className="mt-2 space-y-2 text-[13px] leading-relaxed text-ink/70">
                      <li>
                        <strong className="text-ink/80">A) Entrevista:</strong> abre o Cat.IA, cola o prompt e responde às perguntas que ele faz. No fim dá-te o público, 5 dores e 5 desejos prontos a copiar.
                      </li>
                      <li>
                        <strong className="text-ink/80">B) Análise do teu Instagram:</strong> anexa ao Cat.IA e cola o prompt. Precisas de prints de:
                        <span className="mt-1 flex flex-wrap gap-1.5">
                          {["a tua bio", "6–9 posts com mais alcance", "comentários e DMs recorrentes", "Insights → Público (idade, género, local)"].map((t) => (
                            <span key={t} className="rounded-full bg-white border border-terracotta/20 px-2.5 py-0.5 text-[11.5px] text-ink/70">{t}</span>
                          ))}
                        </span>
                      </li>
                    </ul>
                    <div className="mt-3">
                      <PromptCard
                        titulo="Descobrir o meu público"
                        descricao="O Cat.IA entrevista-te ou analisa os teus prints do Instagram."
                        prompt={promptDescobrirPublico(doc)}
                        icon={<Compass size={18} />}
                        cor={COR} botaoCor={COR} agente="Cat.IA" agenteUrl={catIa.url} agentePass={catIa.password}
                      />
                    </div>

                    {/* Colar TODO o resultado → preenche público + dores + desejos */}
                    <div className="mt-3 rounded-xl border border-terracotta/20 bg-white p-3">
                      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45">
                        Cola aqui TODO o resultado do Cat.IA
                      </label>
                      <textarea
                        value={colaPublico}
                        onChange={(e) => setColaPublico(e.target.value)}
                        rows={colaPublico ? 6 : 3}
                        placeholder="Cola o bloco com PÚBLICO / DORES / DESEJOS e eu preencho os campos por ti…"
                        className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-[13.5px] leading-relaxed text-ink/85 outline-none focus:border-terracotta"
                      />
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        <button
                          onClick={preencherPublico}
                          disabled={!colaPublico.trim()}
                          className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors disabled:opacity-40"
                        >
                          <Sparkles size={14} /> Preencher campos automaticamente
                        </button>
                        {preenchidoAviso && <span className="text-[12.5px] text-ink/70">{preenchidoAviso}</span>}
                      </div>
                    </div>
                  </div>

                  <Campo label="Público que atendes" value={doc.publico} onChange={(v) => setDocCampo("publico", v)} textarea />
                  <ListaCampos label="Dores do público" valores={padArray(doc.dores, 5)} onChange={(v) => setDocCampo("dores", v)} />
                  <ListaCampos label="Desejos do público" valores={padArray(doc.desejos, 5)} onChange={(v) => setDocCampo("desejos", v)} />
                </div>
              </div>

              <NavRodape proximo={{ id: "esteira", label: "A tua esteira" }} onIr={irPara} />
            </div>
          )}

          {/* PÁGINA 2 — A tua esteira (passos 3, 4 e 5 juntos) */}
          {aba === "esteira" && (
            <div>
              <span className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
                <Layers size={13} /> A tua esteira de produtos
              </span>
              <h1 className="mb-2 font-serif text-3xl md:text-4xl leading-tight text-ink">Cria a tua esteira — do zero à venda</h1>
              <p className="mb-6 max-w-2xl text-lg text-ink/70">
                Tudo num só sítio: regista o que já tens, gera as ideias dos 3 níveis e constrói cada produto (página de vendas, stories e posts). Usa o teu <strong>Documento Mestre</strong>, por isso sai tudo na tua voz.
              </p>

              {!docPreenchido && (
                <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-[13px] text-amber-800">
                  <span>Preenche primeiro o <strong>Documento Mestre</strong> para os prompts saírem na tua voz.</span>
                  <button onClick={() => irPara("documento")} className="shrink-0 font-semibold underline">Ir</button>
                </div>
              )}

              {/* Passos do wizard */}
              <div className="mb-6 flex flex-wrap gap-2">
                {PASSOS_ESTEIRA.map((p) => {
                  const on = passoEsteira === p.n;
                  const feito = passoEsteira > p.n;
                  return (
                    <button
                      key={p.n}
                      onClick={() => { setPassoEsteira(p.n); window.scrollTo({ top: 0 }); }}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${on ? "border-terracotta bg-terracotta text-cream" : "border-border bg-white text-ink/70 hover:border-terracotta/50"}`}
                    >
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${on ? "bg-cream/25 text-cream" : feito ? "bg-terracotta/15 text-terracotta" : "bg-ink/10 text-ink/50"}`}>{p.n}</span>
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {passoEsteira >= 2 && <ComoUsar />}

              {/* Passo 1 — Produtos que já tens */}
              {passoEsteira === 1 && (
              <div className="rounded-2xl border border-border bg-cream-warm/30 p-5 space-y-4 mb-6">
                <h2 className="font-serif text-xl text-ink">Produtos/serviços que já tens</h2>
                <div className="space-y-2">
                  {doc.produtos.map((p, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-2">
                      <input value={p.nome} onChange={(e) => updProduto(i, { nome: e.target.value })} placeholder="Nome"
                        className="h-10 min-w-[120px] flex-1 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-terracotta" />
                      <input value={p.descricao} onChange={(e) => updProduto(i, { descricao: e.target.value })} placeholder="Descrição"
                        className="h-10 min-w-[140px] flex-[2] rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-terracotta" />
                      <input value={p.ticketMedio} onChange={(e) => updProduto(i, { ticketMedio: e.target.value })} placeholder="€"
                        className="h-10 w-20 rounded-xl border border-border bg-white px-3 text-sm outline-none focus:border-terracotta" />
                      <button onClick={() => delProduto(i)} className="p-1.5 text-ink/40 hover:text-rose-600" aria-label="Remover"><Trash2 size={15} /></button>
                    </div>
                  ))}
                </div>
                <button onClick={addProduto} className="inline-flex items-center gap-1.5 text-sm font-medium text-terracotta hover:text-terracotta-dark">
                  <Plus size={14} /> Adicionar produto atual
                </button>
              </div>
              )}

              {/* Passo 2 — Desenha a tua esteira */}
              {passoEsteira === 2 && (
              <div className="mb-8">
                <h2 className="mb-1 font-serif text-xl text-ink">Desenha a tua esteira</h2>
                <p className="mb-4 text-[15px] text-ink/60">Gera as ideias dos 3 níveis (low, médio e alto ticket) e cola o resultado. Depois preenche cada nível já a seguir.</p>
                <PromptCard
                  numero={1}
                  titulo="Ideias da esteira (3 níveis)"
                  descricao="Low, médio e alto ticket sugeridos para o teu público."
                  prompt={promptIdeiasEsteira(doc)}
                  icon={<Lightbulb size={18} />}
                  cor={COR}
                  botaoCor={COR}
                  agente="Cat.IA"
                  agenteUrl={catIa.url}
                  agentePass={catIa.password}
                />
                <ColarResultado label="Ideias que o Cat.IA sugeriu" value={esteira.ideias} onChange={setIdeias} placeholder="Cola aqui as 3 ideias (low, médio, alto)…" />
                <div className="-mt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={preencherNiveis}
                    disabled={!esteira.ideias.trim()}
                    className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors disabled:opacity-40"
                  >
                    <Sparkles size={14} /> Preencher os 3 níveis automaticamente
                  </button>
                  {avisoNiveis && <span className="text-[12.5px] text-ink/70">{avisoNiveis}</span>}
                </div>
              </div>
              )}

              {/* Passo 3 — Constrói cada produto (tabs por nível) */}
              {passoEsteira === 3 && (
              <div>
                <h2 className="mb-1 font-serif text-xl text-ink">Constrói cada produto</h2>
                <p className="mb-4 text-[15px] text-ink/60">Escolhe o nível e, para cada um, define o produto e gera a página de vendas, os stories e os posts de feed.</p>

                {/* Tabs dos níveis */}
                <div className="mb-4 flex flex-wrap gap-2">
                  {NIVEIS.map(({ key, rotulo, etiqueta, cor }) => {
                    const on = nivelTab === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setNivelTab(key)}
                        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-colors ${on ? "border-transparent text-cream" : "border-border bg-white text-ink/70 hover:border-terracotta/50"}`}
                        style={on ? { backgroundColor: cor } : undefined}
                      >
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: on ? "rgba(255,255,255,0.65)" : cor }} />
                        {rotulo} <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">{etiqueta}</span>
                      </button>
                    );
                  })}
                </div>

                {(() => {
                  const nivel = NIVEIS.find((x) => x.key === nivelTab) || NIVEIS[0];
                  const { key, rotulo, cor } = nivel;
                  const n = esteira.niveis[key];
                  return (
                        <div className="rounded-2xl border border-border bg-white px-5 py-5">
                          <div className="grid gap-3 sm:grid-cols-2 mb-5">
                            <Campo label="Nome do produto" value={n.nome} onChange={(v) => setNivel(key, { nome: v })} />
                            <Campo label="Formato" value={n.formato} onChange={(v) => setNivel(key, { formato: v })} placeholder="ebook, curso, mentoria…" />
                            <Campo label="Preço / faixa" value={n.preco} onChange={(v) => setNivel(key, { preco: v })} placeholder="Ex.: 27€" />
                            <Campo label="Transformação (de X para Y)" value={n.transformacao} onChange={(v) => setNivel(key, { transformacao: v })} />
                          </div>

                          <PromptCard
                            numero={2}
                            titulo="Página de vendas"
                            descricao="O texto completo da landing page deste produto."
                            prompt={promptLandingPage(doc, rotulo, n)}
                            icon={<FileText size={18} />}
                            cor={COR} botaoCor={COR} agente="Cat.IA" agenteUrl={catIa.url} agentePass={catIa.password}
                          />
                          <ColarResultado label="Página de vendas" value={n.landing} onChange={(v) => setNivel(key, { landing: v })} />

                          <PromptCard
                            numero={3}
                            titulo="Sequência de stories"
                            descricao="3 dias de stories para lançar e vender (método Cat.IA)."
                            prompt={promptStories(doc, rotulo, n)}
                            icon={<MessageCircle size={18} />}
                            cor={COR} botaoCor={COR} agente="Cat.IA" agenteUrl={catIa.url} agentePass={catIa.password}
                          />
                          <ColarResultado label="Sequência de stories" value={n.stories} onChange={(v) => setNivel(key, { stories: v })} />

                          <PromptCard
                            numero={4}
                            titulo="Posts de feed (funil)"
                            descricao="Posts por fase: topo (atrair), meio (nutrir), fundo (vender)."
                            prompt={promptPostsFunil(doc, rotulo, n)}
                            icon={<LayoutGrid size={18} />}
                            cor={COR} botaoCor={COR} agente="Cat.IA" agenteUrl={catIa.url} agentePass={catIa.password}
                          />
                          {/* Cola TODO o resultado → separa topo/meio/fundo */}
                          <div className="mb-4 rounded-xl border border-terracotta/20 bg-cream-warm/20 p-3">
                            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45">Cola aqui TODOS os posts</label>
                            <textarea
                              value={colaPosts[key]}
                              onChange={(e) => setColaPosts((a) => ({ ...a, [key]: e.target.value }))}
                              rows={colaPosts[key] ? 5 : 2}
                              placeholder="Cola o resultado com TOPO / MEIO / FUNDO e eu separo pelos campos…"
                              className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-[13.5px] leading-relaxed text-ink/85 outline-none focus:border-terracotta"
                            />
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              <button
                                onClick={() => distribuirPosts(key)}
                                disabled={!colaPosts[key].trim()}
                                className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors disabled:opacity-40"
                              >
                                <Sparkles size={14} /> Distribuir por topo/meio/fundo
                              </button>
                              {avisoPosts[key] && <span className="text-[12.5px] text-ink/70">{avisoPosts[key]}</span>}
                            </div>
                          </div>
                          <ColarResultado label="Topo de funil (atrair)" value={n.postsTopo} onChange={(v) => setNivel(key, { postsTopo: v })} />
                          <ColarResultado label="Meio de funil (nutrir)" value={n.postsMeio} onChange={(v) => setNivel(key, { postsMeio: v })} />
                          <ColarResultado label="Fundo de funil (vender)" value={n.postsFundo} onChange={(v) => setNivel(key, { postsFundo: v })} />
                        </div>
                  );
                })()}

                <div className="mt-8 rounded-2xl bg-gradient-to-br from-terracotta-dark to-terracotta p-8 text-center text-cream">
                <Sparkles size={22} className="mx-auto mb-2" />
                <h3 className="mb-1 font-serif text-2xl">A tua esteira completa</h3>
                <p className="mx-auto mb-4 max-w-lg text-cream/85">{progresso}/9 entregáveis prontos. Descarrega tudo num ficheiro.</p>
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  <button onClick={exportarEsteiraPDF} disabled={progresso === 0}
                    className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-terracotta-dark hover:bg-white transition-colors disabled:opacity-50">
                    <FileText size={16} /> Descarregar PDF
                  </button>
                  <button onClick={exportarEsteira} disabled={progresso === 0}
                    className="inline-flex items-center gap-2 rounded-full border border-cream/60 px-5 py-3 text-sm font-semibold text-cream hover:bg-cream/10 transition-colors disabled:opacity-50">
                    <Download size={16} /> Ficheiro .txt
                  </button>
                </div>
                </div>
              </div>
              )}

              {/* Navegação do wizard */}
              <div className="mt-6 flex items-center justify-between">
                {passoEsteira > 1 ? (
                  <button
                    onClick={() => { setPassoEsteira(passoEsteira - 1); window.scrollTo({ top: 0 }); }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-ink/70 hover:text-ink transition-colors"
                  >
                    ← Anterior
                  </button>
                ) : <span />}
                {passoEsteira < 3 ? (
                  <button
                    onClick={() => { setPassoEsteira(passoEsteira + 1); window.scrollTo({ top: 0 }); }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-6 py-2.5 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors"
                  >
                    Continuar →
                  </button>
                ) : <span />}
              </div>

              <NavRodape anterior={{ id: "documento", label: "Documento Mestre" }} onIr={irPara} />
            </div>
          )}
        </main>
      </div>
    </Layout>
    </div>
  );
}
