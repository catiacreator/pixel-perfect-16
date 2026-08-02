import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import PromptCard from "../components/PromptCard";
import PilarBreadcrumb from "../components/PilarBreadcrumb";
import { Link } from "@/lib/router-compat";
import { LineChart, Check, RotateCcw, Wand2, Plus, X, ArrowRight, ArrowLeft } from "lucide-react";
import { PROMPT_EXTRAIR_PERFIL } from "@/data/prompts/maquina-analises";
import {
  FORM_VAZIO, OBJETIVOS, lerDadosPerfil, loadAnalise, saveAnalise, montarPromptAnalise,
  docMestreParaAnalise,
  type FormAnalise, type Oferta, type FonteAnalise,
} from "@/lib/maquina-analises";
import { loadInitial as loadDocMestre } from "@/lib/doc-mestre";
import { HYDRATED_EVENT } from "@/lib/master-doc-sync";

const COR = "#C13584";

// Os passos dependem da fonte. Quem usa o Documento Mestre salta a extração:
// o público, as dores e os produtos já estão preenchidos.
const PASSOS_ZERO = [
  { n: 2, nome: "Dados do perfil" },
  { n: 3, nome: "Objetivos" },
  { n: 4, nome: "Resultado" },
];
const PASSOS_DOC = [
  { n: 3, nome: "Objetivos" },
  { n: 4, nome: "Resultado" },
];

function Campo({ label, ajuda, children }: { label: string; ajuda?: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="text-xs font-semibold text-ink mb-1.5 block">
        {label} {ajuda && <span className="font-normal text-ink/45">{ajuda}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-[--cor] transition-colors";

export default function MaquinaAnalises() {
  const [passo, setPasso] = useState(1);
  const [fonte, setFonte] = useState<FonteAnalise | null>(null);
  const [docTemConteudo, setDocTemConteudo] = useState(false);
  const [saida, setSaida] = useState("");
  const [form, setForm] = useState<FormAnalise>(FORM_VAZIO);
  const [preencheu, setPreencheu] = useState(false);
  const [promptFinal, setPromptFinal] = useState("");
  const [ferramenta, setFerramenta] = useState<"claude" | "chatgpt">("claude");

  const PASSOS = fonte === "doc" ? PASSOS_DOC : PASSOS_ZERO;

  // Recupera o que estava a meio (o texto extraído e os campos do formulário).
  useEffect(() => {
    const e = loadAnalise();
    setSaida(e.saida);
    setForm(e.form);
    // O Documento Mestre vem do servidor de forma assíncrona; reavaliamos quando
    // a hidratação chega, senão o botão "Buscar do Documento Mestre" ficaria
    // desativado para quem acabou de abrir a app.
    const ver = () => setDocTemConteudo(docMestreParaAnalise(loadDocMestre()).temConteudo);
    ver();
    window.addEventListener(HYDRATED_EVENT, ver);
    return () => window.removeEventListener(HYDRATED_EVENT, ver);
  }, []);
  useEffect(() => { saveAnalise({ saida, form }); }, [saida, form]);

  const preencherDoTexto = () => {
    const r = lerDadosPerfil(saida);
    if (!r.encontrou) return;
    setForm((f) => ({
      ...f,
      ofertas: r.ofertas.length ? r.ofertas : f.ofertas,
      avatar: r.avatar || f.avatar,
      dor: r.dor || f.dor,
      cta: r.cta || f.cta,
      promo: r.promo || f.promo,
    }));
    setPreencheu(true);
  };

  const mudarOferta = (i: number, campo: keyof Oferta, v: string) =>
    setForm((f) => ({ ...f, ofertas: f.ofertas.map((o, j) => (j === i ? { ...o, [campo]: v } : o)) }));
  const addOferta = () =>
    setForm((f) => (f.ofertas.length >= 5 ? f : { ...f, ofertas: [...f.ofertas, { desc: "", preco: "", link: "" }] }));
  const rmOferta = (i: number) =>
    setForm((f) => {
      const o = f.ofertas.filter((_, j) => j !== i);
      return { ...f, ofertas: o.length ? o : [{ desc: "", preco: "", link: "" }] };
    });

  const gerar = () => {
    setPromptFinal(montarPromptAnalise(saida, form));
    setPasso(4);
  };

  // Puxa o Documento Mestre: preenche os campos e serve de "dados desta conta"
  // no prompt final, no lugar da extração que se saltou.
  const usarDocMestre = () => {
    const { campos, dados } = docMestreParaAnalise(loadDocMestre());
    setForm((f) => ({ ...f, ...campos }));
    setSaida(dados);
    setPreencheu(true);
    setFonte("doc");
    setPasso(3);
  };

  const comecarDoZero = () => {
    setFonte("zero");
    setPasso(2);
  };

  const recomecar = () => {
    setSaida("");
    setForm(FORM_VAZIO);
    setPreencheu(false);
    setFonte(null);
    setPasso(1);
  };

  return (
    <Layout>
      <PilarBreadcrumb pilar="redes" pilarLabel="A tua jornada" backTo="/metodo" backLabel="Voltar para a jornada" />
      <div style={{ ["--cor" as string]: COR }} className="px-5 md:px-10 py-8 max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-1">
          <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `linear-gradient(135deg, #833AB4, ${COR}, #F77737)`, color: "#fff" }}>
            <LineChart size={20} />
          </span>
          <div>
            <h1 className="font-serif text-2xl text-ink leading-tight">Máquina de Análises</h1>
            <p className="text-xs text-ink/50">Ferramenta interna · só tu vês isto</p>
          </div>
        </div>

        {/* Passos — numerados pela ordem que a pessoa vê, não pelo estado interno */}
        {fonte && (
          <div className="flex items-center gap-1.5 my-6 flex-wrap">
            {PASSOS.map((p, i) => {
              const feito = passo > p.n;
              const atual = passo === p.n;
              return (
                <div key={p.n} className="flex items-center gap-2 flex-1 min-w-[130px]">
                  <span className="w-7 h-7 rounded-full text-[12px] font-bold flex items-center justify-center shrink-0 transition-all"
                    style={
                      atual ? { background: COR, color: "#fff", boxShadow: `0 0 0 4px ${COR}22` }
                      : feito ? { background: "#833AB4", color: "#fff" }
                      : { background: "var(--color-border)", color: "#9a9a9f" }
                    }>
                    {feito ? <Check size={13} /> : i + 1}
                  </span>
                  <span className={`text-[12.5px] font-semibold ${atual || feito ? "text-ink" : "text-ink/40"}`}>{p.nome}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Passo 0 · De onde vêm os dados ── */}
        {!fonte && (
          <div className="rounded-2xl border border-border bg-white p-6 mt-6">
            <h2 className="font-serif text-xl text-ink mb-1">Por onde queres começar?</h2>
            <p className="text-sm text-ink/60 mb-5">
              Se já preencheste o Documento Mestre, aproveitamos o que lá está e poupas um passo inteiro.
            </p>
            <div className="grid gap-3.5">
              <button
                onClick={usarDocMestre}
                disabled={!docTemConteudo}
                className="text-left rounded-xl border-2 p-5 transition-colors disabled:opacity-55 disabled:cursor-not-allowed"
                style={docTemConteudo
                  ? { borderStyle: "solid", borderColor: "#833AB4", background: "#faf5ff" }
                  : { borderStyle: "dashed", borderColor: "var(--color-border)", background: "#fafafa" }}
              >
                <div className="text-2xl mb-1.5">📗</div>
                <p className="text-[14px] font-bold text-ink mb-1">Buscar do Documento Mestre</p>
                <p className="text-[12.5px] text-ink/60">
                  {docTemConteudo
                    ? "Traz o teu público, as dores e os produtos. Só tens de dizer os objetivos."
                    : "O teu Documento Mestre ainda está vazio. Preenche-o primeiro para usares esta opção."}
                </p>
              </button>
            </div>
          </div>
        )}

        {/* ── Passo 2 · Dados do perfil ── */}
        {passo === 2 && (
          <div>
            <div className="rounded-2xl border border-border bg-white p-6 mb-5">
              <h2 className="font-serif text-xl text-ink mb-1">Extrai os dados do perfil</h2>
              <p className="text-sm text-ink/60">
                Usa a extensão <strong>Claude in Chrome</strong> com o perfil aberto para recolher toda a informação
                pública de uma vez. Copia o prompt, corre-o, e cola aqui o resultado.
              </p>
              <ol className="mt-4 space-y-1.5 text-[13px] text-ink/70 list-decimal list-inside">
                <li>
                  Instala em{" "}
                  <a href="https://claude.com/claude-for-chrome" target="_blank" rel="noopener noreferrer"
                    className="font-semibold underline" style={{ color: COR }}>
                    claude.com/claude-for-chrome
                  </a>{" "}
                  e inicia sessão.
                </li>
                <li>Abre o perfil de Instagram no Chrome (feed e Reels visíveis).</li>
                <li>Percorre o feed e os Reels antes de correr — para o Claude “ver” o máximo de views.</li>
                <li>Clica no ícone da extensão e cola o prompt.</li>
              </ol>
            </div>

            <PromptCard
              numero={1}
              titulo="Extrair a informação do perfil"
              descricao="Corre no Claude in Chrome, com o perfil aberto. O resultado preenche os campos do passo 3 sozinho."
              prompt={PROMPT_EXTRAIR_PERFIL}
              agente="Claude in Chrome"
            />

            <div className="rounded-2xl border border-border bg-white p-5 mb-5">
              <label className="text-xs tracking-[0.1em] uppercase text-ink/50 mb-1.5 block">
                Cola aqui o resultado do Claude
              </label>
              <textarea value={saida} onChange={(e) => { setSaida(e.target.value); setPreencheu(false); }}
                rows={7} placeholder="Cola aqui todo o texto que o Claude in Chrome devolveu…"
                className="w-full rounded-xl border border-border p-3 text-sm outline-none focus:border-[--cor] resize-y" />
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <button onClick={preencherDoTexto} disabled={!saida.trim()}
                  className="text-xs font-bold inline-flex items-center gap-1.5 disabled:opacity-35"
                  style={{ color: COR }}>
                  <Wand2 size={13} /> Preencher os campos automaticamente
                </button>
                {preencheu && (
                  <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1">
                    <Check size={13} /> campos preenchidos
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setFonte(null)} className="px-5 py-3 rounded-xl bg-ink/5 text-ink/70 text-sm font-bold inline-flex items-center gap-1.5">
                <ArrowLeft size={15} /> Voltar
              </button>
              <button onClick={() => setPasso(3)} className="px-6 py-3 rounded-xl text-white text-sm font-bold inline-flex items-center gap-1.5" style={{ background: COR }}>
                Continuar <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* ── Passo 3 · Objetivos ── */}
        {passo === 3 && (
          <div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <h2 className="font-serif text-xl text-ink mb-1">Objetivos e negócio</h2>
              <p className="text-sm text-ink/60 mb-5">
                Isto define o tom do plano e para onde o conteúdo empurra. Quanto mais claro, mais afiada a estratégia.
              </p>

              {preencheu && (
                <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-[12.5px] text-emerald-800 mb-5 flex gap-2">
                  <Check size={15} className="shrink-0 mt-px" />
                  <span>Alguns campos vieram preenchidos do passo 2. Confirma e ajusta o que quiseres.</span>
                </p>
              )}

              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: COR }}>
                Objetivos da conta (até 2)
              </p>
              <Campo label="Objetivo principal nos próximos 30 dias">
                <select value={form.objetivo} onChange={(e) => setForm((f) => ({ ...f, objetivo: e.target.value }))} className={inputCls}>
                  {OBJETIVOS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </Campo>
              {form.objetivo2 === null ? (
                <button onClick={() => setForm((f) => ({ ...f, objetivo2: OBJETIVOS[2] }))}
                  className="rounded-lg border border-dashed border-[#e3c7d6] px-3.5 py-2 text-[12.5px] font-bold mb-4 inline-flex items-center gap-1.5"
                  style={{ color: COR }}>
                  <Plus size={13} /> adicionar 2º objetivo
                </button>
              ) : (
                <Campo label="2º objetivo">
                  <div className="flex gap-2">
                    <select value={form.objetivo2} onChange={(e) => setForm((f) => ({ ...f, objetivo2: e.target.value }))} className={inputCls}>
                      {OBJETIVOS.map((o) => <option key={o}>{o}</option>)}
                    </select>
                    <button onClick={() => setForm((f) => ({ ...f, objetivo2: null }))} aria-label="Remover 2º objetivo"
                      className="shrink-0 w-10 rounded-xl bg-ink/5 text-ink/50 flex items-center justify-center">
                      <X size={15} />
                    </button>
                  </div>
                </Campo>
              )}

              <div className="grid md:grid-cols-2 gap-x-4">
                <Campo label="Meta concreta" ajuda="(nº)">
                  <input value={form.meta} onChange={(e) => setForm((f) => ({ ...f, meta: e.target.value }))}
                    placeholder="ex: 800 seguidores / 8 sessões por mês" className={inputCls} />
                </Campo>
                <Campo label="Prazo">
                  <input value={form.prazo} onChange={(e) => setForm((f) => ({ ...f, prazo: e.target.value }))}
                    placeholder="ex: 30 dias" className={inputCls} />
                </Campo>
              </div>

              <p className="text-[11px] font-bold uppercase tracking-wider mb-3 mt-2" style={{ color: COR }}>
                O que vende <span className="normal-case font-normal text-ink/45">(produto, preço e link)</span>
              </p>
              {form.ofertas.map((o, i) => (
                <div key={i} className="grid grid-cols-[1fr_90px_1fr_32px] gap-2 mb-2 items-center max-md:grid-cols-2">
                  <input value={o.desc} onChange={(e) => mudarOferta(i, "desc", e.target.value)} placeholder="produto / serviço"
                    className={`${inputCls} ${o.auto ? "bg-emerald-50/60 border-emerald-200" : ""}`} />
                  <input value={o.preco} onChange={(e) => mudarOferta(i, "preco", e.target.value)} placeholder="preço"
                    className={`${inputCls} ${o.auto ? "bg-emerald-50/60 border-emerald-200" : ""}`} />
                  <input value={o.link} onChange={(e) => mudarOferta(i, "link", e.target.value)} placeholder="link do produto"
                    className={`${inputCls} ${o.auto ? "bg-emerald-50/60 border-emerald-200" : ""}`} />
                  <button onClick={() => rmOferta(i)} aria-label="Remover"
                    className="w-8 h-8 rounded-lg bg-ink/5 text-ink/50 flex items-center justify-center max-md:col-start-2 max-md:justify-self-end">
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button onClick={addOferta} disabled={form.ofertas.length >= 5}
                className="rounded-lg border border-dashed border-[#e3c7d6] px-3.5 py-2 text-[12.5px] font-bold mb-5 inline-flex items-center gap-1.5 disabled:opacity-35"
                style={{ color: COR }}>
                <Plus size={13} /> adicionar o que vende
              </button>

              <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: COR }}>
                Público e mensagem
              </p>
              <Campo label="Público-alvo (avatar)">
                <input value={form.avatar} onChange={(e) => setForm((f) => ({ ...f, avatar: e.target.value }))}
                  placeholder="ex: mulheres lusófonas na Suíça e Portugal, 30-50 anos, sobrecarregadas" className={inputCls} />
              </Campo>
              <Campo label="Dor principal do cliente" ajuda="(a frustração que sente mas raramente diz)">
                <textarea value={form.dor} onChange={(e) => setForm((f) => ({ ...f, dor: e.target.value }))} rows={2}
                  placeholder="ex: sente-se exausta e desligada de si, aguenta tudo sozinha e não pede ajuda"
                  className={`${inputCls} resize-y`} />
              </Campo>
              <div className="grid md:grid-cols-2 gap-x-4">
                <Campo label="Palavra-chave de DM / CTA">
                  <input value={form.cta} onChange={(e) => setForm((f) => ({ ...f, cta: e.target.value }))} placeholder="ex: ENERGIA" className={inputCls} />
                </Campo>
                <Campo label="Produto/evento a promover" ajuda="(opcional)">
                  <input value={form.promo} onChange={(e) => setForm((f) => ({ ...f, promo: e.target.value }))} placeholder="ex: Círculo de Mulheres com Reiki" className={inputCls} />
                </Campo>
              </div>
            </div>

            <div className="flex justify-between mt-5">
              <button onClick={() => (fonte === "doc" ? setFonte(null) : setPasso(2))} className="px-5 py-3 rounded-xl bg-ink/5 text-ink/70 text-sm font-bold inline-flex items-center gap-1.5">
                <ArrowLeft size={15} /> Voltar
              </button>
              <button onClick={gerar} className="px-6 py-3 rounded-xl text-white text-sm font-bold" style={{ background: COR }}>
                Gerar análise ✨
              </button>
            </div>
          </div>
        )}

        {/* ── Passo 4 · O prompt ── */}
        {passo === 4 && (
          <div>
            <div className="rounded-2xl border border-border bg-white p-6 mb-5">
              <div className="text-center mb-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 text-[13px] font-bold px-4 py-2 mb-3">
                  <Check size={14} /> O teu prompt está pronto
                </span>

                {/* Tabs — usar o prompt no Claude ou no ChatGPT */}
                <div className="flex justify-center mb-3">
                  <div className="inline-flex gap-1 p-1 rounded-full bg-ink/5 border border-border">
                    {(["claude", "chatgpt"] as const).map((f) => {
                      const on = ferramenta === f;
                      return (
                        <button
                          key={f}
                          onClick={() => setFerramenta(f)}
                          className="px-4 py-1.5 rounded-full text-[13px] font-bold transition-colors"
                          style={on ? { background: COR, color: "#fff" } : { color: "#8a8a90" }}
                        >
                          {f === "claude" ? "Claude" : "ChatGPT"}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <h2 className="font-serif text-2xl text-ink">
                  Agora é o {ferramenta === "chatgpt" ? "ChatGPT" : "Claude"} que trabalha
                </h2>
                <p className="text-sm text-ink/60 mt-1 max-w-lg mx-auto">
                  {ferramenta === "chatgpt"
                    ? "Este prompt leva o método completo da Cátia e os dados desta conta. Cola-o no ChatGPT, anexa os screenshots, e ele escreve-te o relatório ali mesmo, no chat."
                    : "Este prompt leva o método completo da Cátia e os dados desta conta. Cola-o no Claude, anexa os screenshots, e ele devolve-te o relatório de análise."}
                </p>
              </div>

              <ol className="space-y-2.5 text-[13.5px] text-ink/75 max-w-lg mx-auto">
                {[
                  <>Carrega em <strong>Copiar prompt</strong> aqui em baixo.</>,
                  ferramenta === "chatgpt" ? (
                    <>Abre o <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: COR }}>chatgpt.com</a> (a conta gratuita chega).</>
                  ) : (
                    <>Abre o <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer" className="font-semibold underline" style={{ color: COR }}>claude.ai</a> (a conta gratuita chega).</>
                  ),
                  <><strong>Anexa os screenshots do perfil</strong> — a bio, a grelha do feed e os Reels com as views (o clip 📎).</>,
                  ferramenta === "chatgpt" ? (
                    <>Cola o prompt e envia. O ChatGPT <strong>escreve o relatório ali mesmo, no chat</strong> (não gera ficheiro).</>
                  ) : (
                    <>Cola o prompt e envia. O Claude devolve <strong>um relatório de análise</strong>, em texto simples.</>
                  ),
                  ferramenta === "chatgpt" ? (
                    <><strong>Copia o relatório</strong> do chat para o levares ao Plano Estratégico.</>
                  ) : (
                    <><strong>Guarda esse texto como .txt</strong> para o levares ao Plano Estratégico.</>
                  ),
                ].map((t, i) => (
                  <li key={i} className="flex gap-2.5">
                    <span className="w-5 h-5 rounded-full text-[10.5px] font-bold text-white flex items-center justify-center shrink-0 mt-0.5" style={{ background: COR }}>
                      {i + 1}
                    </span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </div>

            <PromptCard
              titulo="O teu prompt de análise"
              descricao="Já leva os teus objetivos, o que vendes e o público. Não precisas de mudar nada."
              prompt={promptFinal}
              rotuloBotao="Copiar prompt"
              agente={ferramenta === "chatgpt" ? "ChatGPT" : "Claude"}
            />

            <div className="rounded-2xl border border-border bg-white p-5 mb-5">
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: COR }}>
                O que vais receber
              </p>
              <p className="text-[12.5px] text-ink/55 mb-4">
                Um relatório em texto, leve — de propósito, para não gastar créditos. O conteúdo (Reels e carrosséis) vem depois, no Plano Estratégico.
              </p>
              <div className="grid gap-4">
                {[
                  { k: "Análise do perfil", t: "Relatório em texto", d: "Diagnóstico honesto, bio proposta, os padrões que já funcionam, ajustes imediatos e métricas a acompanhar." },
                ].map((doc) => (
                  <div key={doc.t} className="rounded-2xl border border-border overflow-hidden">
                    <div className="h-[100px] flex items-end p-3.5" style={{ background: "linear-gradient(135deg,#833AB4,#C13584,#E1306C,#F77737)" }}>
                      <span className="text-white text-[11px] font-bold uppercase tracking-wider drop-shadow">{doc.k}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[15px] font-bold text-ink mb-1">{doc.t}</h3>
                      <p className="text-[12.5px] text-ink/50">{doc.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Passo seguinte — a bifurcação do fluxo, só aqui no fim da análise. */}
            <div className="rounded-2xl border-2 p-5 mb-5" style={{ borderColor: `${COR}40`, background: `${COR}0d` }}>
              <p className="text-[11px] font-bold uppercase tracking-wider mb-1" style={{ color: COR }}>Escolhe por onde continuar</p>
              <p className="text-[13px] text-ink/60 leading-relaxed mb-4">
                A tua análise está pronta. Agora leva-a ao conteúdo:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/metodo/pilar-2/redes-sociais?aba=plano"
                  className="group inline-flex flex-1 items-center justify-between gap-2 px-5 py-3 rounded-full text-cream text-sm font-semibold"
                  style={{ background: COR }}
                >
                  Plano de Posts · Conteúdo Viral
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  to="/criacao-livre"
                  className="group inline-flex flex-1 items-center justify-between gap-2 px-5 py-3 rounded-full text-cream text-sm font-semibold"
                  style={{ background: COR }}
                >
                  Criação Livre
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            <div className="flex justify-between">
              <button onClick={() => setPasso(3)} className="px-5 py-3 rounded-xl bg-ink/5 text-ink/70 text-sm font-bold inline-flex items-center gap-1.5">
                <ArrowLeft size={15} /> Voltar
              </button>
              <button onClick={recomecar} className="text-sm font-bold text-ink/50 inline-flex items-center gap-1.5 hover:text-ink">
                <RotateCcw size={14} /> Nova análise
              </button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}
