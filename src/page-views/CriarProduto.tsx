import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { Package, Sparkles, Copy, Check, Plus, Trash2, FileText, ChevronRight } from "lucide-react";
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
  type ProdutoExtra,
  PRODUTO_EXTRA_EMPTY,
  PRODUTO_EXTRA_KEY,
  loadProdutoExtra,
  promptIdeiasProduto,
  promptLandingPage,
  promptStories,
  promptPosts,
} from "@/lib/criar-produto";

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

function CaixaPrompt({ n, titulo, desc, texto }: { n: number; titulo: string; desc: string; texto: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => { navigator.clipboard?.writeText(texto).then(() => { setCopiado(true); setTimeout(() => setCopiado(false), 1800); }); };
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-sm font-semibold text-ink"><span className="text-terracotta">{n}.</span> {titulo}</p>
          <p className="text-[13px] text-ink/55">{desc}</p>
        </div>
        <button onClick={copiar}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-sm font-semibold text-cream hover:bg-terracotta-dark transition-colors">
          {copiado ? <Check size={15} /> : <Copy size={15} />} {copiado ? "Copiado!" : "Copiar prompt"}
        </button>
      </div>
      <pre className="m-0 max-h-56 overflow-auto whitespace-pre-wrap break-words px-4 py-3 font-mono text-[12.5px] leading-relaxed text-ink/75">{texto}</pre>
    </div>
  );
}

export default function CriarProduto() {
  const [doc, setDoc] = useState<DocState>(EMPTY);
  const [extra, setExtra] = useState<ProdutoExtra>(PRODUTO_EXTRA_EMPTY);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    setDoc(loadInitial());
    setExtra(loadProdutoExtra());
    setCarregado(true);
  }, []);

  // Guarda no MESMO Documento Mestre (partilhado) e no estado do produto.
  const setDocCampo = <K extends keyof DocState>(k: K, v: DocState[K]) => {
    setDoc((prev) => {
      const next = { ...prev, [k]: v };
      try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  };
  const setExtraCampo = <K extends keyof ProdutoExtra>(k: K, v: ProdutoExtra[K]) => {
    setExtra((prev) => {
      const next = { ...prev, [k]: v };
      try { window.localStorage.setItem(PRODUTO_EXTRA_KEY, JSON.stringify(next)); } catch { /* quota */ }
      return next;
    });
  };
  const addProduto = () => setDocCampo("produtos", [...doc.produtos, { nome: "", descricao: "", ticketMedio: "" }]);
  const updProduto = (i: number, patch: Partial<Produto>) => setDocCampo("produtos", doc.produtos.map((p, j) => (j === i ? { ...p, ...patch } : p)));
  const delProduto = (i: number) => setDocCampo("produtos", doc.produtos.filter((_, j) => j !== i));

  const prompts = useMemo(() => ({
    ideias: promptIdeiasProduto(doc),
    landing: promptLandingPage(doc, extra),
    stories: promptStories(doc, extra),
    posts: promptPosts(doc, extra),
  }), [doc, extra]);

  if (!carregado) return <Layout><div className="py-20 text-center text-ink/40">A carregar…</div></Layout>;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-5 md:px-10 pt-10 md:pt-14 pb-20">
        <span className="mb-3 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-terracotta">
          <Package size={13} /> Criar produto & enriquecer
        </span>
        <h1 className="mb-2 font-serif text-3xl md:text-5xl leading-tight text-ink">Cria o teu produto — tudo pronto a copiar</h1>
        <p className="mb-6 max-w-2xl text-lg text-ink/70">
          Preenche (ou revê) a tua base e o produto, e leva ideias de produto, a landing page, a sequência de stories e os posts — feitos no método Cat.IA, prontos a colar no ChatGPT ou Claude.
        </p>
        <div className="mb-8 flex items-center gap-2 rounded-xl border border-terracotta/25 bg-terracotta/[0.05] px-4 py-2.5 text-[13px] text-ink/70">
          <FileText size={15} className="text-terracotta" />
          Os teus dados são partilhados com o <Link to="/doc-mestre" className="font-semibold text-terracotta hover:text-terracotta-dark">Documento Mestre</Link> — o que editas aqui fica guardado lá também.
        </div>

        {/* ── A tua base (Documento Mestre) ── */}
        <div className="space-y-8">
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

          {/* ── Criação do novo produto ── */}
          <div className="rounded-2xl border border-terracotta/30 bg-terracotta/[0.05] p-5 space-y-4">
            <h2 className="font-serif text-xl text-ink">4. O produto que queres criar</h2>
            <p className="-mt-2 text-[13px] text-ink/55">Ainda não sabes qual? Deixa em branco e usa o 1º prompt (ideias de produto) para decidir.</p>
            <Campo label="Nome do produto (se já tens)" value={extra.nomeProduto} onChange={(v) => setExtraCampo("nomeProduto", v)} />
            <Campo label="Formato" value={extra.formato} onChange={(v) => setExtraCampo("formato", v)} placeholder="Ex.: mini-curso, mentoria, ebook, comunidade, kit…" />
            <Campo label="Transformação que entrega (de X para Y)" value={extra.transformacao} onChange={(v) => setExtraCampo("transformacao", v)} textarea placeholder="Ex.: de não saber o que postar → a ter 1 mês de conteúdo pronto" />
            <Campo label="Preço / faixa" value={extra.preco} onChange={(v) => setExtraCampo("preco", v)} placeholder="Ex.: 47€ · 297€ · 1500€" />
          </div>

          {/* ── Prompts prontos ── */}
          <div>
            <h2 className="mb-1 font-serif text-2xl text-ink">Os teus prompts — prontos a colar no ChatGPT ou Claude</h2>
            <p className="mb-5 text-[15px] text-ink/60">Copia cada um, cola no ChatGPT ou Claude, e recebes tudo escrito na tua voz. Quanto mais preencheres acima, melhor o resultado.</p>
            <div className="space-y-4">
              <CaixaPrompt n={1} titulo="Ideias de produto" desc="5 ideias de produtos para vender ao teu público, do simples ao completo." texto={prompts.ideias} />
              <CaixaPrompt n={2} titulo="Landing page (página de vendas)" desc="O texto completo da página de vendas do teu produto." texto={prompts.landing} />
              <CaixaPrompt n={3} titulo="Sequência de stories" desc="3 dias de stories para lançar e vender (método Cat.IA)." texto={prompts.stories} />
              <CaixaPrompt n={4} titulo="Posts para o feed" desc="5 posts para gerar autoridade e desejo pelo produto (método Cat.IA)." texto={prompts.posts} />
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-br from-terracotta-dark to-terracotta p-8 text-center text-cream">
            <Sparkles size={22} className="mx-auto mb-2" />
            <h3 className="mb-1 font-serif text-2xl">Já tens tudo?</h3>
            <p className="mx-auto mb-4 max-w-lg text-cream/85">Depois de gerares, volta ao teu conteúdo diário para promover o produto.</p>
            <Link to="/metodo/pilar-2/redes-sociais?aba=assistente" className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-terracotta-dark hover:bg-white transition-colors">
              Abrir a Cat.IA <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
