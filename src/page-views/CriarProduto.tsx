import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { Package, Sparkles, Copy, Check, Plus, Trash2, FileText, ChevronRight, ChevronDown, Download } from "lucide-react";
import { Link } from "@/lib/router-compat";
import {
  type DocState,
  type Produto,
  EMPTY,
  STORAGE_KEY,
  padArray,
  loadInitial,
} from "@/lib/doc-mestre";
import {
  type Esteira,
  type NivelKey,
  type ProdutoNivel,
  ESTEIRA_EMPTY,
  ESTEIRA_KEY,
  NIVEIS,
  loadEsteira,
  promptIdeiasEsteira,
  promptLandingPage,
  promptStories,
  promptPostsFunil,
} from "@/lib/criar-produto";

const CAT_IA_URL = "https://chatgpt.com/g/g-6a56643a8dbc8191a122f9580a3e7edf-cat-ia";

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

type CampoRes = { label: string; valor: string; onChange: (v: string) => void; placeholder?: string };

// Um "passo": prompt (abre/copia no Cat.IA) + campo(s) para colar o resultado.
function BlocoEntrega({ titulo, desc, prompt, campos }: { titulo: string; desc: string; prompt: string; campos: CampoRes[] }) {
  const [copiado, setCopiado] = useState(false);
  const [aberto, setAberto] = useState(false);
  const [verPrompt, setVerPrompt] = useState(false);
  const feito = campos.some((c) => c.valor.trim().length > 0);
  const copiar = () => { navigator.clipboard?.writeText(prompt).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1800); }); };
  const abrirNoCatIa = () => {
    try { navigator.clipboard?.writeText(prompt); } catch { /* clipboard indisponível */ }
    setAberto(true); setTimeout(() => setAberto(false), 5000);
    window.open(CAT_IA_URL, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-semibold text-ink">
            {feito && <Check size={14} className="shrink-0 text-emerald-600" />}{titulo}
          </p>
          <p className="text-[13px] text-ink/55">{desc}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button onClick={copiar} title="Só copiar o prompt"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-ink/60 hover:border-terracotta/40 hover:text-terracotta transition-colors">
            {copiado ? <Check size={15} /> : <Copy size={15} />}
          </button>
          <button onClick={abrirNoCatIa}
            className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-3.5 py-2 text-[13px] font-semibold text-cream hover:bg-terracotta-dark transition-colors">
            <Sparkles size={14} /> Abrir no Cat.IA
          </button>
        </div>
      </div>
      {aberto && (
        <div className="flex items-center gap-1.5 bg-terracotta/[0.06] px-4 py-2 text-[12.5px] font-medium text-terracotta-dark">
          <Check size={14} /> Prompt copiado — cola no Cat.IA (Ctrl/⌘ + V) e envia.
        </div>
      )}
      <button onClick={() => setVerPrompt((v) => !v)}
        className="flex w-full items-center gap-1 border-t border-border px-4 py-1.5 text-left text-[12px] text-ink/45 hover:text-terracotta transition-colors">
        <ChevronDown size={13} className={`transition-transform ${verPrompt ? "rotate-180" : ""}`} /> {verPrompt ? "ocultar prompt" : "ver prompt"}
      </button>
      {verPrompt && (
        <pre className="m-0 max-h-52 overflow-auto whitespace-pre-wrap break-words border-t border-border bg-cream-warm/20 px-4 py-3 font-mono text-[12px] leading-relaxed text-ink/70">{prompt}</pre>
      )}
      <div className="space-y-3 border-t border-border bg-cream-warm/20 px-4 py-3">
        {campos.map((c, i) => (
          <div key={i}>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.08em] text-ink/45">{c.label}</label>
            <textarea value={c.valor} onChange={(e) => c.onChange(e.target.value)} rows={c.valor ? 5 : 2}
              placeholder={c.placeholder ?? "Cola aqui o que o Cat.IA te devolveu…"}
              className="w-full resize-y rounded-lg border border-border bg-white px-3 py-2 text-[13.5px] leading-relaxed text-ink/85 outline-none focus:border-terracotta" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CriarProduto() {
  const [doc, setDoc] = useState<DocState>(EMPTY);
  const [esteira, setEsteira] = useState<Esteira>(ESTEIRA_EMPTY);
  const [carregado, setCarregado] = useState(false);
  const [aberto, setAberto] = useState<Record<NivelKey, boolean>>({ low: true, medio: false, alto: false });

  useEffect(() => {
    setDoc(loadInitial());
    setEsteira(loadEsteira());
    setCarregado(true);
  }, []);

  const setDocCampo = <K extends keyof DocState>(k: K, v: DocState[K]) => {
    setDoc((prev) => {
      const next = { ...prev, [k]: v };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  };
  const guardarEsteira = (next: Esteira) => {
    try { window.localStorage.setItem(ESTEIRA_KEY, JSON.stringify(next)); } catch { /* quota */ }
    return next;
  };
  const setIdeias = (v: string) => setEsteira((prev) => guardarEsteira({ ...prev, ideias: v }));
  const setNivel = (k: NivelKey, patch: Partial<ProdutoNivel>) =>
    setEsteira((prev) => guardarEsteira({ ...prev, niveis: { ...prev.niveis, [k]: { ...prev.niveis[k], ...patch } } }));

  const addProduto = () => setDocCampo("produtos", [...doc.produtos, { nome: "", descricao: "", ticketMedio: "" }]);
  const updProduto = (i: number, patch: Partial<Produto>) => setDocCampo("produtos", doc.produtos.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const delProduto = (i: number) => setDocCampo("produtos", doc.produtos.filter((_, j) => j !== i));

  // conta quantos entregáveis já estão preenchidos (3 níveis × 3 entregáveis = 9)
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

  if (!carregado) return <Layout><div className="py-20 text-center text-ink/40">A carregar…</div></Layout>;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 md:px-10 pt-10 md:pt-14 pb-20">
        <span className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
          <Package size={13} /> Criar produto & enriquecer
        </span>
        <h1 className="mb-2 font-serif text-3xl md:text-5xl leading-tight text-ink">A tua esteira de produtos — pronta no fim</h1>
        <p className="mb-6 max-w-2xl text-lg text-ink/70">
          Preenche a tua base, gera cada peça com o teu <strong>Cat.IA</strong> e <strong>cola os resultados</strong> nos campos. No fim tens uma esteira completa: 3 produtos (low, médio e alto ticket), cada um com página de vendas, stories e posts de feed (topo, meio e fundo de funil).
        </p>
        <div className="mb-8 flex items-center gap-2 rounded-xl border border-terracotta/25 bg-terracotta/[0.05] px-4 py-2.5 text-[13px] text-ink/70">
          <FileText size={15} className="text-terracotta" />
          Os teus dados são partilhados com o <Link to="/doc-mestre" className="font-semibold text-terracotta hover:text-terracotta-dark">Documento Mestre</Link> — o que editas aqui fica guardado lá também.
        </div>

        <div className="space-y-8">
          {/* ── A tua base (Documento Mestre) ── */}
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
            <Campo label="Público que atendes" value={doc.publico} onChange={(v) => setDocCampo("publico", v)} textarea />
            <ListaCampos label="Dores do público" valores={padArray(doc.dores, 5)} onChange={(v) => setDocCampo("dores", v)} />
            <ListaCampos label="Desejos do público" valores={padArray(doc.desejos, 5)} onChange={(v) => setDocCampo("desejos", v)} />
          </div>

          <div className="rounded-2xl border border-border bg-cream-warm/30 p-5 space-y-4">
            <h2 className="font-serif text-xl text-ink">3. Produtos/serviços que já tens</h2>
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

          {/* ── Passo 4: ideias da esteira ── */}
          <div className="rounded-2xl border border-terracotta/30 bg-terracotta/[0.05] p-5 space-y-4">
            <div>
              <h2 className="font-serif text-xl text-ink">4. Desenha a tua esteira</h2>
              <p className="text-[13px] text-ink/60">Ainda não sabes que produtos criar? Gera as ideias dos 3 níveis e cola o resultado — depois preenche cada nível abaixo.</p>
            </div>
            <BlocoEntrega
              titulo="Ideias da esteira (3 níveis)"
              desc="5 min → low, médio e alto ticket sugeridos para o teu público."
              prompt={promptIdeiasEsteira(doc)}
              campos={[{ label: "Ideias que o Cat.IA sugeriu", valor: esteira.ideias, onChange: setIdeias, placeholder: "Cola aqui as 3 ideias (low, médio, alto)…" }]}
            />
          </div>

          {/* ── Passo 5: cada nível da esteira ── */}
          <div>
            <h2 className="mb-1 font-serif text-2xl text-ink">5. Constrói cada produto</h2>
            <p className="mb-4 text-[15px] text-ink/60">
              Para cada nível: define o produto, gera com o Cat.IA e cola os resultados. Já preenchido:{" "}
              <strong className="text-terracotta">{progresso}/9</strong> entregáveis.
            </p>
            <div className="space-y-4">
              {NIVEIS.map(({ key, rotulo, etiqueta, dica, cor }) => {
                const n = esteira.niveis[key];
                const isOpen = aberto[key];
                return (
                  <div key={key} className="overflow-hidden rounded-2xl border border-border bg-white">
                    <button onClick={() => setAberto((a) => ({ ...a, [key]: !a[key] }))}
                      className="flex w-full items-center gap-3 px-5 py-4 text-left">
                      <span className="h-9 w-9 shrink-0 rounded-lg" style={{ backgroundColor: cor }} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="font-serif text-lg text-ink">{rotulo}</span>
                          <span className="rounded-full bg-ink/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ink/50">{etiqueta}</span>
                        </span>
                        <span className="block truncate text-[13px] text-ink/55">{n.nome || dica}</span>
                      </span>
                      <ChevronDown size={18} className={`shrink-0 text-ink/40 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="space-y-4 border-t border-border px-5 py-5">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <Campo label="Nome do produto" value={n.nome} onChange={(v) => setNivel(key, { nome: v })} />
                          <Campo label="Formato" value={n.formato} onChange={(v) => setNivel(key, { formato: v })} placeholder="ebook, curso, mentoria…" />
                          <Campo label="Preço / faixa" value={n.preco} onChange={(v) => setNivel(key, { preco: v })} placeholder="Ex.: 27€" />
                          <Campo label="Transformação (de X para Y)" value={n.transformacao} onChange={(v) => setNivel(key, { transformacao: v })} />
                        </div>

                        <BlocoEntrega
                          titulo="Página de vendas"
                          desc="O texto completo da landing page deste produto."
                          prompt={promptLandingPage(doc, rotulo, n)}
                          campos={[{ label: "Página de vendas", valor: n.landing, onChange: (v) => setNivel(key, { landing: v }) }]}
                        />
                        <BlocoEntrega
                          titulo="Sequência de stories"
                          desc="3 dias de stories para lançar e vender (método Cat.IA)."
                          prompt={promptStories(doc, rotulo, n)}
                          campos={[{ label: "Sequência de stories", valor: n.stories, onChange: (v) => setNivel(key, { stories: v }) }]}
                        />
                        <BlocoEntrega
                          titulo="Posts de feed (funil)"
                          desc="Posts por fase: topo (atrair), meio (nutrir), fundo (vender)."
                          prompt={promptPostsFunil(doc, rotulo, n)}
                          campos={[
                            { label: "Topo de funil (atrair)", valor: n.postsTopo, onChange: (v) => setNivel(key, { postsTopo: v }) },
                            { label: "Meio de funil (nutrir)", valor: n.postsMeio, onChange: (v) => setNivel(key, { postsMeio: v }) },
                            { label: "Fundo de funil (vender)", valor: n.postsFundo, onChange: (v) => setNivel(key, { postsFundo: v }) },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Fecho ── */}
          <div className="rounded-2xl bg-gradient-to-br from-terracotta-dark to-terracotta p-8 text-center text-cream">
            <Sparkles size={22} className="mx-auto mb-2" />
            <h3 className="mb-1 font-serif text-2xl">A tua esteira completa</h3>
            <p className="mx-auto mb-4 max-w-lg text-cream/85">{progresso}/9 entregáveis prontos. Descarrega tudo num ficheiro ou volta ao teu conteúdo diário para promover.</p>
            <div className="flex flex-wrap justify-center gap-2">
              <button onClick={exportarEsteira} disabled={progresso === 0}
                className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-terracotta-dark hover:bg-white transition-colors disabled:opacity-50">
                <Download size={16} /> Descarregar esteira
              </button>
              <Link to="/metodo/pilar-2/redes-sociais?aba=assistente" className="inline-flex items-center gap-2 rounded-full border border-cream/40 px-6 py-3 text-sm font-semibold text-cream hover:bg-cream/10 transition-colors">
                Abrir a Cat.IA <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
